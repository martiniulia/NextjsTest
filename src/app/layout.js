import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Smart Virtual Closet",
  description: "Manage your wardrobe digitally and create amazing outfits with AI recommendations.",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        <Header initialUser={currentUser?.toJSON()} />
        <main>{children}</main>
      </body>
    </html>
  );
}