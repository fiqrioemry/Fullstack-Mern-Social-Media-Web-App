/* eslint-disable react/prop-types */
import Avatar from "@/components/post/Avatar";
import { Button } from "@/components/ui/button";

const UserFollowBox = ({ user }) => {
  return (
    <div className="flex items-center gap-x-4" key={user.userId}>
      <div className="w-14">
        <Avatar avatar={user.avatar} height={12} width={12} />
      </div>

      <div className="w-full text-sm">
        <h4>{user.username}</h4>
        <div>{user.fullname}</div>
      </div>

      <div className="max-w-20">
        {user.isFollowedByMe ? (
          <Button variant="ghost">following</Button>
        ) : (
          <Button variant="follow">Follow</Button>
        )}
      </div>
    </div>
  );
};

export default UserFollowBox;
