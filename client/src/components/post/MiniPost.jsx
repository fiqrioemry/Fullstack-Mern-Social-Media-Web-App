/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { HeartIcon, MessageCircle } from "lucide-react";

const MiniPost = ({ post }) => {
  const location = useLocation();

  return (
    <div className="md:h-60 md:w-60 w-40 h-40 overflow-hidden relative">
      <Link
        to={`/p/${post.postId}`}
        state={{ background: location }}
        className="absolute top-0 bottom-0 left-0 right-0 hover:bg-black/50 bg-transparent flex-center duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-x-2 text-white">
            {post.likes}
            <HeartIcon />
          </div>
          <div className="flex gap-x-2 text-white">
            {post.comments}
            <MessageCircle />
          </div>
        </div>
      </Link>

      <img
        className="w-full h-full object-cover"
        src={post.images[0]}
        alt="image"
      />
    </div>
  );
};

export default MiniPost;
