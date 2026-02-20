import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

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
                <DashboardHeader />

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
