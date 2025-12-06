import { 
  collection, onSnapshot, query, getDocs, doc, getDoc, 
  updateDoc, orderBy, Timestamp, where, addDoc, deleteDoc,
  arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";

export async function addClothingItem(userId, itemData) {
  if (!userId) throw new Error("No user ID provided");
  
  const itemWithMetadata = {
    ...itemData,
    userId,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    isFavorite: false
  };
  
  const docRef = await addDoc(collection(db, "clothingItems"), itemWithMetadata);
  return docRef.id;
}

export async function getClothingItemsByUser(userId, filters = {}) {
  let q = query(
    collection(db, "clothingItems"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  if (filters.category) {
    q = query(q, where("category", "==", filters.category));
  }
  if (filters.color) {
    q = query(q, where("color", "==", filters.color));
  }
  if (filters.season) {
    q = query(q, where("season", "==", filters.season));
  }

  const results = await getDocs(q);
  return results.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().createdAt.toDate(),
  }));
}

export async function deleteClothingItem(itemId) {
  await deleteDoc(doc(db, "clothingItems", itemId));
}

export async function toggleFavoriteItem(itemId, isFavorite) {
  await updateDoc(doc(db, "clothingItems", itemId), {
    isFavorite: !isFavorite,
    updatedAt: Timestamp.fromDate(new Date())
  });
}

export async function updateClothingItemImage(itemId, imageUrl) {
  await updateDoc(doc(db, "clothingItems", itemId), {
    imageUrl: imageUrl,
    updatedAt: Timestamp.fromDate(new Date())
  });
}

export async function createOutfit(userId, outfitData) {
  const outfitWithMetadata = {
    ...outfitData,
    userId,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    isFavorite: false,
    items: outfitData.items || [],
    imageUrl: outfitData.imageUrl || null
  };
  
  const docRef = await addDoc(collection(db, "outfits"), outfitWithMetadata);
  return docRef.id;
}

export async function updateOutfitImage(outfitId, imageUrl) {
  await updateDoc(doc(db, "outfits", outfitId), {
    imageUrl: imageUrl,
    updatedAt: Timestamp.fromDate(new Date())
  });
}

export async function getOutfitsByUser(userId) {
  try {
    const q = query(
      collection(db, "outfits"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const results = await getDocs(q);
    return results.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    // Fallback: if index is not ready, get all and filter in memory
    if (error.code === 'failed-precondition') {
      console.warn("Index not ready, using fallback query");
      const q = query(
        collection(db, "outfits"),
        where("userId", "==", userId)
      );
      const results = await getDocs(q);
      const outfits = results.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate() || new Date(),
      }));
      // Sort by createdAt descending
      return outfits.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || a.timestamp || new Date(0);
        const bTime = b.createdAt?.toDate?.() || b.timestamp || new Date(0);
        return bTime - aTime;
      });
    }
    throw error;
  }
}

export async function addItemToOutfit(outfitId, itemId) {
  await updateDoc(doc(db, "outfits", outfitId), {
    items: arrayUnion(itemId),
    updatedAt: Timestamp.fromDate(new Date())
  });
}

export async function removeItemFromOutfit(outfitId, itemId) {
  await updateDoc(doc(db, "outfits", outfitId), {
    items: arrayRemove(itemId),
    updatedAt: Timestamp.fromDate(new Date())
  });
}

export async function getFavoriteItems(userId) {
  // First get all items for user, then filter favorites in memory
  // This avoids needing a composite index
  const q = query(
    collection(db, "clothingItems"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const results = await getDocs(q);
  return results.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt.toDate(),
    }))
    .filter(item => item.isFavorite === true);
}