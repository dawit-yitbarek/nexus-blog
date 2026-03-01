"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const timers: number[] = [];

    const handleScrollAndFocus = (
      paramKey: string,
      elementId: string,
      center: boolean = true,
      options: { focus?: boolean; select?: boolean } = {},
    ) => {
      if (searchParams.get(paramKey) !== "true") return;

      const el = document.getElementById(elementId) as HTMLElement | null;
      if (!el) return;

      const timer = window.setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: center ? "center" : "start" });
        if (options.focus) {
          (el as HTMLInputElement).focus();
          if (options.select) (el as HTMLInputElement).select();
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete(paramKey);
        router.replace(`/?${params.toString()}`, { scroll: false });
      }, 50);

      timers.push(timer);
    };

    handleScrollAndFocus("focusSearch", "search-bar", true, {
      focus: true,
      select: true,
    });
    handleScrollAndFocus("searchFound", "blog-card", false);

    return () => timers.forEach(clearTimeout);
  }, [searchParams, router]);

  return null;
}
