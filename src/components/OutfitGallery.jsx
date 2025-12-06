"use client";
import { useState, useEffect } from "react";
import { getOutfitsByUser } from "@/src/lib/firebase/firestore";
import { auth } from "@/src/lib/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function OutfitGallery({ initialUser }) {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState(null);

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
      loadOutfits();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      if (user && user.uid) {
        loadOutfits();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const loadOutfits = async () => {
    try {
      setLoading(true);
      const userOutfits = await getOutfitsByUser(user.uid);
      console.log("Loaded outfits:", userOutfits);
      setOutfits(userOutfits || []);
    } catch (error) {
      console.error("Error loading outfits:", error);
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOutfits = selectedCategory
    ? outfits.filter(outfit => outfit.category === selectedCategory)
    : outfits;

  if (loading) {
    return <div className="loading-state">Loading outfits...</div>;
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1>Welcome to Smart Virtual Closet!</h1>
            <p>Please sign in to view your outfit gallery.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Outfit Gallery</h1>
        <p>All your saved outfits</p>
      </div>
      
      <div className="gallery-filters">
        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="sport">Sport</option>
          <option value="party">Party</option>
        </select>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setLoading(true);
            loadOutfits();
          }}
        >
          Refresh
        </button>
      </div>
      
      <div className="outfit-gallery-layout">
        <div className="outfit-gallery-grid">
          {filteredOutfits.length === 0 ? (
            <div className="empty-state">
              <p>No outfits found. {selectedCategory ? "Try a different category." : "Create your first outfit!"}</p>
            </div>
          ) : (
            filteredOutfits.map(outfit => (
              <div 
                key={outfit.id} 
                className={`outfit-card ${selectedOutfit?.id === outfit.id ? "selected" : ""}`}
                onClick={() => setSelectedOutfit(outfit)}
              >
                <div className="outfit-preview-image">
                  {outfit.imageUrl ? (
                    <img 
                      src={outfit.imageUrl} 
                      alt={outfit.name}
                      className="outfit-image"
                    />
                  ) : (
                    <div className="outfit-items-preview">
                      <div className="preview-item top">👕</div>
                      <div className="preview-item bottom">👖</div>
                      <div className="preview-item shoes">👟</div>
                    </div>
                  )}
                </div>
                <div className="outfit-card-info">
                  <h3>{outfit.name}</h3>
                  <p className="outfit-category">{outfit.category || "Uncategorized"}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {selectedOutfit && (
          <div className="outfit-detail-panel">
            <div className="outfit-detail-header">
              <h2>{selectedOutfit.name}</h2>
              <button 
                className="close-detail-btn"
                onClick={() => setSelectedOutfit(null)}
              >
                ×
              </button>
            </div>
            
            <div className="outfit-detail-image">
              {selectedOutfit.imageUrl ? (
                <img 
                  src={selectedOutfit.imageUrl} 
                  alt={selectedOutfit.name}
                  className="detail-outfit-image"
                />
              ) : (
                <div className="outfit-items-preview-large">
                  <div className="preview-item-large top">👕</div>
                  <div className="preview-item-large bottom">👖</div>
                  <div className="preview-item-large shoes">👟</div>
                </div>
              )}
            </div>
            
            <div className="outfit-detail-info">
              <div className="detail-info-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedOutfit.category || "Uncategorized"}</span>
              </div>
              {selectedOutfit.createdAt && (
                <div className="detail-info-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {selectedOutfit.createdAt.toDate ? 
                      selectedOutfit.createdAt.toDate().toLocaleDateString() : 
                      new Date(selectedOutfit.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )}
              {selectedOutfit.items && selectedOutfit.items.length > 0 && (
                <div className="detail-info-row">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{selectedOutfit.items.length} items</span>
                </div>
              )}
            </div>
            
            <div className="outfit-detail-actions">
              <button 
                className={`btn ${selectedOutfit.isFavorite ? "btn-primary" : "btn-secondary"}`}
                title={selectedOutfit.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {selectedOutfit.isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
              </button>
              <button className="btn btn-secondary">
                ✏️ Edit Outfit
              </button>
              <button className="btn btn-danger">
                🗑️ Delete Outfit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

