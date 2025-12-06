"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/src/lib/firebase/clientApp";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (signingIn) return;
    setSigningIn(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setShowMenu(false);
  };

  return (
    <header>
      <Link href="/" className="logo">
        <span>👗</span>
        Smart Virtual Closet
      </Link>

      {user ? (
        <nav className="nav-menu">
          <Link href="/" className="nav-link">Wardrobe</Link>
          <Link href="/add-item" className="nav-link">Add Item</Link>
          <Link href="/outfit-creator" className="nav-link">Create Outfit</Link>
          <Link href="/outfit-gallery" className="nav-link">Outfit Gallery</Link>
          <Link href="/favorites" className="nav-link">Favorites</Link>
          <Link href="/calendar" className="nav-link">Calendar</Link>
          <Link href="/ai-recommendations" className="nav-link">AI Recommendations</Link>
          <Link href="/travel-planner" className="nav-link">Travel Planner</Link>
        </nav>
      ) : null}

      {user ? (
        <div className="profile">
          <div
            className="profile-info"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <img
              className="profileImage"
              src={user.photoURL || "/profile.svg"}
              alt={user.email}
            />
            <span className="profile-name">
              {user.displayName?.split(" ")[0] ||
                user.email.split("@")[0]}
            </span>
          </div>

          {showMenu && (
            <div className="menu-dropdown">
              <div className="user-details">
                <img
                  className="dropdown-profileImage"
                  src={user.photoURL || "/profile.svg"}
                  alt={user.email}
                />
                <div className="user-text">
                  <div className="user-name">{user.displayName}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              <div className="menu-divider"></div>

              <button className="sign-out-btn" onClick={handleSignOut}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn} className="sign-in-link">
            {signingIn ? (
              "Signing in…"
            ) : (
              <>
                <img src="/profile.svg" alt="Sign in" />
                Sign In with Google
              </>
            )}
          </a>
        </div>
      )}
    </header>
  );
}
