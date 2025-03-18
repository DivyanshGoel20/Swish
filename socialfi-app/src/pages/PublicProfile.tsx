import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const navigate = useNavigate();


    useEffect(() => {
        // loop through all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('profile-')) {
                const profileData = JSON.parse(localStorage.getItem(key) || '{}');
                if (profileData.username === username) {
                    setProfile(profileData);
                    break;
                }
            }
        }
    }, [username]);

    if (!profile) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button - aligned to top left */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>

                    {/* Centered error message */}
                    <div className="flex justify-center items-center h-80 text-center">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">
                                This page doesn’t exist
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Try searching for something else or check the username.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        {profile.imagePreview ? (
                            <img
                                src={profile.imagePreview}
                                className="w-24 h-24 rounded-full object-cover"
                                alt={profile.name}
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-300 text-2xl">👤</span>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold">{profile.name}</h2>
                            <p className="text-gray-400">@{profile.username}</p>
                            {profile.address && (
                                <p className="text-sm text-blue-400 mt-1 break-all">{profile.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-left">
                        <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
                        <p className="text-gray-300">{profile.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
