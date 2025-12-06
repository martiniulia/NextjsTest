import OutfitCreator from "@/src/components/OutfitCreator.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function OutfitCreatorPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Create Outfit</h1>
          <p>Drag & drop items to create personalized outfits</p>
        </div>
        <OutfitCreator initialUser={currentUser?.toJSON()} />
      </div>
    </main>
  );
}

