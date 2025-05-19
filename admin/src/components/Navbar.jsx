// Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 fixed w-full left-52">
      <h2 className="text-xl">My Admin Dashboard</h2>
      <div className="space-x-4">
        <span className="cursor-pointer hover:underline">Home</span>
        <span className="cursor-pointer hover:underline">Profile</span>
        <span className="cursor-pointer hover:underline">Logout</span>
      </div>
    </div>
  );
};

export default Navbar;
