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
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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

  // Desktop collapse
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* MOBILE BUTTON */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setMobileOpen(true)}
          className="bg-sidebar border-sidebar-border"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          
          // Desktop
          collapsed ? "lg:w-20" : "lg:w-64",

          // Mobile open/close
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",

          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className="w-7 h-7 text-cyan-400 shrink-0" />

              {(!collapsed || mobileOpen) && (
                <span className="font-bold text-xl whitespace-nowrap">
                  K20
                  <span className="text-cyan-400">Laundry</span>
                </span>
              )}
            </div>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all font-medium group",
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive
                        ? "text-cyan-400"
                        : "text-sidebar-foreground/50"
                    )}
                  />

                  {(!collapsed || mobileOpen) && (
                    <span>{item.label}</span>
                  )}

                  {/* ACTIVE INDICATOR */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                  )}

                  {/* TOOLTIP DESKTOP COLLAPSED */}
                  {collapsed && !mobileOpen && (
                    <div className="absolute left-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t border-sidebar-border hidden lg:block">
            <Button
              variant="ghost"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full gap-3 justify-start",
                collapsed && "justify-center"
              )}
            >
              <Menu className="w-5 h-5" />

              {!collapsed && <span>Sembunyikan Menu</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}