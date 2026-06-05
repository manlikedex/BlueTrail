import Link from "next/link";

export default function PrimaryButton({
  href,
  children,
  onClick,
  danger = false,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const classes = `block w-full rounded-[1.5rem] px-6 py-4 text-center font-black transition active:scale-[0.98] ${
    danger
      ? "bg-[#FF6B6B] text-white"
      : "bg-[#00D4C8] text-[#020B14]"
  }`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
