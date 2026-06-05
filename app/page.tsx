import SplashCarousel from "../components/SplashCarousel";

export default function Home() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return <SplashCarousel />;
  }

  return (
    <main className="min-h-screen bg-[#031B2E] text-white px-4 py-6">
      <h1 className="text-4xl font-black">BlueTrail App</h1>
    </main>
  );
}