import React, { useState } from 'react';
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
  TelegramIcon
} from 'react-share';

const ShareButton = ({ title, description, url, hashtags = [] }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Check out Agriculture AI - Smart Farming System';
  const shareDescription = description || 'AI-powered farming assistance for better crop management';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Share this</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="flex flex-col items-center">
                <WhatsappShareButton
                  url={shareUrl}
                  title={shareTitle}
                  separator=" - "
                >
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <span className="text-xs mt-1 text-gray-600">WhatsApp</span>
              </div>

              <div className="flex flex-col items-center">
                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  hashtags={hashtags.length > 0 ? hashtags : ['AgricultureAI', 'SmartFarming']}
                >
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <span className="text-xs mt-1 text-gray-600">Twitter</span>
              </div>

              <div className="flex flex-col items-center">
                <FacebookShareButton
                  url={shareUrl}
                  quote={shareTitle}
                  hashtag="#AgricultureAI"
                >
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <span className="text-xs mt-1 text-gray-600">Facebook</span>
              </div>

              <div className="flex flex-col items-center">
                <TelegramShareButton
                  url={shareUrl}
                  title={shareTitle}
                >
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
                <span className="text-xs mt-1 text-gray-600">Telegram</span>
              </div>
            </div>

            {/* Copy Link */}
            <div className="border-t pt-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </div>
  );
};

export default ShareButton;
