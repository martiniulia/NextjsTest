import OutfitGallery from "@/src/components/OutfitGallery.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function OutfitGalleryPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <OutfitGallery initialUser={currentUser?.toJSON()} />
    </main>
  );
}

