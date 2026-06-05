import AppScreen from "../../components/AppScreen";

export default function ProfilePage() {
  return (
    <AppScreen>
      <section className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-4xl">
          👤
        </div>

        <h1 className="mt-4 text-3xl font-black">Your Profile</h1>
        <p className="mt-2 text-[#A9C7D8]">@username</p>
      </section>

      <section className="mt-8 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-3xl bg-[#082C46]/80 p-4">
          <p className="text-2xl font-black">0</p>
          <p className="text-xs text-[#A9C7D8]">Dives</p>
        </div>
        <div className="rounded-3xl bg-[#082C46]/80 p-4">
          <p className="text-2xl font-black">0m</p>
          <p className="text-xs text-[#A9C7D8]">PB</p>
        </div>
        <div className="rounded-3xl bg-[#082C46]/80 p-4">
          <p className="text-2xl font-black">0</p>
          <p className="text-xs text-[#A9C7D8]">Friends</p>
        </div>
      </section>
    </AppScreen>
  );
}