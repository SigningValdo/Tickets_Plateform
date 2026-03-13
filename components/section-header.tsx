import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Tout voir",
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-bold text-black">{title}</h2>
        <p className="text-sm text-gris2 mt-2.5">{subtitle}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="font-medium bg-[#DAFFF0] text-green rounded-2xl px-7 py-3 hover:bg-green hover:text-white transition-colors flex-shrink-0"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
