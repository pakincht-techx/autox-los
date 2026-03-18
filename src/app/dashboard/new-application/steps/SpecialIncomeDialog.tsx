import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Building, Sprout, Cat, Store, Plus, Briefcase } from "lucide-react";

export type SpecialIncomeType = "business_owner" | "farmer" | "temporary_employee";
export type FarmerSubType = "crop" | "livestock";

export interface SpecialIncomeSource {
    id: string;
    type: SpecialIncomeType;
    farmerSubType?: FarmerSubType;
    name: string; // Business name, Crop name, or Animal type
    netIncome: number;
    details: any; // Store all raw form data here
}

interface SpecialIncomeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (source: SpecialIncomeSource) => void;
    initialData?: SpecialIncomeSource | null;
}

const formatNumberWithCommas = (val: string | number) => {
    if (val === null || val === undefined || val === "") return "";
    const parts = val.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

export function SpecialIncomeDialog({ open, onOpenChange, onSave, initialData }: SpecialIncomeDialogProps) {
    const [type, setType] = useState<SpecialIncomeType>("business_owner");
    const [farmerSubType, setFarmerSubType] = useState<FarmerSubType>("crop");

    // Form States
    const [formData, setFormData] = useState<any>({});
    const [netIncome, setNetIncome] = useState(0);

    const handleNumberChange = (field: string, value: string) => {
        const cleanValue = value.replace(/,/g, '');
        if (/^\d*\.?\d*$/.test(cleanValue) || cleanValue === "") {
            setFormData((prev: any) => ({ ...prev, [field]: cleanValue }));
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Calculate Net Income whenever data changes
    useEffect(() => {
        let calculated = 0;
        if (type === "business_owner") {
            const sales = Number(formData.sales || 0);
            const costRaw = Number(formData.costRawMaterial || 0);
            const costRent = Number(formData.costRent || 0);
            const costOther = Number(formData.costOther || 0);
            calculated = sales - (costRaw + costRent + costOther);
        } else if (type === "farmer") {
            if (farmerSubType === "crop") {
                const salesPerRai = Number(formData.salesPerRai || 0);
                const costPerRai = Number(formData.costPerRai || 0);
                const raiCount = Number(formData.raiCount || 0);
                const cycles = Number(formData.cyclesPerYear || 1);

                const yearlyNet = (salesPerRai - costPerRai) * raiCount * cycles;
                calculated = yearlyNet / 12;
            } else if (farmerSubType === "livestock") {
                const pricePerHead = Number(formData.pricePerHead || 0);
                const costPerHead = Number(formData.costPerHead || 0);
                const headCount = Number(formData.headCount || 0);
                const cycles = Number(formData.cyclesPerYear || 1);

                const yearlyNet = (pricePerHead - costPerHead) * headCount * cycles;
                calculated = yearlyNet / 12;
            }
        } else if (type === "temporary_employee") {
            calculated = Number(formData.monthlyIncome || 0);
        }
        setNetIncome(calculated > 0 ? calculated : 0);
    }, [formData, type, farmerSubType]);

    // Set data when opened
    useEffect(() => {
        if (open) {
            if (initialData) {
                setType(initialData.type);
                if (initialData.farmerSubType) setFarmerSubType(initialData.farmerSubType);
                setFormData(initialData.details || {});
                setNetIncome(initialData.netIncome || 0);
            } else {
                setFormData({});
                setNetIncome(0);
                setType("business_owner");
                setFarmerSubType("crop");
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        let name = "";
        if (type === "business_owner") name = formData.businessName || "กิจการ";
        else if (type === "farmer" && farmerSubType === "crop") name = formData.cropName || "พืชผล";
        else if (type === "farmer" && farmerSubType === "livestock") name = formData.animalType || "ปศุสัตว์";
        else if (type === "temporary_employee") name = formData.companyName || "พนักงานชั่วคราว";

        const source: SpecialIncomeSource = {
            id: initialData ? initialData.id : Math.random().toString(36).substring(7),
            type,
            farmerSubType: type === "farmer" ? farmerSubType : undefined,
            name,
            netIncome: Math.round(netIncome),
            details: formData
        };
        onSave(source);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg" className="bg-gray-50 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        เพิ่มรายได้พิเศษ (กิจการ/เกษตร)
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Type Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm text-gray-700">ประเภทรายได้พิเศษ</Label>
                        <Tabs value={type} onValueChange={(v) => setType(v as SpecialIncomeType)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 p-1 rounded-xl">
                                <TabsTrigger
                                    value="temporary_employee"
                                    className="rounded-lg font-bold h-full data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm transition-all"
                                >
                                    <Briefcase className="w-4 h-4 mr-2" /> พนักงานชั่วคราว
                                </TabsTrigger>
                                <TabsTrigger
                                    value="business_owner"
                                    className="rounded-lg font-bold h-full data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm transition-all"
                                >
                                    <Building className="w-4 h-4 mr-2" /> เจ้าของกิจการ
                                </TabsTrigger>
                                <TabsTrigger
                                    value="farmer"
                                    className="rounded-lg font-bold h-full data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm transition-all"
                                >
                                    <Sprout className="w-4 h-4 mr-2" /> เกษตรกร
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
                        {type === "temporary_employee" && (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ชื่อบริษัท</Label>
                                        <Input
                                            value={formData.companyName || ""}
                                            onChange={(e) => handleChange("companyName", e.target.value)}
                                            placeholder="ระบุชื่อบริษัท..."
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>รายได้ (บาท/เดือน)</Label>
                                        <Input
                                            value={formatNumberWithCommas(formData.monthlyIncome || "")}
                                            onChange={(e) => handleNumberChange("monthlyIncome", e.target.value)}
                                            className="h-11 text-right text-lg font-bold bg-white"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ตำแหน่ง</Label>
                                        <Input
                                            value={formData.jobPosition || ""}
                                            onChange={(e) => handleChange("jobPosition", e.target.value)}
                                            placeholder="ระบุตำแหน่ง..."
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อายุงาน (ปี)</Label>
                                        <Input
                                            type="number"
                                            value={formData.workExperienceYears || ""}
                                            onChange={(e) => handleNumberChange("workExperienceYears", e.target.value)}
                                            placeholder="ระบุอายุงาน..."
                                            className="h-11 text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === "business_owner" && (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ชื่อกิจการ</Label>
                                        <Input
                                            value={formData.businessName || ""}
                                            onChange={(e) => handleChange("businessName", e.target.value)}
                                            placeholder="ร้านค้า, บริษัท..."
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ประเภทกิจการ</Label>
                                        <Input
                                            value={formData.businessType || ""}
                                            onChange={(e) => handleChange("businessType", e.target.value)}
                                            placeholder="ขายอาหาร, บริการ..."
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>อายุกิจการ (ปี/เดือน)</Label>
                                        <Input
                                            value={formData.businessAgeYears || ""}
                                            onChange={(e) => handleChange("businessAgeYears", e.target.value)}
                                            placeholder="เช่น 2 ปี 5 เดือน"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>วันที่เปิดขาย (เวลาทำการ)</Label>
                                        <Input
                                            value={formData.openDate || ""}
                                            onChange={(e) => handleChange("openDate", e.target.value)}
                                            placeholder="จันทร์-ศุกร์ 8:00-17:00"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-4">
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <Label className="text-blue-800 block mb-2">รวมยอดขาย (บาท/เดือน)</Label>
                                        <Input
                                            value={formatNumberWithCommas(formData.sales || "")}
                                            onChange={(e) => handleNumberChange("sales", e.target.value)}
                                            className="h-11 text-right text-lg font-bold bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-3">
                                        <Label className="text-red-800 block">รวมต้นทุน (บาท/เดือน)</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-600">ค่าวัตถุดิบ</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.costRawMaterial || "")}
                                                    onChange={(e) => handleNumberChange("costRawMaterial", e.target.value)}
                                                    className="h-11 text-right bg-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-600">ค่าเช่า</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.costRent || "")}
                                                    onChange={(e) => handleNumberChange("costRent", e.target.value)}
                                                    className="h-11 text-right bg-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-600">ใช้จ่ายอื่นๆ</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.costOther || "")}
                                                    onChange={(e) => handleNumberChange("costOther", e.target.value)}
                                                    className="h-11 text-right bg-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === "farmer" && (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                                <Tabs value={farmerSubType} onValueChange={(v) => setFarmerSubType(v as FarmerSubType)}>
                                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-xl h-11">
                                        <TabsTrigger
                                            value="crop"
                                            className="rounded-lg font-bold h-full data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
                                        >
                                            <Sprout className="w-4 h-4 mr-2" /> ปลูกพืช
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="livestock"
                                            className="rounded-lg font-bold h-full data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all"
                                        >
                                            <Cat className="w-4 h-4 mr-2" /> ปศุสัตว์
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="crop" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>ผลผลิตที่ปลูก</Label>
                                            <Input
                                                value={formData.cropName || ""}
                                                onChange={(e) => handleChange("cropName", e.target.value)}
                                                placeholder="ข้าว, ข้าวโพด, อ้อย..."
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>ยอดขาย (บาท ต่อ ไร่/รอบ)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.salesPerRai || "")}
                                                    onChange={(e) => handleNumberChange("salesPerRai", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ต้นทุน (บาท ต่อ ไร่/รอบ)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.costPerRai || "")}
                                                    onChange={(e) => handleNumberChange("costPerRai", e.target.value)}
                                                    className="h-11 text-right text-red-600"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>จำนวนไร่ที่ปลูก (ไร่)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.raiCount || "")}
                                                    onChange={(e) => handleNumberChange("raiCount", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>จำนวนรอบต่อปี</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.cyclesPerYear || "")}
                                                    onChange={(e) => handleNumberChange("cyclesPerYear", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="1"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="livestock" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>ประเภทสัตว์ที่เลี้ยง</Label>
                                            <Input
                                                value={formData.animalType || ""}
                                                onChange={(e) => handleChange("animalType", e.target.value)}
                                                placeholder="โคเนื้อ, หมู, ไก่ไข่..."
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>ราคาขาย (บาท ต่อ ตัว)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.pricePerHead || "")}
                                                    onChange={(e) => handleNumberChange("pricePerHead", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ต้นทุน (บาท ต่อ ตัว)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.costPerHead || "")}
                                                    onChange={(e) => handleNumberChange("costPerHead", e.target.value)}
                                                    className="h-11 text-right text-red-600"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>จำนวนที่เลี้ยง (ตัว)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.headCount || "")}
                                                    onChange={(e) => handleNumberChange("headCount", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>จำนวนรอบต่อปี</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.cyclesPerYear || "")}
                                                    onChange={(e) => handleNumberChange("cyclesPerYear", e.target.value)}
                                                    className="h-11 text-right"
                                                    placeholder="1"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>

                    {/* Result Card */}
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-center justify-between shadow-inner">
                        <Label className="text-emerald-800 text-base">สรุปรายได้สุทธิ (ต่อเดือน)</Label>
                        <div className="text-3xl font-black text-emerald-600 font-mono">
                            ฿{formatNumberWithCommas(netIncome)}
                        </div>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
                    <Button onClick={handleSave} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90">
                        <Plus className="w-4 h-4 mr-2" /> บันทึกรายได้
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
