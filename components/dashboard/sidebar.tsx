"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Settings, 
  History,
  Tags,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Pelanggan", href: "/dashboard/customers" },
  { icon: ShoppingBag, label: "Pesanan", href: "/dashboard/orders" },
  { icon: Tags, label: "Layanan", href: "/dashboard/services" },
  { icon: History, label: "Laporan", href: "/dashboard/reports" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-sidebar border-r border-sidebar-border",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#0ddff2] w-7 h-7" />
              {isOpen && (
                <span className="font-bold text-xl tracking-tight text-sidebar-foreground">
                  K20<span className="text-[#0ddff2]">Laundry</span>
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => {
              // Jika href adalah /dashboard, check exact match. 
              // Jika lainnya, check apakah pathname dimulai dengan href tersebut.
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative font-medium",
                    isActive 
                      ? "bg-[#0ddff2]/10 text-[#0ddff2]" 
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-[#0ddff2]" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                  )} />
                  {isOpen && <span>{item.label}</span>}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0ddff2] rounded-r-full" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-14 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border shrink-0">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                !isOpen && "justify-center"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-5 h-5" />
              {isOpen && <span>Sembunyikan Menu</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
