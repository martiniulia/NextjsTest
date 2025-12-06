import AddClothingItem from "@/src/components/AddClothingItem.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function AddItemPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Add New Clothing Item</h1>
          <p>Fill out the form to add a new item to your wardrobe</p>
        </div>
        <AddClothingItem />
      </div>
    </main>
  );
}

