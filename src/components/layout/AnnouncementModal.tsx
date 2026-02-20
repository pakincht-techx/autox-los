"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";

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
            <DialogContent className="sm:max-w-[800px] p-0 gap-0 border-none bg-transparent shadow-none [&>button]:bg-white [&>button]:text-black [&>button]:opacity-100 [&>button]:hover:bg-gray-100 [&>button]:rounded-full [&>button]:shadow-md [&>button]:w-8 [&>button]:h-8 [&>button]:top-4 [&>button]:right-4 [&>button]:z-50 [&>button]:flex [&>button]:items-center [&>button]:justify-center border-0 outline-none">
                <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-xl">
                    {/* Main Image 16:9 */}
                    <div className="relative w-full aspect-video bg-gray-100">
                        <Image
                            src="/images/autox-chaiyo-w.jpg"
                            alt="Announcement Banner"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

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
                                ไม่ต้องแสดงอีกในภายหลัง
                            </Label>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
