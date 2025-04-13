import React, { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { Share2 } from "lucide-react";

const ShareButton = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-500">
      <button
        onClick={toggleDropdown}
        className="flex items-center p-2 cursor-pointer"
      >
        <Share2 color="#194A34" size={12}/>
        <span className="ml-2 text-sm">Share</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white shadow-lg rounded-lg p-2 w-48 z-50">
          <div className="flex flex-col">
            <FacebookShareButton url={url} quote={title}>
              <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FacebookIcon size={24} round />
                <span className="ml-2 text-sm">Facebook</span>
              </div>
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                <TwitterIcon size={24} round />
                <span className="ml-2 text-sm">Twitter</span>
              </div>
            </TwitterShareButton>
            <WhatsappShareButton url={url} title={title}>
              <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                <WhatsappIcon size={24} round />
                <span className="ml-2 text-sm">WhatsApp</span>
              </div>
            </WhatsappShareButton>
            <a
              href={`https://www.instagram.com/sharing?url=${url}`} // Instagram sharing link (Instagram does not support direct sharing)
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="w-6 h-6 rounded-full"
              />
              <span className="ml-2 text-sm">Instagram</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
