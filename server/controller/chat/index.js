const fs = require('fs').promises;
const cassandra = require('../../config/cassandra');
const { Notification, Chat, Profile, User } = require('../../models');
const { io, getReceiverSocketId } = require('../../config/socket');
const { uploadMediaToCloudinary } = require('../../utils/cloudinary');
const { Op } = require('sequelize');
const redis = require('../../config/redis.js');

async function getAllChat(req, res) {
  try {
    redis;
    const userId = req.user.userId;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'username'],
          include: { model: Profile, as: 'profile' },
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'username'],
          include: { model: Profile, as: 'profile' },
        },
      ],
    });

    const chatList = await Promise.all(
      chats.map(async (chat) => {
        const chatPartner = chat.user1_id === userId ? chat.user2 : chat.user1;

        // 🔹 Ambil status user dari Redis
        let status = await redis.get(`user_status:${chatPartner.id}`);
        if (!status) status = 'offline';

        return {
          chat_id: chat.id,
          username: chatPartner.username,
          avatar: chatPartner.profile ? chatPartner.profile.avatar : null,
          status,
        };
      }),
    );

    res.status(200).json(chatList);
  } catch (error) {
    console.error('❌ Error fetching chat list:', error);
    res.status(500).json({ message: 'Failed to retrieve chat list' });
  }
}

async function sendMessage(req, res) {
  const file = req.file;
  let { chat_id } = req.body;
  const sender_id = req.user.userId;
  const { receiver_id, message } = req.body;

  try {
    if (!sender_id || !receiver_id) {
      return res
        .status(400)
        .json({ message: 'Sender ID and Receiver ID are required' });
    }

    if (!chat_id) {
      // 🔍 Cek apakah chat sudah ada di MySQL
      const existingChat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1_id: sender_id, user2_id: receiver_id },
            { user1_id: receiver_id, user2_id: sender_id },
          ],
        },
      });

      if (existingChat) {
        chat_id = existingChat.id;
      } else {
        // 🔹 Buat chat baru dan ambil ID-nya
        const newChat = await Chat.create({
          user1_id: sender_id,
          user2_id: receiver_id,
        });
        chat_id = newChat.id;
      }
    }

    let media_url = '';
    let timestamp = new Date();

    if (file && file.path) {
      try {
        let uploadedImage = await uploadMediaToCloudinary(file.path);
        media_url = uploadedImage.secure_url;
        await fs.unlink(file.path);
      } catch (error) {
        if (file.path) await fs.unlink(file.path);
        return res.status(500).json({ message: 'Failed to upload media' });
      }
    }

    // 🔄 2. Simpan pesan di Cassandra dengan `chat_id` yang ditemukan
    const query =
      'INSERT INTO messages (chat_id, sender_id, receiver_id, message, media_url, timestamp) VALUES (?, ?, ?, ?, ?, ?)';
    await cassandra.execute(
      query,
      [chat_id, sender_id, receiver_id, message, media_url, timestamp],
      { prepare: true },
    );

    await Notification.create({
      receiverId: receiver_id,
      senderId: sender_id,
      type: 'message',
      isRead: false,
    });

    // 🔥 Kirim notifikasi real-time jika user sedang online
    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', {
        chat_id,
        sender_id,
        receiver_id,
        message,
        media_url,
        timestamp,
      });

      io.to(receiverSocketId).emit('new_notification', {
        sender_id,
        message: 'New message received',
      });
    }

    res.json({ message: 'Message sent successfully', chat_id });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error });
  }
}

async function getMessages(req, res) {
  const receiverId = req.params.receiverId; // 🔹 ID penerima dari params
  const userId = req.user.userId; // 🔹 ID pengguna yang login

  try {
    // 🔍 Cek apakah chat antara user ini dan receiver sudah ada di MySQL
    const chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1_id: userId, user2_id: receiverId },
          { user1_id: receiverId, user2_id: userId },
        ],
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'username'],
          include: { model: Profile, as: 'profile' },
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'username'],
          include: { model: Profile, as: 'profile' },
        },
      ],
    });

    // 🔹 Jika chat belum ada, kembalikan respons kosong
    if (!chat) {
      return res.status(200).json({ message: 'Start a new chat', data: [] });
    }

    // 🔹 Gunakan ID chat dari MySQL sebagai `chat_id`
    const chat_id = chat.id;

    // 🔄 Query pesan dari Cassandra berdasarkan `chat_id`
    const query = `SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp DESC`;
    const result = await cassandra.execute(query, [chat_id], { prepare: true });

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: 'No message found in history' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
}

async function getOnlineUsers(req, res) {
  try {
    const { userId } = req.params;
    let status = await redis.get(`user_status:${userId}`);
    if (!status) status = 'offline';

    res.status(200).json({ userId, status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user status' });
  }
}
module.exports = { getMessages, sendMessage, getAllChat, getOnlineUsers };
