/* eslint-disable react/prop-types */
import Timestamp from "./Timestamp";
import { Link } from "react-router-dom";

const Caption = ({ post }) => {
  return (
    <div className="flex items-start space-x-3">
      <div>
        <img
          src={post.avatar}
          alt="User Avatar"
          className="w-9 h-9 flex-shrink-0 border rounded-full"
        />
      </div>

      {/* Username & Content */}
      <div className="flex-1">
        <Link to={`${post.username}`} className="text-sm font-medium">
          {post.username}
        </Link>
        <p className="text-sm">{post.content}</p>
        <Timestamp createdAt={post.createdAt} />
      </div>
    </div>
  );
};

export default Caption;
