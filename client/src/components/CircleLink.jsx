// src/components/CircleLink.js
import React from "react";
import { Link } from "react-router-dom";

const CircleLink = ({ src, title, link, width = "w-28", height = "h-28" }) => {
  return (
    <Link to={link}>
      <div className="overflow-hidden flex flex-col items-center gap-2">
        <img
          src={src}
          className={`w-16 h-16 sm:w-18 sm:h-18 md:w-16 md:h-16 lg:h-28 lg:w-28 rounded-full object-cover transition-transform duration-300 hover:scale-105`}
          loading="lazy"
        />
        <h3 className="text-center font-semibold transform:none text-xs md:text-md">{title}</h3>
      </div>
    </Link>
  );
};

export default CircleLink;
