export default function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl border border-[#0094FF]/40 bg-[#0094FF] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_30px_rgba(0,148,255,0.25)] transition active:scale-[0.98] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}