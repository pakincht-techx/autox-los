import { useState } from "react";
import { Phone, Home, Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DatePickerBE } from "@/components/ui/DatePickerBE";
import { CustomerFormData } from "@/types/application";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VerifyAddressStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

const MOCK_STAFF_LIST = [
    { id: "y1008001", code: "y1008001", name: "สมชาย ใจดี", phone: "081-234-5678" },
    { id: "y1008002", code: "y1008002", name: "สุดา รักงาน", phone: "089-876-5432" },
    { id: "y1008003", code: "y1008003", name: "วิชัย มุ่งดี", phone: "090-111-2233" },
    { id: "y1008004", code: "y1008004", name: "มานี ตั้งใจ", phone: "086-444-5566" },
    { id: "y1008005", code: "y1008005", name: "ปรียา สุขสม", phone: "092-777-8899" },
];

const MismatchHint = ({ show }: { show: boolean }) => (
    show ? <p className="text-xs text-orange-600 mt-1 animate-in fade-in slide-in-from-top-1">ไม่ตรงกับข้อมูลผู้กู้</p> : null
);

export function VerifyAddressStep({ formData, setFormData }: VerifyAddressStepProps) {
    // ข้อมูลที่อยู่อาศัยปัจจุบัน
    const [housingType, setHousingType] = useState("ถูกต้อง");
    const [housingStatus, setHousingStatus] = useState("");
    const [housingDurationYears, setHousingDurationYears] = useState("");
    const [housingDurationMonths, setHousingDurationMonths] = useState("");
    const [livingWith, setLivingWith] = useState("");
    const [livingWithRelationships, setLivingWithRelationships] = useState<string[]>([]);

    // ผู้ประเมินสถานที่ทำงาน
    const [assessorId, setAssessorId] = useState(MOCK_STAFF_LIST[0].id);
    const [assessorPhone, setAssessorPhone] = useState(MOCK_STAFF_LIST[0].phone);
    const [assessmentDate, setAssessmentDate] = useState("");

    const handleAddressChange = (field: keyof CustomerFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isAddressDisabled = housingType !== "ไม่ถูกต้อง";

    // Per-field mismatch checks
    const mismatch = {
        housingStatus: housingStatus ? housingStatus !== formData.currentHousingStatus : false,
        housingDurationYears: housingDurationYears ? housingDurationYears !== formData.housingDurationYears : false,
        housingDurationMonths: housingDurationMonths ? housingDurationMonths !== formData.housingDurationMonths : false,
        livingWith: livingWith ? livingWith !== formData.currentResidentType : false,
        livingWithRelationships: (() => {
            if (livingWith !== "อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์" || livingWithRelationships.length === 0) return false;
            const currentRels = formData.currentResidentRelationships || [];
            if (livingWithRelationships.length !== currentRels.length) return true;
            return livingWithRelationships.some(r => !currentRels.includes(r));
        })(),
    };


    return (
        <div className="space-y-6">
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            ข้อมูลที่อยู่อาศัยปัจจุบัน
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6 space-y-6">

                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-gray-800">
                            สถานที่ตั้ง <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                            value={housingType} 
                            onValueChange={setHousingType}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ถูกต้อง" id="loc-correct" />
                                <Label htmlFor="loc-correct" className="font-normal cursor-pointer text-sm">ถูกต้อง</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ไม่ถูกต้อง" id="loc-incorrect" />
                                <Label htmlFor="loc-incorrect" className="font-normal cursor-pointer text-sm">ไม่ถูกต้อง</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ไม่พบ" id="loc-notfound" />
                                <Label htmlFor="loc-notfound" className="font-normal cursor-pointer text-sm">ไม่พบ</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4 border-t border-border-strong pt-6">
                        <Label className="text-base font-bold text-gray-800">
                            ที่อยู่ปัจจุบัน
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">บ้านเลขที่</Label>
                                <Input disabled={isAddressDisabled} value={formData.houseNumber || ""} onChange={e => handleAddressChange("houseNumber", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                <Input disabled={isAddressDisabled} value={formData.moo || ""} onChange={e => handleAddressChange("moo", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">อาคาร/หมู่บ้าน</Label>
                                <Input disabled={isAddressDisabled} value={formData.village || ""} onChange={e => handleAddressChange("village", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">ซอย</Label>
                                <Input disabled={isAddressDisabled} value={formData.soi || ""} onChange={e => handleAddressChange("soi", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">ถนน</Label>
                                <Input disabled={isAddressDisabled} value={formData.street || ""} onChange={e => handleAddressChange("street", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">ตำบล/แขวง</Label>
                                <Input disabled={isAddressDisabled} value={formData.subDistrict || ""} onChange={e => handleAddressChange("subDistrict", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">อำเภอ/เขต</Label>
                                <Input disabled={isAddressDisabled} value={formData.district || ""} onChange={e => handleAddressChange("district", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">จังหวัด</Label>
                                <Input disabled={isAddressDisabled} value={formData.province || ""} onChange={e => handleAddressChange("province", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                                <Input disabled={isAddressDisabled} value={formData.zipCode || ""} onChange={e => handleAddressChange("zipCode", e.target.value)} className="h-11 bg-white disabled:bg-gray-50 disabled:text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border-strong pt-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {/* สถานะที่อยู่อาศัย */}
                        <div className="space-y-1.5">
                            <Label>
                                สถานะที่อยู่อาศัย <span className="text-red-500">*</span>
                            </Label>
                            <Select value={housingStatus} onValueChange={setHousingStatus}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="ระบุสถานะที่อยู่อาศัย" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="เป็นของตนเอง (เป็นเจ้าบ้าน)">เป็นของตนเอง (เป็นเจ้าบ้าน)</SelectItem>
                                    <SelectItem value="เป็นผู้อาศัย">เป็นผู้อาศัย</SelectItem>
                                    <SelectItem value="เช่า">เช่า</SelectItem>
                                </SelectContent>
                            </Select>
                            <MismatchHint show={mismatch.housingStatus} />
                        </div>

                        {/* ระยะเวลาที่พักอาศัย */}
                        <div className="space-y-1.5">
                            <Label>
                                ระยะเวลาที่พักอาศัย <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <Input
                                        type="number"
                                        className="h-11 bg-white pr-12"
                                        placeholder="0"
                                        value={housingDurationYears}
                                        onChange={(e) => setHousingDurationYears(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">ปี</span>
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        type="number"
                                        className="h-11 bg-white pr-14"
                                        placeholder="0"
                                        max={11}
                                        value={housingDurationMonths}
                                        onChange={(e) => setHousingDurationMonths(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">เดือน</span>
                                </div>
                            </div>
                            <MismatchHint show={mismatch.housingDurationYears || mismatch.housingDurationMonths} />
                        </div>

                        {/* อาศัยอยู่กับใคร */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>
                                    อาศัยอยู่กับใคร <span className="text-red-500">*</span>
                                </Label>
                                <Select value={livingWith} onValueChange={(val) => {
                                    setLivingWith(val);
                                    if (val === "อยู่คนเดียว") {
                                        setLivingWithRelationships([]);
                                    }
                                }}>
                                    <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="ระบุผู้ที่พักอาศัยอยู่ด้วยกัน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="อยู่คนเดียว">อยู่คนเดียว</SelectItem>
                                        <SelectItem value="อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์">อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์</SelectItem>
                                    </SelectContent>
                                </Select>
                                <MismatchHint show={mismatch.livingWith} />
                            </div>

                            {livingWith === "อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์" && (
                                <>
                                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <Label className="text-xs text-muted-foreground">โปรดระบุความสัมพันธ์ (เลือกได้มากกว่า 1)</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["พ่อ", "แม่", "ลูก", "สามี/ภรรยา/แฟน", "ญาติ", "เพื่อน"].map((relation) => {
                                                const isSelected = livingWithRelationships.includes(relation);
                                                return (
                                                    <Button
                                                        key={relation}
                                                        type="button"
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={cn(
                                                            "h-9 px-3 rounded-full text-xs font-medium transition-all",
                                                            isSelected ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90" : "bg-white hover:bg-gray-100 border-border-strong text-gray-700"
                                                        )}
                                                        onClick={() => {
                                                            setLivingWithRelationships(prev =>
                                                                isSelected
                                                                    ? prev.filter(r => r !== relation)
                                                                    : [...prev, relation]
                                                            );
                                                        }}
                                                    >
                                                        {relation}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <MismatchHint show={mismatch.livingWithRelationships} />
                                </>
                            )}
                        </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ผู้ประเมินสถานที่ */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            ผู้ประเมินสถานที่
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <span>พนักงาน</span>
                                    <span className="text-red-500">*</span>
                                    <span className="text-xs text-muted-foreground font-normal ml-1">(รหัส, ชื่อ-นามสกุล)</span>
                                </Label>
                                <Combobox
                                    options={MOCK_STAFF_LIST.map(s => ({
                                        value: s.id,
                                        label: `${s.name} (${s.code})`,
                                    }))}
                                    value={assessorId}
                                    onValueChange={(val) => {
                                        const staff = MOCK_STAFF_LIST.find(s => s.id === val);
                                        setAssessorId(val);
                                        if (staff) setAssessorPhone(staff.phone);
                                    }}
                                    placeholder="ค้นหาพนักงาน..."
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                    เบอร์ติดต่อพนักงาน
                                </Label>
                                <Input
                                    value={assessorPhone}
                                    onChange={(e) => setAssessorPhone(e.target.value)}
                                    placeholder="0XX-XXX-XXXX"
                                    className="h-11 bg-white font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    วันที่ประเมิน
                                </Label>
                                <DatePickerBE
                                    value={assessmentDate}
                                    onChange={setAssessmentDate}
                                    inputClassName="h-11"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
