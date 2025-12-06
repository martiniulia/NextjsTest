import Favorites from "@/src/components/Favorites.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Favorites</h1>
          <p>Favorite clothing items and outfits for quick access</p>
        </div>
        <Favorites initialUser={currentUser?.toJSON()} />
      </div>
    </main>
  );
}

