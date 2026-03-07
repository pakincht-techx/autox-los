"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Larger Character */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-full aspect-square md:h-[500px] flex items-center justify-center"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/character/horse-confusing.png"
                            alt="Access Denied"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Right Column: Text & Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="flex flex-col items-start text-left"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-ibm-plex-thai)] leading-tight">
                        ขออภัย ท่านไม่มีสิทธิ์เข้าถึงหน้านี้
                    </h1>

                    <p className="text-xl text-gray-500 mb-10 font-[family-name:var(--font-ibm-plex-thai)] leading-relaxed max-w-md">
                        ดูเหมือนว่าท่านจะไม่มีสิทธิ์เข้าใช้งานในส่วนนี้ กรุณาติดต่อผู้ดูแลระบบหากท่านเชื่อว่านี่คือข้อผิดพลาด
                    </p>

                    <div className="w-full max-w-xs space-y-4">
                        <Button
                            asChild
                            size="xl"
                            className="w-full rounded-2xl"
                        >
                            <Link href="/dashboard/applications" className="flex items-center justify-center">
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                กลับสู่หน้าหลัก
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
