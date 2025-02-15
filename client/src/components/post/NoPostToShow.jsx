import { Link } from "react-router-dom";

const NoPostToShow = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-100 ">
      <h2 className="text-xl font-semibold text-gray-700">
        You&apos;re Not Following Anyone
      </h2>
      <p className="text-gray-500 mt-2">
        Start following people to see their latest posts and updates on your
        feed.
      </p>
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Discover People to Follow
      </Link>
    </div>
  );
};

export default NoPostToShow;
