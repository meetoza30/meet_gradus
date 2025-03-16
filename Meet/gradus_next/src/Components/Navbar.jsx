"use client"; // Ensures it runs in client-side rendering (CSR)

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import '../styles/navbar.css'


const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar border-b-2 pb-2 border-green-300">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link href="/">
            <img src='https://res.cloudinary.com/dlsgdlo8u/image/upload/v1742127578/gradus_logo-rbg_wuzawn.png' alt="Logo" width={150} height={50} />
          </Link>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        <div className="navbar-actions">
          <Link href="/welcome" className="switch-button">
            Switch
          </Link>

          <div className="profile-container">
            <div className="profile-image" onClick={toggleProfileMenu}>
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            {isProfileOpen && (
              <div className="profile-popup border border-green-300">
                <div className="profile-header">
                  <div className="profile-photo">
                    <Image
                      src="https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">Elon</div>
                    <div className="view-profile text-white">View Your Profile</div>
                  </div>
                </div>
                <div className="menu-items">
                  <div className="menu-item">Your Saved Playlists</div>
                  <div className="menu-item">Revise</div>
                  <div className="menu-item">Log-out</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
