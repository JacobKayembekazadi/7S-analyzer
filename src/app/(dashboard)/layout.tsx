import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { AppStateProvider } from "@/lib/state-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStateProvider>
      <div className="flex h-screen w-full bg-muted/40">
        <Sidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </AppStateProvider>
  );
}
