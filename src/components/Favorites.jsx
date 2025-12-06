"use client";
import { useState, useEffect } from "react";
import { getFavoriteItems, getOutfitsByUser } from "@/src/lib/firebase/firestore";
import { toggleFavoriteItem } from "@/src/lib/firebase/firestore";
import { auth } from "@/src/lib/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function Favorites({ initialUser }) {
  const [activeTab, setActiveTab] = useState("items");
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
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
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const items = await getFavoriteItems(user.uid);
      setFavoriteItems(items || []);
      
      const outfits = await getOutfitsByUser(user.uid);
      const favorites = outfits.filter(outfit => outfit.isFavorite);
      setFavoriteOutfits(favorites || []);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoriteItems([]);
      setFavoriteOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (itemId, currentFavorite) => {
    try {
      await toggleFavoriteItem(itemId, currentFavorite);
      await loadFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading favorites...</div>;
  }

  if (!user) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <p>Please sign in to view your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="favorites-tabs">
        <button 
          className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          Favorite Items
        </button>
        <button 
          className={`tab-btn ${activeTab === "outfits" ? "active" : ""}`}
          onClick={() => setActiveTab("outfits")}
        >
          Favorite Outfits
        </button>
      </div>
      
      <div className="favorites-content">
        {activeTab === "items" && (
          <div className="favorite-clothing-section">
            <h2>Favorite Items</h2>
            {favoriteItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No favorite items yet</h3>
                <p>Mark items as favorite to see them here.</p>
              </div>
            ) : (
              <div className="favorite-items-grid">
                {favoriteItems.map(item => (
                  <div key={item.id} className="favorite-item-card">
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
                      <h3>{item.name}</h3>
                      <p>{item.category} • {item.color}</p>
                      <button 
                        className="icon-btn remove-favorite"
                        onClick={() => handleToggleFavorite(item.id, true)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "outfits" && (
          <div className="favorite-outfits-section">
            <h2>Favorite Outfits</h2>
            {favoriteOutfits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👗</div>
                <h3>No favorite outfits yet</h3>
                <p>Mark outfits as favorite to see them here.</p>
              </div>
            ) : (
              <div className="favorite-outfits-grid">
                {favoriteOutfits.map(outfit => (
                  <div key={outfit.id} className="favorite-outfit-card">
                    <div className="outfit-preview-mini">
                      {outfit.items && outfit.items.length > 0 ? (
                        outfit.items.slice(0, 3).map((itemId, idx) => (
                          <div key={idx} className="preview-item">👕</div>
                        ))
                      ) : (
                        <>
                          <div className="preview-item">👕</div>
                          <div className="preview-item">👖</div>
                          <div className="preview-item">👟</div>
                        </>
                      )}
                    </div>
                    <div className="outfit-info">
                      <h3>{outfit.name || "Untitled Outfit"}</h3>
                      <p>{outfit.category || "Uncategorized"}</p>
                      <button className="icon-btn remove-favorite">❤️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

