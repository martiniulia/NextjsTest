import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/lib/firebase/clientApp";

export async function uploadClothingImage(userId, clothingId, image) {
  try {
    if (!userId || !clothingId) {
      throw new Error("User ID and clothing ID are required");
    }

    const fileExtension = image.name.split('.').pop();
    const fileName = `${clothingId}.${fileExtension}`;
    const filePath = `clothing/${userId}/${fileName}`;
    
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, image);
    
    return await getDownloadURL(newImageRef);
  } catch (error) {
    console.error("Error uploading clothing image:", error);
    throw error;
  }
}

export async function uploadOutfitImage(userId, outfitId, image) {
  try {
    if (!userId || !outfitId) {
      throw new Error("User ID and outfit ID are required");
    }

    const fileExtension = image.name.split('.').pop();
    const fileName = `${outfitId}.${fileExtension}`;
    const filePath = `outfits/${userId}/${fileName}`;
    
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, image);
    
    return await getDownloadURL(newImageRef);
  } catch (error) {
    console.error("Error uploading outfit image:", error);
    throw error;
  }
}