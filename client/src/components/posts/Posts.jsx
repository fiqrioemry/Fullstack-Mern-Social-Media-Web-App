/* eslint-disable react/prop-types */

import Author from "../Author";
import { Button } from "../ui/button";
import PostControl from "../PostControl";
import Galleries from "../posts/Galleries";
import CommentForm from "../posts/CommentForm";
import MiniCaption from "../posts/MiniCaption";
import DetailPostModal from "../modal/DetailPostModal";
import { useProvider } from "../../context/GlobalProvider";
import { useLocation, useNavigate } from "react-router-dom";

const Posts = ({ posts }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setMount } = useProvider();

  const handleNavigate = (post) => {
    setMount(true);
    navigate(`/p/${post.postId}`, { state: { background: location } });
  };

  return (
    <div className="space-y-6">
      <DetailPostModal />
      {posts.map((post, index) => (
        <div className="space-y-2 border-b" key={index}>
          <Author user={post} />
          <Galleries images={post.images} />
          <PostControl post={post} />
          <MiniCaption post={post} />
          <div>
            {post.commentCount !== 0 && (
              <Button onClick={() => handleNavigate(post)}>
                View all {post.commentCount} comments
              </Button>
            )}
          </div>
          <CommentForm />
        </div>
      ))}
    </div>
  );
};

export default Posts;
