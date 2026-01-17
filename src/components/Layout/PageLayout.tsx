import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { StaffPanel } from "../StaffPanel/StaffPanel";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [staffPanelOpen, setStaffPanelOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {children}
        
        {/* Staff Panel Toggle Button */}
        <Button
          onClick={() => setStaffPanelOpen(!staffPanelOpen)}
          size="icon"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40 hover:scale-110 transition-transform"
          title="Toggle staff panel"
          aria-label="Toggle staff panel"
        >
          <Users className="w-6 h-6" />
        </Button>

        {/* Staff Panel */}
        <StaffPanel isOpen={staffPanelOpen} onClose={() => setStaffPanelOpen(false)} />
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Fakepixel Giveaways
            </span>
            <p className="text-sm text-muted-foreground">
              © 2026 All rights reserved
            </p>
          </div>
        </div>
      </footer>

      {/* Staff Panel Component */}
      <StaffPanel isOpen={staffPanelOpen} onClose={() => setStaffPanelOpen(false)} />
    </div>
  );
}
