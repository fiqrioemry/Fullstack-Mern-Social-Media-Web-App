import UserAvatar from "./Avatar";
import { Link } from "react-router-dom";

const Followings = ({ follow }) => {
  return (
    <div>
      <div className="flex gap-x-2">
        <UserAvatar user={follow} />
        <div className="text-sm">
          <Link>{follow.username}</Link>
          <div>{follow.fullname}</div>
        </div>
      </div>
    </div>
  );
};

export default Followings;
