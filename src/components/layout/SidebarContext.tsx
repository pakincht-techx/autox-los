"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export type DevRole = 'branch-staff' | 'legal-team' | 'district-checker' | 'rcco-checker' | 'rcco-approver' | 'credit-committee';

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
    hideNavButtons: boolean;
    setHideNavButtons: (hide: boolean) => void;
    hideSaveDraftButton: boolean;
    setHideSaveDraftButton: (hide: boolean) => void;
    onBack: (() => void) | null;
    setOnBack: (cb: (() => void) | null) => void;
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
    hideNavButtons: false,
    setHideNavButtons: () => { },
    hideSaveDraftButton: false,
    setHideSaveDraftButton: () => { },
    onBack: null,
    setOnBack: () => { },
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [rightContent, setRightContent] = useState<React.ReactNode>(null);
    const [devRole, setDevRoleState] = useState<DevRole>('branch-staff');

    // Sync devRole with localStorage
    useEffect(() => {
        const stored = localStorage.getItem('devRole');
        if (stored === 'branch-staff' || stored === 'legal-team' || stored === 'district-checker' || stored === 'rcco-checker' || stored === 'rcco-approver' || stored === 'credit-committee') {
            setDevRoleState(stored as DevRole);
        }
    }, []);

    const setDevRole = (role: DevRole) => {
        setDevRoleState(role);
        localStorage.setItem('devRole', role);
    };
    const [hideNavButtons, setHideNavButtons] = useState(false);
    const [hideSaveDraftButton, setHideSaveDraftButton] = useState(false);
    const [onBack, setOnBack] = useState<(() => void) | null>(null);

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
            setDevRole,
            hideNavButtons,
            setHideNavButtons,
            hideSaveDraftButton,
            setHideSaveDraftButton,
            onBack,
            setOnBack
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
