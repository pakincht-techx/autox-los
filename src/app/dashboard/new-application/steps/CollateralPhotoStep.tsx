"use client";

import { useState } from "react";
import { Camera, Upload, X, Check, Loader2, Sparkles, Book, FileText, Trash2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface CollateralPhotoStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onAnalyze: () => void;
    isAnalyzing?: boolean;
}

export function CollateralPhotoStep({ formData, setFormData, onAnalyze, isAnalyzing }: CollateralPhotoStepProps) {
    const existingAssetId = formData.existingAssetId;
    const isExisting = existingAssetId && existingAssetId !== 'new';

    // Mock existing records data
    const MOCK_EXISTING_RECORDS: Record<string, string> = {
        'reg_book': 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=400',
        'front': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
        'back': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400',
        'side': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
        'deed_front': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400',
    };

    // State tracks { url, isVerified }
    const [photos, setPhotos] = useState<Record<string, { url: string; isVerified: boolean }>>(() => {
        const initial: Record<string, { url: string; isVerified: boolean }> = {};
        if (isExisting) {
            // Load mock verified photos for existing asset
            const config = getPhotoConfig(formData.collateralType || 'car');
            config.forEach(item => {
                if (MOCK_EXISTING_RECORDS[item.id]) {
                    initial[item.id] = { url: MOCK_EXISTING_RECORDS[item.id], isVerified: true };
                }
            });
        }
        return initial;
    });

    // Dynamic config based on type
    function getPhotoConfig(type: string) {
        switch (type) {
            case 'moto':
                return [
                    { id: 'reg_book', label: 'เล่มทะเบียนรถ', icon: Book },
                    { id: 'front', label: 'ด้านหน้า', icon: Camera },
                    { id: 'back', label: 'ด้านหลัง', icon: Camera },
                    { id: 'left', label: 'ด้านซ้าย', icon: Camera },
                    { id: 'right', label: 'ด้านขวา', icon: Camera },
                    { id: 'plate', label: 'ป้ายทะเบียน', icon: Camera },
                ];
            case 'land':
                return [
                    { id: 'deed_front', label: 'โฉนดด้านหน้า', icon: FileText },
                    { id: 'deed_back', label: 'โฉนดด้านหลัง', icon: FileText },
                    { id: 'appraisal', label: 'ใบประเมินราคา', icon: FileText },
                    { id: 'land_photo', label: 'รูปถ่ายที่ดิน', icon: Camera },
                    { id: 'map', label: 'แผนที่ตั้ง', icon: Camera },
                ];
            default: // car, truck
                return [
                    { id: 'reg_book', label: 'เล่มทะเบียนรถ', icon: Book },
                    { id: 'front', label: 'ด้านหน้า (เต็มคัน)', icon: Camera },
                    { id: 'side', label: 'ด้านข้าง', icon: Camera },
                    { id: 'back', label: 'ด้านหลัง', icon: Camera },
                    { id: 'interior', label: 'ภายใน / คอนโซล', icon: Camera },
                    { id: 'plate', label: 'ป้ายทะเบียน', icon: Camera },
                ];
        }
    }

    const config = getPhotoConfig(formData.collateralType || 'car');
    const uploadedCount = Object.keys(photos).length;
    const isComplete = uploadedCount >= Math.min(3, config.length); // Allow proceed if at least 3 photos

    // Bulk Upload Simulation
    const handleBulkUpload = () => {
        const newPhotos = { ...photos };
        config.forEach(item => {
            if (!newPhotos[item.id]) {
                newPhotos[item.id] = {
                    url: `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.label)}`,
                    isVerified: false
                };
            }
        });
        setPhotos(newPhotos);
    };

    const handleRemovePhoto = (id: string) => {
        const newPhotos = { ...photos };
        delete newPhotos[id];
        setPhotos(newPhotos);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Camera className="w-6 h-6 text-chaiyo-blue" />
                    ถ่ายภาพและเอกสารหลักประกัน
                </h3>
                <p className="text-muted text-sm">
                    อัปโหลดรูปภาพและเอกสารที่เกี่ยวข้อง (Upload photos and documents)
                </p>
            </div>

            {isExisting && (
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in duration-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-chaiyo-blue" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-chaiyo-blue">พบข้อมูลรูปภาพเดิมในระบบ</p>
                        <p className="text-xs text-blue-800/60">ระบบได้ดึงรูปภาพและเอกสารล่าสุดจากฐานข้อมูล คุณสามารถใช้ข้อมูลเดิมหรืออัปโหลดใหม่เพื่ออัปเดตสถานะทรัพย์สินได้</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Checklist Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="border-border-subtle bg-gray-50/50 h-full">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-base mb-4 flex items-center gap-2">
                                <Book className="w-5 h-5 text-chaiyo-blue" />
                                รายการที่ต้องการ
                            </h4>
                            <div className="space-y-3">
                                {config.map((item) => {
                                    const isUploaded = !!photos[item.id];
                                    return (
                                        <div key={item.id} className="flex items-center gap-3 py-3 border-b border-dashed border-gray-200 last:border-0">
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                {isUploaded ? (
                                                    <Check className="w-5 h-5 text-emerald-500" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <item.icon className={cn("w-4 h-4", isUploaded ? "text-emerald-600" : "text-gray-400")} />
                                                <span className={cn("text-sm", isUploaded ? "text-emerald-700 font-bold" : "text-gray-600")}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Upload Area & Gallery */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Dropzone */}
                    <div
                        onClick={handleBulkUpload}
                        className="border-2 border-dashed border-chaiyo-blue/30 bg-blue-50/20 hover:bg-blue-50/50 rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center min-h-[240px]"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-chaiyo-blue" />
                        </div>
                        <h4 className="text-xl font-bold text-chaiyo-blue mb-2">คลิกเพื่ออัปโหลดไฟล์</h4>
                        <p className="text-muted text-sm max-w-sm mx-auto">
                            ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (รองรับ JPG, PNG, PDF)
                        </p>
                        <div className="flex gap-2 mt-4">
                            <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-400">.JPG</span>
                            <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-400">.PNG</span>
                            <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-400">.PDF</span>
                        </div>
                    </div>

                    {/* Gallery */}
                    {uploadedCount > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2">
                            {config.map((item) => {
                                if (!photos[item.id]) return null;
                                return (
                                    <div key={item.id} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white group hover:shadow-md transition-all">
                                        <img src={photos[item.id].url} alt={item.label} className="w-full h-full object-cover" />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                            <span className="text-white text-xs font-bold truncate">{item.label}</span>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemovePhoto(item.id); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>

                                        {photos[item.id].isVerified ? (
                                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" /> System Verified
                                            </div>
                                        ) : (
                                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                                                <Upload className="w-2.5 h-2.5" /> New Upload
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Analysis Overlay if Processing */}
            {
                isAnalyzing && (
                    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-chaiyo-blue/20 animate-spin"></div>
                                <div className="absolute inset-0 border-4 border-chaiyo-blue border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-chaiyo-gold animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-chaiyo-blue">AI กำลังวิเคราะห์ข้อมูล...</h3>
                                <p className="text-muted">กำลังประเมินราคาทรัพย์สินจากรูปภาพและเอกสาร</p>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="pt-4 flex justify-end">
                <Button
                    onClick={() => {
                        // Flatten photos to just URLs for formData
                        const photoUrls: Record<string, string> = {};
                        Object.keys(photos).forEach(k => {
                            photoUrls[k] = photos[k].url;
                        });
                        setFormData((prev: any) => ({ ...prev, photos: photoUrls }));
                        onAnalyze();
                    }}
                    disabled={!isComplete || isAnalyzing}
                    className="h-12 px-8 text-lg rounded-xl bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white min-w-[200px]"
                >
                    {isAnalyzing ? (
                        <>กำลังวิเคราะห์...</>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 text-chaiyo-gold" />
                            วิเคราะห์และประเมินราคา
                        </>
                    )}
                </Button>
            </div>
        </div >
    );
}
