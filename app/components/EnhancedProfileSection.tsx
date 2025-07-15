'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBadges } from "../context/badgeContext";
import BadgeSystem from "./badges/BadgeSystem";
import Toast from "./Toast";
import { updateProfile, uploadAvatar, validateImageFile } from "@/utils/profileUtils";

type ProgressBarType = {
  percentage: number;
};

const ProgressBar = ({ percentage }: ProgressBarType) => {
  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-300">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      >
        {Math.floor(percentage)}%
      </div>
    </div>
  );
};

type milestoneType = {
  Milestone_Id: number;
  Milestone_Title: string;
  Milestone_description: string;
  UnlockingLevel: number;
  Milestone_reward_message: string;
  Milestone_Link: string;
  Milestone_Button_CTA: string;
};

type playerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  streak: number;
  lastLogin: Date;
  Level_Id: number;
  Milestone_Id?: number;
  milestone: milestoneType;
  nickname?: string;
};

type typePlayerHeroSection = {
  player: playerType;
  playerRank: number;
  session: any;
};

function EnhancedProfileSection({ player, playerRank, session }: typePlayerHeroSection) {
  const { userBadges } = useBadges();
  const router = useRouter();
  
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    nickname: player?.nickname || '',
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    email: session?.user?.email || '',
    bio: '',
    location: '',
    website: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClaimReward = () => {
    router.push("/reward");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAvatarUploading(true);
      
      try {
        // Validate file
        validateImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Upload to server
        const result = await uploadAvatar(file);
        console.log('Avatar uploaded successfully:', result);
        setToast({ message: 'Avatar uploaded successfully!', type: 'success' });
        
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setToast({ message: error instanceof Error ? error.message : 'Failed to upload avatar', type: 'error' });
        // Reset preview on error
        setAvatarPreview(null);
      } finally {
        setIsAvatarUploading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(formData);
      console.log('Profile updated successfully:', result);
      setIsEditing(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ message: error instanceof Error ? error.message : 'Failed to update profile', type: 'error' });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      nickname: player?.nickname || '',
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      email: session?.user?.email || '',
      bio: '',
      location: '',
      website: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div 
                className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Profile Avatar"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold">
                      {session?.user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {isAvatarUploading ? 'Uploading...' : 'Change Photo'}
                  </span>
                </div>
              </div>
              
              {/* Upload Indicator */}
              {isAvatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            
            <p className="text-center text-white/80 text-sm mt-2">
              Click to upload avatar
            </p>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">
                {isEditing ? 'Edit Profile' : `Hello, ${player?.Player_name}`}
              </h1>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              /* Edit Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nickname</label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Nickname (display name)"
                  />
                  <p className="text-xs text-white/60 mt-1">This will be shown on the leaderboard and your profile.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Display Info */
              <div className="space-y-2">
                <p className="text-xl text-white/90">
                  {formData.nickname || session?.user?.firstName || 'Anonymous'}
                </p>
                <p className="text-white/80">{session?.user?.email}</p>
                {formData.bio && <p className="text-white/80">{formData.bio}</p>}
                {formData.location && <p className="text-white/80">📍 {formData.location}</p>}
                {formData.website && (
                  <a 
                    href={formData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    🌐 {formData.website}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">#{playerRank}</div>
            <div className="text-white/80">Global Rank</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">{player?.Playerpoint.toLocaleString()}</div>
            <div className="text-white/80">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">{player?.Level_Id}</div>
            <div className="text-white/80">Current Level</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">🔥 {player?.streak}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">Correct Answers</span>
                <span className="font-semibold">{Math.floor(player?.Playerpoint / 30)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Questions Attempted</span>
                <span className="font-semibold">{Math.floor(player?.Playerpoint / 5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Accuracy Rate</span>
                <span className="font-semibold">85%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Next Milestone</h3>
            <p className="text-white/80 mb-2">{player?.milestone?.Milestone_Title}</p>
            <ProgressBar percentage={(player?.milestone?.UnlockingLevel - player?.Level_Id) < 0 ? 100 : (player?.Level_Id / player?.milestone?.UnlockingLevel) * 100} />
            <p className="text-sm text-white/60 mt-2">
              {((player?.milestone?.UnlockingLevel - player?.Level_Id) < 0 ? 0 : player?.milestone?.UnlockingLevel - player?.Level_Id)} more levels to unlock
            </p>
            <button 
              className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={player?.Level_Id < player?.milestone?.UnlockingLevel}
              onClick={handleClaimReward}
            >
              Claim Reward
            </button>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
          <BadgeSystem userBadges={userBadges} />
        </div>

        {/* Settings Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Public Profile</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Show Online Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200">
                Delete Account
              </button>
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200">
                Export Data
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedProfileSection; 