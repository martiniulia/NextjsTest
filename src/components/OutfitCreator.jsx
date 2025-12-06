"use client";
import { useState, useEffect } from "react";
import { getClothingItemsByUser, createOutfit } from "@/src/lib/firebase/firestore";
import { auth } from "@/src/lib/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function OutfitCreator({ initialUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    outerwear: null,
    shoes: null
  });
  const [outfitName, setOutfitName] = useState("");
  const [outfitCategory, setOutfitCategory] = useState("");
  const [saving, setSaving] = useState(false);

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
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadClothingItems = async () => {
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

  const getItemsByCategory = (category) => {
    return items.filter(item => {
      const itemCategory = item.category?.toLowerCase() || "";
      if (category === "top") {
        return itemCategory.includes("top") || itemCategory.includes("dress") || itemCategory.includes("shirt") || itemCategory.includes("blouse");
      }
      if (category === "bottom") {
        return itemCategory.includes("bottom") || itemCategory.includes("pants") || itemCategory.includes("jeans") || itemCategory.includes("skirt");
      }
      if (category === "outerwear") {
        return itemCategory.includes("outerwear") || itemCategory.includes("jacket") || itemCategory.includes("coat");
      }
      if (category === "shoes") {
        return itemCategory.includes("shoes") || itemCategory.includes("sneakers") || itemCategory.includes("boots");
      }
      return false;
    });
  };

  const handleSelectItem = (category, itemId) => {
    const item = items.find(i => i.id === itemId);
    setSelectedItems(prev => ({
      ...prev,
      [category]: item || null
    }));
  };

  const handleRemoveItem = (category) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleSaveOutfit = async () => {
    if (!user || !outfitName.trim()) {
      alert("Please enter an outfit name");
      return;
    }

    const selectedItemIds = Object.values(selectedItems)
      .filter(item => item !== null)
      .map(item => item.id);

    if (selectedItemIds.length === 0) {
      alert("Please select at least one item for your outfit");
      return;
    }

    setSaving(true);
    try {
      await createOutfit(user.uid, {
        name: outfitName,
        category: outfitCategory || "casual",
        items: selectedItemIds
      });
      
      setSelectedItems({
        top: null,
        bottom: null,
        outerwear: null,
        shoes: null
      });
      setOutfitName("");
      setOutfitCategory("");
      alert("Outfit saved successfully!");
    } catch (error) {
      console.error("Error saving outfit:", error);
      alert("Error saving outfit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading items...</div>;
  }

  return (
    <div className="outfit-creator">
      <div className="outfit-creator-layout">
        <div className="wardrobe-items-section">
          <h2>Available Items</h2>
          {items.length === 0 ? (
            <div className="empty-items">
              <p>No items available. Add items to your wardrobe first.</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map(item => (
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
                    <p className="item-name">{item.name}</p>
                    <p className="item-category">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="outfit-preview-section">
          <h2>Create Your Outfit</h2>
          
          <div className="outfit-builder">
            {["top", "bottom", "outerwear", "shoes"].map(category => {
              const categoryItems = getItemsByCategory(category);
              const selectedItem = selectedItems[category];
              const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
              
              return (
                <div key={category} className="outfit-slot-select">
                  <label className="slot-label">{categoryLabel}</label>
                  {selectedItem ? (
                    <div className="selected-item-display">
                      <div className="selected-item-content">
                        {selectedItem.imageUrl ? (
                          <img 
                            src={selectedItem.imageUrl} 
                            alt={selectedItem.name}
                            className="selected-item-image"
                          />
                        ) : (
                          <div className="selected-item-placeholder">📷</div>
                        )}
                        <div className="selected-item-info">
                          <span className="selected-item-name">{selectedItem.name}</span>
                          <span className="selected-item-category">{selectedItem.category}</span>
                        </div>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(category)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <select
                      className="item-select"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleSelectItem(category, e.target.value);
                        }
                      }}
                    >
                      <option value="">Select {categoryLabel.toLowerCase()}</option>
                      {categoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.category})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="outfit-actions">
            <input 
              type="text" 
              placeholder="Outfit name (ex: Casual Weekend)" 
              className="outfit-name-input"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
            />
            <select 
              className="outfit-category-select"
              value={outfitCategory}
              onChange={(e) => setOutfitCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="sport">Sport</option>
              <option value="party">Party</option>
            </select>
            <button 
              className="btn btn-primary"
              onClick={handleSaveOutfit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Outfit"}
            </button>
          </div>
        </div>
      </div>    
    </div>
  );
}

