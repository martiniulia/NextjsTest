"use client";
import { useState } from "react";
import { useUser } from "@/src/lib/hooks/useUser";
import { addClothingItem, updateClothingItemImage } from "@/src/lib/firebase/firestore";
import { uploadClothingImage } from "@/src/lib/firebase/storage";
import { clothingCategories, clothingColors, seasons, clothingOccasions } from "@/src/lib/wardrobeData";

export default function AddClothingItem({ onClose, onItemAdded, editItem = null }) {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    name: editItem?.name || "",
    category: editItem?.category || "",
    color: editItem?.color || "",
    season: editItem?.season || "",
    image: null,
    tags: editItem?.tags || []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (editItem) {
        console.log("Edit mode - to be implemented");
      } else {
        const itemId = await addClothingItem(user.uid, {
          name: formData.name,
          category: formData.category,
          color: formData.color,
          season: formData.season,
          tags: formData.tags
        });

        if (formData.image) {
          const imageUrl = await uploadClothingImage(user.uid, itemId, formData.image);
          await updateClothingItemImage(itemId, imageUrl);
        }
      }
      if (!editItem) {
        setFormData({
          name: "",
          category: "",
          color: "",
          season: "",
          image: null,
          tags: []
        });
        setTagInput("");
      
        const fileInput = document.getElementById("image");
        if (fileInput) fileInput.value = "";
      }

      if (onItemAdded) onItemAdded();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving clothing item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="clothing-form-container">
      <div className="clothing-form">
        <div className="clothing-form-header">
          <h2>{editItem ? "Edit Clothing Item" : "Add Clothing Item"}</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose} type="button">×</button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Ex: White Blouse"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select category</option>
                {clothingCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color *</label>
              <select
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                required
              >
                <option value="">Select color</option>
                {clothingColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="season">Season</label>
              <select
                id="season"
                value={formData.season}
                onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
              >
                <option value="">Select season</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Image</label>
              <div className="file-upload">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <span className="file-name">{formData.image.name}</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="tags">Tags</label>
              <div className="tags-input-container">
                <input
                  id="tags"
                  type="text"
                  placeholder="Add tag (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <button type="button" onClick={handleAddTag} className="add-tag-btn">
                  +
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-display">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : editItem ? "Update" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}