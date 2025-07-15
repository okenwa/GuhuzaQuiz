export interface ProfileData {
  nickname?: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
}

export const updateProfile = async (profileData: ProfileData) => {
  const response = await fetch('/api/profile/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('/api/profile/update', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }

  return response.json();
};

export const validateImageFile = (file: File) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  return true;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateRandomNickname = () => {
  const adjectives = [
    'Swift', 'Clever', 'Brave', 'Lucky', 'Mighty', 'Happy', 'Witty', 'Nimble', 'Bold', 'Chill', 'Sunny', 'Funky', 'Quiz', 'Epic', 'Cosmic', 'Rapid', 'Silent', 'Magic', 'Wild', 'Bright'
  ];
  const nouns = [
    'Falcon', 'Ninja', 'Tiger', 'Wizard', 'Panda', 'Otter', 'Eagle', 'Lion', 'Shark', 'Wolf', 'Phoenix', 'Genius', 'Hero', 'Star', 'Rocket', 'Knight', 'Fox', 'Hawk', 'Bear', 'Dragon'
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${number}`;
}; 