const {
  User,
  Post,
  Profile,
  Comment,
  Notification,
  Like,
  sequelize,
} = require('../../models');

function extractMentions(content) {
  const mentionRegex = /@(\w+)/g;
  const matches = [...content.matchAll(mentionRegex)];
  return matches.map((match) => match[1]);
}

async function createComment(req, res) {
  const { userId } = req.user;
  const { content, parentId } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    let receiverId = post.userId;
    let type = 'comment';

    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }

      receiverId = parentComment.userId;
      type = 'reply';
    }

    const newComment = await Comment.create({
      userId,
      postId,
      parentId: parentId || null,
      content,
    });

    if (receiverId !== userId) {
      await Notification.create({
        receiverId,
        senderId: userId,
        postId,
        commentId: newComment.id,
        type,
      });
    }

    const mentionedUsernames = extractMentions(content);
    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.findAll({
        where: { username: mentionedUsernames },
        attributes: ['id', 'username'],
      });

      await Promise.all(
        mentionedUsers.map((mentionedUser) =>
          Notification.create({
            postId,
            type: 'mention',
            senderId: userId,
            receiverId: mentionedUser.id,
            commentId: newComment.id,
          }),
        ),
      );
    }

    return res.status(201).json('Comment added successfully');
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Failed to add comment');
  }
}

async function getComments(req, res) {
  const userId = req.user.userId;
  const postId = req.params.postId;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const commentsData = await Comment.findAndCountAll({
      where: { postId, parentId: null },
      limit,
      distinct: true,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Comment,
          as: 'replies',
          attributes: ['id'],
        },
        { model: Like, as: 'likes', attributes: ['id', 'userId'] },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['fullname', 'avatar'],
            },
          ],
        },
      ],
    });

    if (commentsData.count === 0) {
      return res
        .status(200)
        .json({ comments: [], message: 'User has no comment' });
    }

    const totalComments = commentsData.count;
    const comments = commentsData.rows.map((comment) => {
      return {
        postId: comment.postId,
        commentId: comment.id,
        userId: comment.userId,
        username: comment.user.username,
        avatar: comment.user.profile.avatar,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        likes: comment.likes.length,
        isLiked: comment.likes.some((like) => like.userId === userId),
        replies: comment.replies.length,
      };
    });
    return res.status(200).json({ comments, totalComments });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Failed to get comments');
  }
}

async function getReplies(req, res) {
  const userId = req.user.userId;
  const { postId, commentId } = req.params;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const repliesData = await Comment.findAndCountAll({
      where: { postId, parentId: commentId },
      limit,
      include: [
        { model: Like, as: 'likes', attributes: ['id', 'userId'] },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['fullname', 'avatar'],
            },
          ],
        },
      ],
      distinct: true,
      order: [['createdAt', 'DESC']],
    });

    if (repliesData.count === 0) {
      return res
        .status(200)
        .json({ replies: [], message: 'Comments has no replies' });
    }

    const totalReplies = repliesData.count;
    const replies = repliesData.rows.map((reply) => {
      return {
        postId: reply.postId,
        commentId: reply.id,
        userId: reply.userId,
        username: reply.user.username,
        avatar: reply.user.profile.avatar,
        content: reply.content,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        likes: reply.likes.length,
        isLiked: reply.likes.some((like) => like.userId === userId),
      };
    });
    return res.status(200).json({ replies, totalReplies });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get replies',
      error: error.message,
    });
  }
}

async function toggleLikeComment(req, res) {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  const t = await sequelize.transaction();

  try {
    const comment = await Comment.findByPk(commentId, { transaction: t });

    if (!comment) {
      await t.rollback();
      return res.status(404).json({ message: 'Comment not found' });
    }

    const like = await Like.findOne({
      where: { userId, entityId: commentId, entityType: 'comment' },
      transaction: t,
    });

    if (like) {
      await like.destroy({ transaction: t });

      await Notification.destroy({
        where: {
          senderId: userId,
          receiverId: comment.userId,
          commentId: commentId,
          type: 'like',
        },
        transaction: t,
      });

      await t.commit();
      return res.status(200).json({ message: 'You unliked the comment' });
    }

    await Like.create(
      { userId, entityId: commentId, entityType: 'comment' },
      { transaction: t },
    );

    if (comment.userId !== userId) {
      await Notification.create(
        {
          receiverId: comment.userId,
          senderId: userId,
          comment: commentId,
          type: 'like',
        },
        { transaction: t },
      );
    }

    await t.commit();
    return res.status(200).json({ message: 'You Liked the comment' });
  } catch (error) {
    await t.rollback();
    console.log(error.message);
    return res.status(500).json({ message: 'Failed to toggle like' });
  }
}

async function deleteComment(req, res) {
  const { userId } = req.user;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findOne({ where: { id: commentId } });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.destroy();

    return res.status(200).json({ message: 'Comment is deleted' });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete comment',
      error: error.message,
    });
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
  toggleLikeComment,
  getReplies,
};
