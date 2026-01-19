
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./themeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
const Navbar = () => {
   const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // Notification count logic
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 5000, // Refetch every 5 seconds for near real-time updates
  });
  const incomingRequests = friendRequests?.incomingReqs || [];
  // Only count incoming friend requests for the notification badge
  let notificationCount = incomingRequests.length;

  // Reset notification count if on notifications or home page
  if (location.pathname === "/notifications" || location.pathname === "/") {
    notificationCount = 0;
  }
  
 const {logoutMutation} = useLogout();
   return  <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          
     {isChatPage && (
      <div className="pl-5">
        <Link to="/" className="flex items-center gap-2.5">
         <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
        </Link>
        </div> 
     )}
     <div className="flex items-center gap-3 sm:gap-4 ml-auto" >
      <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </Link>
     </div>
     {/* todo  */}
     <ThemeSelector/>
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>
{/* logout */}

<button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
          </div>
        </div>
    </nav>;
};

export default Navbar;