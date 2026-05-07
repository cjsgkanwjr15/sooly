"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

/**
 * 헤더 우측 사용자 아바타 + 드롭다운.
 * 서버에서 username/displayName + locale 받아 렌더, 클릭 시 메뉴 열림.
 */
export function UserMenu({
  username,
  displayName,
  locale,
}: {
  username: string | null;
  displayName: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const initial =
    (displayName || username || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(locale, "userMenu.aria")}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/15"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-popover py-1 text-sm shadow-lg"
        >
          <div className="border-b border-border/60 px-3 py-2">
            <div className="truncate font-medium text-foreground">
              {displayName}
            </div>
            {username && (
              <div className="truncate text-xs text-muted-foreground">
                @{username}
              </div>
            )}
          </div>

          {username && (
            <Link
              href={`/u/${username}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 transition-colors hover:bg-foreground/5"
            >
              {t(locale, "userMenu.myProfile")}
            </Link>
          )}

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block border-b border-border/60 px-3 py-2 transition-colors hover:bg-foreground/5"
          >
            {t(locale, "userMenu.settings")}
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="block w-full cursor-pointer px-3 py-2 text-left transition-colors hover:bg-foreground/5"
            >
              {t(locale, "userMenu.signOut")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
