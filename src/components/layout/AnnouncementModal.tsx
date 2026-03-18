"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/Dialog";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { X } from "lucide-react";

interface AnnouncementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AnnouncementModal({ open, onOpenChange }: AnnouncementModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleClose = () => {
        onOpenChange(false);
        sessionStorage.setItem("announcementSeen", "true");
        if (dontShowAgain) {
            localStorage.setItem("hideAnnouncement", "true");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="p-0 gap-0 border-none bg-transparent shadow-none border-0 outline-none">
                <DialogTitle className="sr-only">Announcement</DialogTitle>
                <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-xl relative">
                    <DialogClose className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm transition-colors border border-white/20">
                        <X className="w-5 h-5" />
                    </DialogClose>
                    {/* Main Image 1:1 */}
                    <a
                        href="https://google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-full aspect-square bg-gray-100 block hover:opacity-95 transition-opacity"
                    >
                        <Image
                            src="/images/headquarters-announcement01.jpg"
                            alt="Announcement Banner"
                            fill
                            className="object-cover cursor-pointer"
                            priority
                        />
                    </a>

                    {/* Footer with Checkbox */}
                    <div className="p-4 flex items-center justify-start bg-white border-t border-border-subtle">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="dont-show"
                                checked={dontShowAgain}
                                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                            />
                            <Label
                                htmlFor="dont-show"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer select-none"
                            >
                                ไม่ต้องแสดงอีกในวันนี้
                            </Label>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
