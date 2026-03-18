"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Save } from "lucide-react";

interface MandatoryFieldWarningDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaveAndExit: () => void;
    onCancel: () => void;
}

export function MandatoryFieldWarningDialog({
    open,
    onOpenChange,
    onSaveAndExit,
    onCancel,
}: MandatoryFieldWarningDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-[2rem]">
                <DialogHeader className="space-y-3">
                    <DialogTitle>
                        มีข้อมูลที่จำเป็นยังไม่ได้กรอก
                    </DialogTitle>
                    <DialogDescription>
                        ข้อมูลบางส่วนที่จำเป็นยังไม่ถูกกรอก คุณต้องการบันทึกข้อมูลที่มีอยู่และออกจากหน้านี้หรือไม่?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="min-w-[120px]"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={onSaveAndExit}
                        className="min-w-[120px] bg-chaiyo-blue hover:bg-chaiyo-blue/90 font-bold text-white"
                    >
                        บันทึกและออก
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
