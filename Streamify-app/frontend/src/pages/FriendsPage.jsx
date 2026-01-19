import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';

const FriendsPage = () => {
  const { authUser } = useAuthUser();
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  if (isLoading) {
    return <div className="p-6">Loading friends...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
      {!friends || friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid gap-4">
          {friends.map(friend => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage; 