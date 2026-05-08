"use client";

import { Search, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-background border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0ddff2] transition-colors" />
          <Input 
            type="search" 
            placeholder="Cari sesuatu..." 
            className="pl-10 bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-[#0ddff2] rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <div className="h-6 w-px bg-border mx-2"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-muted rounded-xl transition-all">
              <div className="w-8 h-8 rounded-full bg-[#0ddff2]/10 border border-[#0ddff2]/20 flex items-center justify-center text-[#0ddff2] font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold leading-none text-foreground">
                  {session?.user?.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                  {session?.user?.email?.split('@')[0] || "ADMIN"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border shadow-xl p-2 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Akun Saya
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer rounded-xl p-3 focus:bg-muted transition-colors flex items-center">
                <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Pengaturan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl p-3 focus:bg-destructive/10 text-destructive transition-colors mt-1" 
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-bold">Keluar Aplikasi</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
