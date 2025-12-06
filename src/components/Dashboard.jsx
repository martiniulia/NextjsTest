"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getClothingItemsByUser } from "@/src/lib/firebase/firestore";
import { auth } from "@/src/lib/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard({ initialUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      loadClothingItems();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const loadClothingItems = async () => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }
    try {
      const userItems = await getClothingItemsByUser(user.uid);
      setItems(userItems || []);
    } catch (error) {
      console.error("Error loading items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">Loading your wardrobe...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1>Welcome to Smart Virtual Closet!</h1>
            <p>Please sign in to start managing your wardrobe.</p>
          </div>
        </div>
      </div>
    );
  }

  const favoriteItems = items.filter(item => item.isFavorite).slice(0, 4);
  const recentItems = [...items].sort((a, b) => {
    const dateA = a.timestamp || a.createdAt?.toDate?.() || new Date(0);
    const dateB = b.timestamp || b.createdAt?.toDate?.() || new Date(0);
    return dateB - dateA;
  }).slice(0, 8);
  
  const stats = {
    totalItems: items.length,
    categories: new Set(items.map(item => item.category)).size,
    favoriteItems: items.filter(item => item.isFavorite).length,
    savedOutfits: 0, 
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>My Wardrobe</h1>
          <p>Welcome back! Here's an overview of your closet.</p>
        </div>
        <Link href="/add-item" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👕</div>
          <div className="stat-content">
            <h3>{stats.totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{stats.favoriteItems}</h3>
            <p>Favorites</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👗</div>
          <div className="stat-content">
            <h3>{stats.savedOutfits}</h3>
            <p>Saved Outfits</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link href="/add-item" className="action-card primary">
          <div className="action-icon">➕</div>
          <h3>Add New Item</h3>
          <p>Add a new clothing item to your wardrobe</p>
        </Link>
        <Link href="/outfit-creator" className="action-card">
          <div className="action-icon">🎨</div>
          <h3>Create Outfit</h3>
          <p>Design a new outfit from your items</p>
        </Link>
        <Link href="/ai-recommendations" className="action-card">
          <div className="action-icon">🤖</div>
          <h3>AI Recommendations</h3>
          <p>Get smart outfit suggestions</p>
        </Link>
        <Link href="/calendar" className="action-card">
          <div className="action-icon">📅</div>
          <h3>Plan Outfits</h3>
          <p>Schedule outfits for your week</p>
        </Link>
      </div>

      {favoriteItems.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Favorite Items</h2>
            <Link href="/favorites" className="view-all-link">View All →</Link>
          </div>
          <div className="items-grid">
            {favoriteItems.map(item => (
              <div key={item.id} className="item-card">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="item-image"
                  />
                ) : (
                  <div className="item-image-placeholder">📷</div>
                )}
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-details">{item.category} • {item.color}</p>
                  <span className="favorite-badge">❤️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Items</h2>
          <Link href="/" className="view-all-link">View All →</Link>
        </div>
        {recentItems.length > 0 ? (
          <div className="items-grid">
            {recentItems.map(item => (
              <div key={item.id} className="item-card">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="item-image"
                  />
                ) : (
                  <div className="item-image-placeholder">📷</div>
                )}
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-details">{item.category} • {item.color}</p>
                  {item.isFavorite && <span className="favorite-badge">❤️</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👕</div>
            <h3>Your wardrobe is empty!</h3>
            <p>Start building your virtual closet by adding your first item.</p>
            <Link href="/add-item" className="btn btn-primary">Add Your First Item</Link>
          </div>
        )}
      </div>
    </div>
  );
}
