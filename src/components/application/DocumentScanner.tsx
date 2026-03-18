import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Image as ImageIcon, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DocumentScannerProps {
    open: boolean;
    onClose: () => void;
    onSave: (pages: string[]) => void;
}

export function DocumentScanner({ open, onClose, onSave }: DocumentScannerProps) {
    const [pages, setPages] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize camera (or fake it for dev mode)
    useEffect(() => {
        if (open) {
            // In a real app, we'd use navigator.mediaDevices.getUserMedia here.
            // For now, we simulate a camera feed with a black screen.
            const startCamera = async () => {
                try {
                    // Try to get real media stream if possible
                    // const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    // if (videoRef.current) videoRef.current.srcObject = stream;
                    // streamRef.current = stream;
                } catch (err) {
                    console.error("Camera access denied or unavailable", err);
                }
            };
            startCamera();
        } else {
            // Cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) videoRef.current.srcObject = null;
            setPages([]); // Reset pages when closed
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [open]);

    const capturePhoto = () => {
        setIsCapturing(true);

        // Simulate camera flash and add a fake scanned page
        setTimeout(() => {
            // Create a fake image data URL (black rectangle with text)
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Background
                ctx.fillStyle = '#222';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Document simulation (white page)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(40, 40, 720, 1120);

                // Text simulation
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 48px sans-serif';
                ctx.fillText(`SCANNED PAGE ${pages.length + 1}`, 100, 150);

                // Lines
                ctx.globalAlpha = 0.2;
                for (let i = 0; i < 15; i++) {
                    ctx.fillRect(100, 250 + (i * 50), 600, 20);
                }
                ctx.globalAlpha = 1.0;

                // Timestamp
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#666666';
                ctx.fillText(new Date().toLocaleString(), 100, 1100);
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setPages(prev => [...prev, dataUrl]);
            setIsCapturing(false);
        }, 150); // Short delay for "flash" effect
    };

    const removePage = (index: number) => {
        setPages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (pages.length > 0) {
            onSave(pages);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-200">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-white/10 shrink-0">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                >
                    <X className="w-6 h-6" />
                </Button>

                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <ImageIcon className="w-4 h-4 text-gray-300" />
                    <span className="text-sm font-medium">
                        {pages.length} หน้า
                    </span>
                </div>

                <Button
                    type="button"
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-5 h-10 disabled:opacity-30 disabled:bg-white/50"
                    disabled={pages.length === 0}
                    onClick={handleSave}
                >
                    เสร็จสิ้น
                </Button>
            </div>

            {/* Viewfinder Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {/* Fake camera feed for dev mode */}
                <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover opacity-0"
                        autoPlay
                        playsInline
                        muted
                    />

                    {/* Document targeting brackets */}
                    <div className="absolute inset-8 border-2 border-white/20 rounded-2xl pointer-events-none">
                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-chaiyo-gold rounded-tl-xl -m-[2px]" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-chaiyo-gold rounded-tr-xl -m-[2px]" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-chaiyo-gold rounded-bl-xl -m-[2px]" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-chaiyo-gold rounded-br-xl -m-[2px]" />
                    </div>

                    <p className="text-white/50 text-sm font-medium z-10 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm shadow-xl border border-white/5">
                        {streamRef.current ? 'จัดเอกสารให้อยู่ในกรอบ' : 'Dev Mode: Simulated Camera'}
                    </p>
                </div>

                {/* Simulated Flash Overlay */}
                <div className={cn(
                    "absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ease-out",
                    isCapturing ? "opacity-100" : "opacity-0"
                )} />
            </div>

            {/* Bottom Controls Area */}
            <div className="h-48 bg-black flex flex-col justify-between pb-8 pt-4 px-6 relative z-10">
                {/* Captured Pages Strip */}
                <div className="h-20 w-full flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hidden">
                    {pages.map((page, index) => (
                        <div key={index} className="relative w-14 h-18 rounded overflow-hidden shrink-0 border border-white/20 group animate-in zoom-in slide-in-from-right-4 duration-300">
                            <img src={page} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removePage(index); }}
                                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-center py-0.5 font-medium">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                    {pages.length > 0 && (
                        <div className="w-14 h-18 shrink-0 flex items-center justify-center">
                            <div className="w-10 h-1 rounded-full bg-white/20" />
                        </div>
                    )}
                </div>

                {/* Shutter Button Row */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-sm flex items-center justify-between">
                        {/* Left action placeholder (could be flash toggle or gallery) */}
                        <div className="w-12 h-12 flex items-center justify-center opacity-0"></div>

                        {/* Main Shutter Button */}
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all outline-none"
                        >
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                <Camera className="w-6 h-6 text-black" />
                            </div>
                        </button>

                        {/* Right placeholder to keep shutter centered */}
                        <div className="w-12 h-12" />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hidden {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
