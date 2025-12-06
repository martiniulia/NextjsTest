"use client";
import { useState, useEffect } from "react";
import { getClothingItemsByUser } from "@/src/lib/firebase/firestore";
import AddClothingItem from "./AddClothingItem";

export default function Wardrobe({ initialUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const user = initialUser;

  useEffect(() => {
    if (user) {
      loadClothingItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadClothingItems = async () => {
    try {
      const userItems = await getClothingItemsByUser(user.uid);
      setItems(userItems);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading your wardrobe...</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wardrobe</h1>
        {user && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Clothing Item
          </button>
        )}
      </div>

      {showAddForm && (
        <AddClothingItem 
          onClose={() => setShowAddForm(false)}
          onItemAdded={loadClothingItems}
        />
      )}

      {!user ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to Smart Virtual Closet!</h2>
          <p>Please sign in to start managing your wardrobe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category} • {item.color}</p>
              {item.isFavorite && <span className="text-red-500">❤️</span>}
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-lg mb-2">Your wardrobe is empty!</p>
              <p className="text-gray-600">Add your first clothing item to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}