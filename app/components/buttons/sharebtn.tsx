import { useState, useRef, useEffect } from "react";
import { FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

interface ShareButtonProps {
  shareText?: string;
  shareUrl?: string;
  buttonClassName?: string;
}

const ShareButton = ({ shareText, shareUrl, buttonClassName = "quizSbtn" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Convert localhost URL to production URL
  const getShareUrl = (url: string) => {
    if (url.includes('localhost')) {
      // Replace localhost URL with production URL
      return url.replace(/http:\/\/localhost:\d+/, 'https://guhuza.com');
    }
    return url;
  };

  const websiteUrl = getShareUrl(shareUrl || "https://guhuza.com/");
  const text = encodeURIComponent(shareText || "Check out this amazing website! 🚀");
  
  // For Facebook, we need to use a different approach
  const facebookText = encodeURIComponent(shareText || "Check out this amazing website! 🚀");

  console.log('LinkedIn share websiteUrl:', websiteUrl);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${buttonClassName}`}
      >
        <FaShareAlt /> Share
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-3 w-48 z-10"
        >
          <p className="text-sm text-gray-700 mb-2">Share this page:</p>
          <div className="flex flex-col space-y-2">
                         <a
               href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-blue-700 hover:underline"
               onClick={() => {
                 // Try to copy text to clipboard for manual pasting
                 navigator.clipboard.writeText(shareText || "Check out this amazing website! 🚀");
                 alert("Share text copied to clipboard! You can paste it manually in Facebook.");
               }}
             >
               <FaFacebook /> Facebook
             </a>
             <a
               href={`https://twitter.com/intent/tweet?url=${websiteUrl}&text=${text}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-blue-400 hover:underline"
             >
               <FaTwitter /> Twitter (X)
             </a>
             <a
               href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-blue-600 hover:underline"
               onClick={() => {
                 // Try to copy text to clipboard for manual pasting
                 navigator.clipboard.writeText(shareText || "Check out this amazing website! 🚀");
                 alert("Share text copied to clipboard! You can paste it manually in LinkedIn.");
               }}
             >
               <FaLinkedin /> LinkedIn
             </a>

                         <a
               href={`https://api.whatsapp.com/send?text=${text} ${websiteUrl}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-green-600 hover:underline"
             >
               <FaWhatsapp /> WhatsApp
             </a>
             <a
               href={`https://www.tiktok.com/share?url=${encodeURIComponent(websiteUrl)}&text=${text}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-black hover:underline"
               onClick={() => {
                 // Try to copy text to clipboard for manual pasting
                 navigator.clipboard.writeText(shareText || "Check out this amazing website! 🚀");
                 alert("Share text copied to clipboard! You can paste it manually in TikTok.");
               }}
             >
               <FaTiktok /> TikTok
             </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
