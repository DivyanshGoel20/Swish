import { create } from 'zustand';

type Profile = {
  name: string;
  username: string;
  bio: string;
  imagePreview: string;
  nftMinted: boolean;
};

type ProfileStore = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  resetProfile: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    name: '',
    username: '',
    bio: '',
    imagePreview: '',
    nftMinted: false,
  },
  setProfile: (profile) => set({ profile }),
  resetProfile: () =>
    set({
      profile: {
        name: '',
        username: '',
        bio: '',
        imagePreview: '',
        nftMinted: false,
      },
    }),
}));
