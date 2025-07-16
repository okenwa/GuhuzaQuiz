'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBadges } from "../context/badgeContext";
import BadgeSystem from "./badges/BadgeSystem";
import Toast from "./Toast";
import { updateProfile, uploadAvatar, validateImageFile } from "@/utils/profileUtils";
import Popup from "./Popup"; // Added import for Popup

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

// Inline WhatsApp SVG icon as a React component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
  </svg>
);

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
  const [showInviteModal, setShowInviteModal] = useState(false);
  // Placeholder referral code (could be generated per user)
  const referralCode = player?.Player_ID ? `GUHUZA${player.Player_ID}` : 'GUHUZA12345';
  // Shareable link (could include referral code)
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${referralCode}` : `https://guhuza.com/signup?ref=${referralCode}`;
  // Email state
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  // Social share text
  const shareText = encodeURIComponent('Join me on Guhuza Quiz! Try to beat my score!');

  // Email invite handler (placeholder)
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(false);
    setEmailError("");

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, inviteLink: shareLink }),
      });
      if (res.ok) {
        setEmailSent(true);
        setInviteEmail("");
      } else {
        const data = await res.json();
        setEmailError(data.message || "Failed to send invite.");
      }
    } catch (err) {
      setEmailError("Failed to send invite.");
    }
  };

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
            {/* Edit Profile and Invite Friends Buttons */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
              >
                {isEditing ? 'Close Edit' : 'Edit Profile'}
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                Invite Friends
              </button>
            </div>
            {/* Invite Modal */}
            {showInviteModal && (
              <Popup isOpen={showInviteModal} closePopup={() => setShowInviteModal(false)} points={0}>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">Invite Friends</h2>
                  {/* Email Invite */}
                  <form onSubmit={handleSendInvite} className="flex flex-col gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">Invite by Email:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="border rounded px-2 py-1 flex-1"
                        required
                      />
                      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
                    </div>
                    {emailSent && <span className="text-green-600 text-xs">Invite sent!</span>}
                    {emailError && <span className="text-red-600 text-xs">{emailError}</span>}
                  </form>
                  {/* Shareable Link */}
                  <div className="mb-2">
                    <label className="text-sm font-medium text-gray-700">Shareable Link:</label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="text"
                        value={shareLink} readOnly
                        className="border rounded px-2 py-1 flex-1 bg-gray-100 text-gray-700"
                      />
                      <button
                        type="button"
                        className="bg-gray-300 px-2 py-1 rounded text-xs"
                        onClick={() => {navigator.clipboard.writeText(shareLink)}}
                      >Copy</button>
                    </div>
                  </div>
                  {/* Social Sharing */}
                  <div className="mb-2">
                    <label className="text-sm font-medium text-gray-700">Share on Social:</label>
                    <div className="flex gap-2 mt-1">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" title="Facebook" className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                        <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${shareText}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" title="Twitter" className="bg-blue-400 hover:bg-blue-500 p-2 rounded">
                        <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} />
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="LinkedIn" className="bg-blue-700 hover:bg-blue-800 p-2 rounded">
                        <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                      </a>
                      <a href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" title="WhatsApp" className="bg-green-500 hover:bg-green-600 p-2 rounded">
                        <WhatsAppIcon />
                      </a>
                    </div>
                  </div>
                  {/* Referral Code */}
                  <div className="mb-2">
                    <label className="text-sm font-medium text-gray-700">Your Referral Code:</label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="text"
                        value={referralCode} readOnly
                        className="border rounded px-2 py-1 flex-1 bg-gray-100 text-gray-700"
                      />
                      <button
                        type="button"
                        className="bg-gray-300 px-2 py-1 rounded text-xs"
                        onClick={() => {navigator.clipboard.writeText(referralCode)}}
                      >Copy</button>
                    </div>
                  </div>
                </div>
              </Popup>
            )}

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