import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import Posts from "@/components/post/Posts";
import { usePostStore } from "@/store/usePostStore";
import PostsLoading from "@/components/skeleton/PostsLoading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const Explore = () => {
  const [limit, setLimit] = useState(5);
  const { getPostsFromFollowings, posts, loading } = usePostStore();

  useEffect(() => {
    getPostsFromFollowings(limit);
  }, [limit]);

  useInfiniteScroll(loading, setLimit);

  return (
    <div className="flex">
      <div className="flex-grow">
        <div className="flex justify-center">
          <div className="w-full max-w-[30rem] px-2">
            <div className="md:mt-0 mt-12 md:mb-0 mb-12 py-6">
              {loading && limit === 5 ? (
                <PostsLoading />
              ) : (
                <div className="space-y-6">
                  {posts && posts.length > 0 ? (
                    posts.map((post) => <Posts post={post} key={post.postId} />)
                  ) : (
                    <NotFound />
                  )}
                  {loading && <PostsLoading />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[26rem] xl:block hidden">
        <div className="py-6 px-12"></div>
      </div>
    </div>
  );
};

export default Explore;
