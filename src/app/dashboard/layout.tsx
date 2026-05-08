import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex font-sans transition-colors duration-300">
      {/* Sidebar - fixed width or responsive */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Topbar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="py-8 px-10 border-t border-border text-center text-xs font-medium text-muted-foreground bg-background">
          &copy; {new Date().getFullYear()} K20 Laundry. Hak cipta dilindungi undang-undang. Clean with love.
        </footer>
      </div>
    </div>
  );
}
