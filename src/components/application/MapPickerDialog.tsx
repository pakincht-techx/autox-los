"use client"

import * as React from "react"
import { MapPin, Save, X, Search, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogFooterInfo,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

// Dynamically import the map contents component with no SSR
const MapContents = dynamic(() => import("./MapContents").then(mod => mod.MapContents || mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-chaiyo-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground italic">กำลังโหลดแผนที่...</span>
        </div>
    </div>
})

interface MapPickerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (lat: number, lng: number) => void
    initialLat?: number
    initialLng?: number
    title?: string
}

const DEFAULT_CENTER: [number, number] = [13.827461555753386, 100.56348533094047]

export function MapPickerDialog({
    open,
    onOpenChange,
    onConfirm,
    initialLat,
    initialLng,
    title = "ระบุตำแหน่งในแผนที่"
}: MapPickerDialogProps) {
    const [position, setPosition] = React.useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER
    )
    const [center, setCenter] = React.useState<[number, number]>(
        initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER
    )
    const [zoom, setZoom] = React.useState(17)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isSearching, setIsSearching] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            const initialPos: [number, number] | null = initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER
            setPosition(initialPos)
            setCenter(initialPos || DEFAULT_CENTER)
            setZoom(17)
            setSearchQuery("")
        }
    }, [open, initialLat, initialLng])

    const handleConfirm = () => {
        if (position) {
            onConfirm(position[0], position[1])
            onOpenChange(false)
        }
    }

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!searchQuery.trim()) return

        try {
            setIsSearching(true)
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
            const data = await response.json()

            if (data && data.length > 0) {
                const { lat, lon } = data[0]
                const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)]
                setPosition(newPos)
                setCenter(newPos)
                setZoom(17)
            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden bg-white sm:rounded-2xl border-none shadow-2xl">
                <DialogHeader className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
                    <DialogTitle className="shrink-0">
                        {title}
                    </DialogTitle>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md ml-auto">
                        <div className="relative flex-1">
                            <Input
                                placeholder="ค้นหาสถานที่ เช่น เซ็นทรัลเวิลด์..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 pl-9 rounded-lg border-gray-200"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSearching}
                            className="h-10 px-4 bg-chaiyo-blue font-bold text-white rounded-lg hover:bg-chaiyo-blue/90"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "ค้นหา"}
                        </Button>
                    </form>
                </DialogHeader>

                <div className="flex-1 relative bg-gray-100 min-h-[400px]">
                    <MapContents
                        center={center}
                        zoom={zoom}
                        position={position}
                        onLocationSelect={(lat, lng) => setPosition([lat, lng])}
                    />

                    {!position && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
                            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-chaiyo-blue animate-bounce" />
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-bold text-gray-800">คลิกเพื่อเลือกตำแหน่ง</p>
                                    <p className="text-xs text-muted-foreground mt-1">ปักหมุดตำแหน่งเพื่อเก็บข้อมูลพิกัด (Lat, Long)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <DialogFooterInfo className="w-full sm:w-auto">
                        {position ? (
                            <div className="flex items-center gap-3 bg-blue-50/50 p-2 px-3 rounded-xl border border-blue-100 shrink-0">
                                <div className="w-8 h-8 bg-chaiyo-blue rounded-lg flex items-center justify-center shrink-0">
                                    <Navigation className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">พิกัดที่เลือก</span>
                                    <span className="text-sm font-mono font-bold text-chaiyo-blue">
                                        {position[0].toFixed(6)}, {position[1].toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
                                <AlertCircle className="w-4 h-4" />
                                ยังไม่ได้ระบุตำแหน่ง
                            </div>
                        )}
                    </DialogFooterInfo>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-white h-11 font-bold min-w-[120px] rounded-xl border-gray-200 hover:bg-gray-50 flex-1 sm:flex-none"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!position}
                            className="bg-chaiyo-blue font-bold  text-white hover:bg-chaiyo-blue/90 h-11 min-w-[120px] rounded-xl flex-1 sm:flex-none"
                        >
                            บันทึกตำแหน่ง
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function Navigation(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
    )
}

function AlertCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
