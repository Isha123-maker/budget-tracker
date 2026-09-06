import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { ChevronRight } from "lucide-react";

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: CategoryId | null;
  onSelectCategory: (id: CategoryId | null) => void;
}) {
  return (
    <div className="relative">
      <div
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide snap-x snap-proximity scroll-smooth"
      >
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(isActive ? null : c.id)}
              className={`flex items-center gap-1.5 shrink-0 snap-start cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "" : "text-primary"}`} />
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-1 flex items-center pr-0.5">
        <ChevronRight className="size-5 text-purple-800 border-2 rounded-4xl border-black bg-amber-300" />
      </div>
    </div>
  );
}