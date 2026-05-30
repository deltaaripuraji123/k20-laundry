"use client";

import { Search, User, LogOut, Settings, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="h-16 flex items-center justify-between px-4 md:px-6 gap-3">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 flex-1">
          
          {/* MOBILE MENU */}
          <Button
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden rounded-xl border-border bg-background shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* SEARCH */}
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0ddff2] transition-colors" />

            <Input
              type="search"
              placeholder="Cari pesanan, pelanggan..."
              className="
                pl-10
                h-11
                rounded-xl
                border-border
                bg-muted/40
                focus-visible:ring-2
                focus-visible:ring-[#0ddff2]
                focus-visible:border-[#0ddff2]
                transition-all
                text-sm
              "
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">

          {/* THEME TOGGLE */}
          <div className="rounded-xl border border-border bg-background">
            <ThemeToggle />
          </div>

          {/* DIVIDER */}
          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                  h-11
                  px-2
                  md:px-3
                  rounded-xl
                  hover:bg-muted
                  transition-all
                  flex items-center gap-3
                "
              >
                {/* AVATAR */}
                <div className="w-9 h-9 rounded-full bg-[#0ddff2]/10 border border-[#0ddff2]/20 flex items-center justify-center text-[#0ddff2] font-bold shrink-0">
                  {session?.user?.name?.[0]?.toUpperCase() || (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* USER INFO */}
                <div className="hidden md:flex flex-col text-left">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {session?.user?.name || "Pengguna"}
                  </p>

                  <p className="text-[11px] text-muted-foreground mt-1">
                    {session?.user?.email || "admin@k20laundry.com"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                w-64
                rounded-2xl
                border-border
                bg-popover
                p-2
                shadow-2xl
              "
            >
              {/* HEADER */}
              <DropdownMenuLabel className="px-3 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">
                    {session?.user?.name || "Pengguna"}
                  </span>

                  <span className="text-xs text-muted-foreground mt-1">
                    {session?.user?.email || "admin@k20laundry.com"}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* SETTINGS */}
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="
                    cursor-pointer
                    rounded-xl
                    p-3
                    flex items-center
                    transition-colors
                    focus:bg-muted
                  "
                >
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />

                  <span className="font-medium">
                    Pengaturan
                  </span>
                </Link>
              </DropdownMenuItem>

              {/* LOGOUT */}
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="
                  mt-1
                  cursor-pointer
                  rounded-xl
                  p-3
                  text-destructive
                  focus:bg-destructive/10
                  transition-colors
                "
              >
                <LogOut className="mr-3 h-4 w-4" />

                <span className="font-semibold">
                  Keluar Aplikasi
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}