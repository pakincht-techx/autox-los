"use client";
// Force refresh to resolve HMR module factory error

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { DashboardPageHeader } from "@/components/layout/DashboardPageHeader";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { breadcrumbs, rightContent, hideNavButtons, hideSaveDraftButton, isCollapsed, toggleCollapsed } = useSidebar();

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden font-sans text-gray-900">
            <div className="flex flex-1 min-h-0 overflow-hidden relative">
                <div className="print:hidden h-full">
                    <Sidebar />
                </div>

                {/* Floating Sidebar Toggle Overlay - Positioned to overlap sidebar and main container */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleCollapsed()}
                    className={cn(
                        "absolute top-[20px] z-40 h-6 w-6 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 transition-all duration-300 flex items-center justify-center",
                        isCollapsed ? "left-[72px]" : "left-[264px]",
                        "-translate-x-1/2"
                    )}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-chaiyo-blue" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5 text-chaiyo-blue" />
                    )}
                </Button>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-chaiyo-blue relative">
                    {/* Main Content Area - Inset Workspace */}
                    <div className="flex-1 relative p-2 overflow-hidden">
                        <div className="bg-white rounded-md h-full shadow-sm flex flex-col overflow-hidden border border-white/5 relative">

                            {/* Fixed Header - Only rendered if content exists */}
                            {(breadcrumbs.length > 0 || rightContent) && (
                                <DashboardPageHeader
                                    breadcrumbs={breadcrumbs}
                                    rightContent={rightContent}
                                    hideNavButtons={hideNavButtons}
                                    hideSaveDraftButton={hideSaveDraftButton}
                                    className="pl-4"
                                />
                            )}

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardLayoutContent>
                {children}
            </DashboardLayoutContent>
        </SidebarProvider>
    );
}
