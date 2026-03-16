"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export type DevRole = 'branch-staff' | 'legal-team';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCollapsed: () => void;
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (bc: BreadcrumbItem[]) => void;
    rightContent: React.ReactNode;
    setRightContent: (content: React.ReactNode) => void;
    devRole: DevRole;
    setDevRole: (role: DevRole) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => { },
    toggleCollapsed: () => { },
    breadcrumbs: [],
    setBreadcrumbs: () => { },
    rightContent: null,
    setRightContent: () => { },
    devRole: 'branch-staff',
    setDevRole: () => { },
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [rightContent, setRightContent] = useState<React.ReactNode>(null);
    const [devRole, setDevRole] = useState<DevRole>('branch-staff');

    const toggleCollapsed = () => setIsCollapsed(prev => !prev);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            setIsCollapsed,
            toggleCollapsed,
            breadcrumbs,
            setBreadcrumbs,
            rightContent,
            setRightContent,
            devRole,
            setDevRole
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
