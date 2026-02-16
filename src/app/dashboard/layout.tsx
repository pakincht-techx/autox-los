import { Sidebar } from "@/components/layout/Sidebar";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Header - Now outside the white panel */}
                <header className="h-16 px-8 flex items-center justify-between shrink-0 z-10 print:hidden">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="ค้นหาข้อมูล..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-chaiyo-blue/50 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted hover:bg-white hover:shadow-sm h-9 w-9">
                            <Bell className="w-4.5 h-4.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted hover:bg-white hover:shadow-sm h-9 w-9">
                            <HelpCircle className="w-4.5 h-4.5" />
                        </Button>
                        <div className="h-4 w-[1px] bg-border-color mx-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold leading-none">สาขาลาดพร้าว</p>
                                <p className="text-[10px] text-emerald-600 font-medium mt-1 uppercase tracking-wider">Online</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area - Housing the Floating Panel */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 pt-0 lg:p-6 lg:pt-0">
                    <div className="min-h-full bg-white rounded-3xl border border-border-subtle shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                        <div className="p-6 lg:p-10">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
