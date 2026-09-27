"use client";

import { useRef, useState, useEffect } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { ChevronRight } from "lucide-react";

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: CategoryId | null;
  onSelectCategory: (id: CategoryId | null) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  function checkScrollPosition() {
    const el = scrollRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const isScrollable = el.scrollWidth > el.clientWidth;
    setShowArrow(isScrollable && !isAtEnd);
  }

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide scroll-smooth"
      >
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(isActive ? null : c.id)}
              className={`flex items-center gap-1.5 shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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

      {showArrow && (
        <button
          onClick={scrollRight}
          aria-label="Scroll categories right"
          className="absolute right-0 top-0 bottom-1 flex items-center bg-linear-to-l from-background via-background/90 to-transparent pl-8 pr-0.5"
        >
          <ChevronRight className="size-6 text-primary-foreground bg-primary rounded-full p-1 shadow-sm" />
        </button>
      )}
    </div>
  );
}