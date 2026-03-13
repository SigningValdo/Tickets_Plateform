export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  sports: { bg: "bg-red", text: "text-white", icon: "Sports" },
  concert: { bg: "bg-green", text: "text-white", icon: "concert" },
  festival: { bg: "bg-primary", text: "text-white", icon: "festival" },
  cinéma: { bg: "bg-[#010101]", text: "text-white", icon: "cinema" },
  conférence: { bg: "bg-[#8D003D]", text: "text-white", icon: "conference" },
  gastronomie: { bg: "bg-[#FF6D00]", text: "text-white", icon: "restaurant" },
  spectacle: { bg: "bg-[#FF6D00]", text: "text-white", icon: "theatre" },
  atelier: { bg: "bg-[#FF6D00]", text: "text-white", icon: "workshop" },
  exposition: { bg: "bg-[#FF6D00]", text: "text-white", icon: "festival" },
};

const DEFAULT_STYLE = { bg: "bg-green/10", text: "text-green", icon: "🎫" };

export function getCategoryStyle(name: string) {
  const n = name.toLowerCase();
  for (const [key, style] of Object.entries(CATEGORY_COLORS)) {
    if (n.includes(key)) return style;
  }
  return DEFAULT_STYLE;
}
