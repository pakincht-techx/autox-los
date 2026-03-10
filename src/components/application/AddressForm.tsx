import React from "react";
import dynamic from "next/dynamic";
import { MapPin, RefreshCcw, Navigation, ExternalLink, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/combobox";
import { MapPickerDialog } from "@/components/application/MapPickerDialog";
import { cn } from "@/lib/utils";
import { THAI_ADDRESS_DATA } from "@/data/thai-address-data";

const MapContents = dynamic(() => import('./MapContents').then(mod => mod.MapContents || mod.default), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-gray-50"><Loader2 className="w-6 h-6 animate-spin text-chaiyo-blue" /></div>
});

interface AddressFormProps {
    title: string;
    prefix?: string;
    formData: any;
    onChange: (field: string, val: any) => void;
    disabled?: boolean;
    headerChildren?: React.ReactNode;
    footerChildren?: React.ReactNode;
    hideFields?: boolean;
}

export const AddressForm = ({
    title,
    prefix = "",
    formData,
    onChange,
    disabled = false,
    headerChildren,
    footerChildren,
    hideFields = false
}: AddressFormProps) => {
    const [showMapDialog, setShowMapDialog] = React.useState(false);
    const getField = (name: string) => prefix ? `${prefix}${name.charAt(0).toUpperCase() + name.slice(1)}` : name;

    const lat = formData[getField('latitude')];
    const lng = formData[getField('longitude')];

    // Aggregate address components into a single map query
    const getMapQuery = () => {
        const parts = [
            formData[getField('houseNumber')],
            formData[getField('village')],
            formData[getField('moo')] ? `หมู่ ${formData[getField('moo')]}` : '',
            formData[getField('soi')] ? `ซอย ${formData[getField('soi')]}` : '',
            formData[getField('street')] ? `ถนน ${formData[getField('street')]}` : '',
            formData[getField('subDistrict')],
            formData[getField('district')],
            formData[getField('province')],
            formData[getField('zipCode')]
        ].filter(Boolean);

        return parts.join(' ');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    {title}
                </div>
            </div>

            <div className={cn("grid grid-cols-1 gap-6", !hideFields && "lg:grid-cols-3")}>
                {/* Left Side: Address Fields */}
                <div className={cn("space-y-4", !hideFields && "lg:col-span-2")}>
                    {headerChildren}
                    {!hideFields && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {prefix === 'work' && (
                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">ชื่อสถานที่ทำงาน / ชื่อกิจการ</Label>
                                        <Input
                                            className="bg-white h-12"
                                            value={formData[getField('workplaceName')] || ""}
                                            onChange={(e) => onChange(getField('workplaceName'), e.target.value)}
                                            disabled={disabled}
                                            placeholder="ระบุชื่อสถานที่ทำงาน"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">เบอร์ติดต่อที่ทำงาน</Label>
                                        <Input
                                            className="bg-white font-mono h-12"
                                            value={formData[getField('workPhone')] || ""}
                                            onChange={(e) => onChange(getField('workPhone'), e.target.value)}
                                            disabled={disabled}
                                            placeholder="02-xxx-xxxx"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-1 md:col-span-2">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">เลขที่บ้าน <span className="text-red-500">*</span></Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('houseNumber')] || ""}
                                        onChange={(e) => onChange(getField('houseNumber'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="123/45"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">ชั้น</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('floorNumber')] || ""}
                                        onChange={(e) => onChange(getField('floorNumber'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="เช่น 2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('unitNumber')] || ""}
                                        onChange={(e) => onChange(getField('unitNumber'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="เช่น 201"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('moo')] || ""}
                                        onChange={(e) => onChange(getField('moo'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="เช่น 1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('village')] || ""}
                                        onChange={(e) => onChange(getField('village'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="ชื่อหมู่บ้านหรืออาคาร"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">ซอย</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('soi')] || ""}
                                        onChange={(e) => onChange(getField('soi'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="ชื่อซอย"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">ตรอก</Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('trohk')] || ""}
                                        onChange={(e) => onChange(getField('trohk'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="ระบุตรอก"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">ถนน <span className="text-red-500">*</span></Label>
                                    <Input
                                        className="bg-white h-12"
                                        value={formData[getField('street')] || ""}
                                        onChange={(e) => onChange(getField('street'), e.target.value)}
                                        disabled={disabled}
                                        placeholder="ระบุถนน"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">จังหวัด <span className="text-red-500">*</span></Label>
                                <Combobox
                                    options={THAI_ADDRESS_DATA.map(p => ({ label: p.name, value: p.name }))}
                                    value={formData[getField('province')] || ""}
                                    onValueChange={(val) => {
                                        onChange(getField('province'), val);
                                        onChange(getField('district'), "");
                                        onChange(getField('subDistrict'), "");
                                        onChange(getField('zipCode'), "");
                                    }}
                                    disabled={disabled}
                                    placeholder="ระบุจังหวัด"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">อำเภอ/เขต <span className="text-red-500">*</span></Label>
                                <Combobox
                                    options={
                                        THAI_ADDRESS_DATA.find(p => p.name === formData[getField('province')])
                                            ?.districts.map(d => ({ label: d.name, value: d.name })) || []
                                    }
                                    value={formData[getField('district')] || ""}
                                    onValueChange={(val) => {
                                        onChange(getField('district'), val);
                                        onChange(getField('subDistrict'), "");
                                        onChange(getField('zipCode'), "");
                                    }}
                                    disabled={disabled || !formData[getField('province')]}
                                    placeholder="ระบุอำเภอ/เขต"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">ตำบล/แขวง <span className="text-red-500">*</span></Label>
                                <Combobox
                                    options={
                                        THAI_ADDRESS_DATA.find(p => p.name === formData[getField('province')])
                                            ?.districts.find(d => d.name === formData[getField('district')])
                                            ?.subdistricts.map(s => ({ label: s.name, value: s.name })) || []
                                    }
                                    value={formData[getField('subDistrict')] || ""}
                                    onValueChange={(val) => {
                                        onChange(getField('subDistrict'), val);
                                        const sub = THAI_ADDRESS_DATA.find(p => p.name === formData[getField('province')])
                                            ?.districts.find(d => d.name === formData[getField('district')])
                                            ?.subdistricts.find(s => s.name === val);
                                        if (sub) {
                                            onChange(getField('zipCode'), sub.zipCode);
                                        }
                                    }}
                                    disabled={disabled || !formData[getField('district')]}
                                    placeholder="ระบุตำบล/แขวง"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์ <span className="text-red-500">*</span></Label>
                                <Input
                                    className="bg-white h-12"
                                    value={formData[getField('zipCode')] || ""}
                                    onChange={(e) => onChange(getField('zipCode'), e.target.value.replace(/\D/g, '').slice(0, 5))}
                                    disabled={disabled}
                                    maxLength={5}
                                    placeholder="12345"
                                />
                            </div>
                        </div>
                    )}
                    {footerChildren}
                </div>

                {!hideFields && (
                    <div className="flex flex-col gap-4">
                        <div className="relative group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[220px] flex flex-col">
                            <div className="flex-1 bg-gray-100 relative shadow-inner overflow-hidden">
                                {lat && lng ? (
                                    <div className="absolute inset-0 z-0 scale-100 group-hover:scale-105 transition-transform duration-500">
                                        <MapContents
                                            center={[parseFloat(lat), parseFloat(lng)]}
                                            zoom={15}
                                            position={[parseFloat(lat), parseFloat(lng)]}
                                            onLocationSelect={() => { }}
                                        />
                                        {/* Overlay to disable interaction but allow clicks to open dialog */}
                                        <div
                                            className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                                            onClick={() => setShowMapDialog(true)}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowMapDialog(true)}
                                    >
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-gray-400 group-hover:text-chaiyo-blue transition-colors" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">คลิกเพื่อระบุตำแหน่ง</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">พิกัดสถานที่</span>
                                    {lat && lng && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] text-chaiyo-blue hover:text-chaiyo-blue hover:bg-blue-50"
                                            onClick={() => setShowMapDialog(true)}
                                        >
                                            <RefreshCcw className="w-3 h-3 mr-1" /> เปลี่ยนตำแหน่ง
                                        </Button>
                                    )}
                                </div>

                                {lat && lng ? (
                                    <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-chaiyo-blue rounded-md flex items-center justify-center shrink-0">
                                                <Navigation className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-mono font-bold text-chaiyo-blue leading-tight">
                                                    {parseFloat(lat).toFixed(6)}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-chaiyo-blue leading-tight">
                                                    {parseFloat(lng).toFixed(6)}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full text-chaiyo-blue hover:bg-blue-100"
                                            onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setShowMapDialog(true)}
                                        className="w-full bg-chaiyo-blue text-white h-9 rounded-xl text-xs font-bold"
                                    >
                                        <MapPin className="w-3.5 h-3.5 mr-2" /> ระบุตำแหน่งพิกัด
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground px-2 italic">
                            * กรุณาระบุพิกัดให้ตรงกับตำแหน่งสถานที่จริงเพื่อใช้ในการประเมินและตรวจสอบ
                        </p>
                    </div>
                )}
            </div>

            <MapPickerDialog
                open={showMapDialog}
                onOpenChange={setShowMapDialog}
                initialLat={lat ? parseFloat(lat) : undefined}
                initialLng={lng ? parseFloat(lng) : undefined}
                onConfirm={(newLat, newLng) => {
                    onChange(getField('latitude'), newLat.toString());
                    onChange(getField('longitude'), newLng.toString());
                }}
                title={`ค้นหาตำแหน่ง: ${title}`}
            />
        </div>
    );
};
