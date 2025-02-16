import { X } from "lucide-react";
import { useEffect } from "react";
import FollowCard from "./FollowCard";
import NoFollowers from "./NoFollowers";
import { useUserStore } from "@/store/useUserStore";
import { DialogClose } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import FollowLoading from "@/components/skeleton/FollowLoading";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Followers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const { getFollowers, followers, loading } = useUserStore();

  useEffect(() => {
    getFollowers(username);
  }, [getFollowers, username]);

  useEffect(() => {
    if (location.state?.background) {
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location]);

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && navigate(-1)}>
      <DialogTitle>
        <DialogContent className="sm:w-[400px] p-0" variant="detail">
          <div>
            <div className="flex justify-center items-center p-4 border-b relative">
              <h4>Followers</h4>
              <DialogClose className="absolute right-3">
                <X size={24} />
              </DialogClose>
            </div>

            <ScrollArea className="h-80 overflow-y-auto">
              {loading ? (
                <FollowLoading />
              ) : followers.length !== 0 ? (
                followers.map((user, index) => (
                  <FollowCard data={user} key={index} />
                ))
              ) : (
                <NoFollowers />
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </DialogTitle>
    </Dialog>
  );
};

export default Followers;
