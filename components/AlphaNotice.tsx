export default function AlphaNotice() {
  return (
    <div className="rounded-[1.5rem] border border-yellow-400/20 bg-yellow-400/10 p-4">
      <p className="font-black text-yellow-300">🚧 Testing Build</p>
      <p className="mt-2 text-sm leading-6 text-yellow-100/80">
        BlueTrail is currently in development. Some features may not work yet,
        data may change, and issues may occur during testing.
      </p>
    </div>
  );
}