"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RithmaLogo } from "@/components/rithma-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/connect", label: "Connect" },
  { href: "/playlists", label: "Playlists" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 border-b border-[#252532] bg-[#0C0C0F]/90 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2.5">
        <RithmaLogo size={26} />
        <span className="font-display font-bold text-[#F2F0EA] text-base tracking-tight">
          rithma
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#1A1A24] text-[#E8A020]"
                : "text-[#8A8A9E] hover:text-[#F2F0EA] hover:bg-[#13131A]"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
