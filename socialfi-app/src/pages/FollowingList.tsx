import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const FollowingList = () => {
  const { username } = useParams();
  const [following, setFollowing] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Find the profile of the user whose username is in the URL
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("profile-")) {
        const profile = JSON.parse(localStorage.getItem(key) || "{}");
        if (profile.username === username) {
          // Get wallet addresses the user is following
          const followingAddresses = profile.following || [];

          // Fetch full profile objects of those users
          const followingProfiles = followingAddresses.map((addr: string) => {
            const data = localStorage.getItem(`profile-${addr}`);
            return data ? JSON.parse(data) : null;
          }).filter(Boolean);

          setFollowing(followingProfiles);
          break;
        }
      }
    }
  }, [username]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back to Profile */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/${username}`)}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
          >
            ← Back to Profile
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">Following</h1>

        <div className="space-y-4">
          {following.length === 0 ? (
            <p className="text-gray-400">Not following anyone yet.</p>
          ) : (
            following.map((user, index) => (
              <div
                key={index}
                onClick={() => navigate(`/${user.username}`)}
                className="p-4 bg-white/10 backdrop-blur-lg rounded-xl text-white hover:bg-white/20 cursor-pointer transition"
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-300">@{user.username}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingList;
