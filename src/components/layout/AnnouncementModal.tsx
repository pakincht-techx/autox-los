"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export function AnnouncementModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if the user has already seen the announcement in this session
        const hasSeen = sessionStorage.getItem("announcementSeen");
        if (!hasSeen) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        sessionStorage.setItem("announcementSeen", "true");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
                <div className="relative w-full h-48 bg-gray-100">
                    <Image
                        src="/images/autox-chaiyo-w.jpg"
                        alt="Announcement Banner"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-chaiyo-blue">
                            ประกาศสำคัญจากสำนักงานใหญ่
                        </DialogTitle>
                        <DialogDescription className="text-base mt-2">
                            แจ้งเปลี่ยนแปลงนโยบายการอนุมัติสินเชื่อรถบรรทุก และปรับอัตราดอกเบี้ยสำหรับลูกค้ากลุ่มธุรกิจขนาดเล็ก โดยมีผลตั้งแต่วันที่ 1 มีนาคม 2567 เป็นต้นไป
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 text-sm text-gray-600">
                        <p>
                            เพื่อให้สอดคล้องกับสภาวะเศรษฐกิจในปัจจุบัน ทางสำนักงานใหญ่ได้มีการปรับปรุงเกณฑ์การพิจารณาสินเชื่อเพื่อให้มีความยืดหยุ่นมากขึ้น และสนับสนุนผู้ประกอบการรายย่อย
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>ปรับลดอัตราดอกเบี้ยเริ่มต้น 0.5% ต่อปี</li>
                            <li>ขยายระยะเวลาผ่อนชำระสูงสุดเป็น 84 เดือน</li>
                            <li>เอกสารประกอบการพิจารณาลดลงสำหรับวงเงินไม่เกิน 1 ล้านบาท</li>
                        </ul>
                    </div>

                    <DialogFooter className="mt-8">
                        <Button onClick={handleClose} className="w-full bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white">
                            รับทราบ
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
