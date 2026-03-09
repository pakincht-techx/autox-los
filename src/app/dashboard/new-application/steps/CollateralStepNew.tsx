// Merged Collateral Step - Replaced with Pre-question style UI
"use client";

import { useState, useEffect } from "react";
import {
    Car, Bike, Truck, Tractor, Map, Sparkles, Upload, FileText,
    Check, Loader2, AlertCircle, Camera, Book, X, Plus,
    ChevronLeft, ChevronRight, Eye, UserCheck, Calculator, ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    CAR_BRANDS,
    MOTO_BRANDS,
    TRUCK_BRANDS,
    AGRI_BRANDS,
    MODELS_BY_BRAND,
    SUB_MODELS_BY_MODEL,
    YEARS,
    YEARS_AD
} from "@/data/vehicle-data";
import { THAI_ADDRESS_DATA } from "@/data/thai-address-data";
import { DatePickerBE } from "@/components/ui/DatePickerBE";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

const PRODUCTS = [
    {
        id: "car",
        label: "รถเก๋ง / รถกระบะ / รถตู้",
        desc: "เล่มทะเบียนรถ",
        icon: Car,
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: "moto",
        label: "รถจักรยานยนต์",
        desc: "เล่มทะเบียนรถ",
        icon: Bike,
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: "truck",
        label: "รถบรรทุก",
        desc: "เล่มทะเบียนรถ",
        icon: Truck,
        color: "bg-orange-100 text-orange-600"
    },
    {
        id: "agri",
        label: "รถเพื่อการเกษตร",
        desc: "เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย",
        icon: Tractor,
        color: "bg-green-100 text-green-600"
    },
    {
        id: "land",
        label: "ที่ดิน",
        desc: "โฉนดที่ดิน",
        icon: Map,
        color: "bg-yellow-100 text-yellow-600 hover:text-yellow-700"
    },
];

const COLLATERAL_QUESTIONS: Record<string, { id: string; text: string }[]> = {
    car: [
        { id: 'car_q1', text: 'เป็นรถจากเต้นท์' },
        { id: 'car_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
        { id: 'car_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่ รถสองแถว/รถกะป๊อ /รถจากอาสามูลนิธิ' },
        { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
        { id: 'car_q6', text: 'เป็นรถล้อเกินซุ้มล้อ' },
        { id: 'car_q7', text: 'เป็นรถที่ตัดแต่งคัสซี / ตัดเว้าคัสซี' },
        { id: 'car_q8', text: 'รถที่เปลี่ยนเครื่องยนต์ กรณีเปลี่ยนเครื่องยนต์ใช้เครื่องยนต์รุ่นเดียวกัน' },
        { id: 'car_q9', text: 'รถติดก๊าซ LPG / NGV โดยการติดตั้งเอง รวมถึงรถที่เคยมีประวัติติดตั้งก๊าซ (ยกเว้น การติดตั้งมาตรฐานจากโรงงานผู้ผลิตรถยนต์ของยี่ห้อนั้นๆ)' },
        { id: 'car_q10', text: 'ดัดแปลงสภาพภายใน เจาะคอนโซล เจาะแผงประตู เพื่อติดตั้งลำโพงหรือพ่นสีภายในใหม่แตกต่างจากมาตรฐาน' },
        { id: 'car_q11', text: 'เปลี่ยนเบาะใหม่เป็นเบาะรถแข่งหรือเบาะที่แตกต่างจากมาตรฐาน' },
        { id: 'car_q12', text: 'สีเสื่อมสภาพ' },
        { id: 'car_q13', text: 'กระบะผุ เป็นสนิม' },
        { id: 'car_q14', text: 'รอยบุบ รอยชน สนิม ผุ เคาะพ่นสีใหม่ทั้งคัน' },
        { id: 'car_q15', text: 'รถเปลี่ยนสีใหม่ไม่ใช่สีเดิม' },
        { id: 'car_q16', text: 'รถดัดแปลงสภาพช่วงล่าง รถเสริมแหนบ ต่อเติมเสริมคอกกระบะ (เกินตัวรถ) ต่อเติมตู้ทึบจากกระบะ' },
    ],
    moto: [
        { id: 'moto_q1', text: 'เป็นรถจากเต้นท์' },
        { id: 'moto_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
        { id: 'moto_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
    ],
    truck: [
        { id: 'truck_q1', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
    ],
    agri: [],
    land: [
        { id: 'land_q1', text: 'เป็นที่ดินตาบอด หรือ ที่ดินติดคลอง/ติดลำธารทีไม่ติดถนนสาธารณะ' },
        { id: 'land_q2', text: 'เป็นที่ดินติดโรงเรียน/วัด/ศาลเจ้า/สถานที่ศักดิ์อื่น ๆ /สุสาน/ป่าช้า/บ่อขยะ' },
        { id: 'land_q3', text: 'เป็นที่ดินติดเขตการรถไฟ' },
        { id: 'land_q4', text: 'มีบ่อน้ำในที่ดินเกิน 40%' },
        { id: 'land_q5', text: 'ที่ดินรกร้างไม่ได้ทำประโยชน์' },
        { id: 'land_q6', text: 'ที่ดินสาธารณะประโยชน์ที่รถยนต์ไม่สามารถเข้าออกได้' },
        { id: 'land_q7', text: 'เป็นที่ดินเชิงเขาและอยู่ในเขตป่าสงวน / ป่าไม้แห่งชาติ' },
        { id: 'land_q8', text: 'เป็นที่ดินภาระจำยอมของบุคคลอื่น มีรั้วปิดทางเข้าออก' },
        { id: 'land_q9', text: 'เป็นที่ดินที่มีสัญญาเช่าระยะยาว เช่น ให้เช่าตั้งสัญญาณโทรศัพท์, มินิมาร์ท' },
    ],
};

const THAI_PREFIXES = [
    { value: "นาย", label: "นาย" },
    { value: "นาง", label: "นาง" },
    { value: "นางสาว", label: "นางสาว" },
    { value: "คุณ", label: "คุณ" },
    { value: "นพ.", label: "นพ." },
    { value: "พญ.", label: "พญ." },
    { value: "ดร.", label: "ดร." },
    { value: "ทพ.", label: "ทพ." },
    { value: "ทพญ.", label: "ทพญ." },
    { value: "พล.อ.", label: "พล.อ." },
    { value: "พล.ท.", label: "พล.ท." },
    { value: "พล.ต.", label: "พล.ต." },
    { value: "พ.อ.", label: "พ.อ." },
    { value: "พ.ท.", label: "พ.ท." },
    { value: "พ.ต.", label: "พ.ต." },
    { value: "ร.อ.", label: "ร.อ." },
    { value: "ร.ท.", label: "ร.ท." },
    { value: "ร.ต.", label: "ร.ต." },
    { value: "พล.ต.อ.", label: "พล.ต.อ." },
    { value: "พ.ต.อ.", label: "พ.ต.อ." },
    { value: "พ.ต.ท.", label: "พ.ต.ท." },
    { value: "พ.ต.ต.", label: "พ.ต.ต." },
    { value: "ร.ต.อ.", label: "ร.ต.อ." },
    { value: "ร.ต.ท.", label: "ร.ต.ท." },
    { value: "ร.ต.ต.", label: "ร.ต.ต." },
    { value: "ว่าที่ ร.ต.", label: "ว่าที่ ร.ต." },
    { value: "ม.ล.", label: "ม.ล." },
    { value: "ม.ร.ว.", label: "ม.ร.ว." },
    { value: "ม.จ.", label: "ม.จ." },
];

const DEED_TYPES = [
    { value: "น.ส. 4", label: "น.ส. 4" },
    { value: "น.ส. 3 ก.", label: "น.ส. 3 ก." },
    { value: "อ.ช. 2", label: "อ.ช. 2" },
    { value: "โฉนดตราจอง", label: "โฉนดตราจอง" },
    { value: "ตราจองที่ว่าได้ทำประโยชน์แล้ว", label: "ตราจองที่ว่าได้ทำประโยชน์แล้ว" },
];

const APPRAISAL_METHODS = [
    { value: "กรมที่ดิน", label: "ราคาประเมินจากกรมที่ดิน" },
    { value: "บริษัทประเมินภายนอก", label: "บริษัทประเมินภายนอก" },
    { value: "ประเมินโดยเจ้าหน้าที่", label: "ประเมินโดยเจ้าหน้าที่" }
];

const BUILDING_TYPES = [
    { value: "บ้านเดี่ยว", label: "บ้านเดี่ยว" },
    { value: "บ้านแฝด", label: "บ้านแฝด" },
    { value: "ทาวน์เฮ้าส์", label: "ทาวน์เฮ้าส์" },
    { value: "อาคารพาณิชย์", label: "อาคารพาณิชย์" },
    { value: "ห้องชุด", label: "ห้องชุด" },
    { value: "โรงงาน/โกดัง", label: "โรงงาน/โกดัง" },
    { value: "ที่ดินเปล่า", label: "ที่ดินเปล่า" },
    { value: "อื่นๆ", label: "อื่นๆ" }
];

const APPRAISAL_COMPANIES = [
    { value: "บริษัท เอ", label: "บริษัท เอ" },
    { value: "บริษัท บี", label: "บริษัท บี" },
    { value: "บริษัท ซี", label: "บริษัท ซี" }
];

const RELATION_SHIPS = [
    { value: "ตนเอง", label: "ตนเอง" },
    { value: "บิดา/มารดา", label: "บิดา/มารดา" },
    { value: "บุตร", label: "บุตร" },
    { value: "คู่สมรส", label: "คู่สมรส" },
    { value: "พี่น้อง", label: "พี่น้อง" }
];

const getPhotoDocs = (type: string) => {
    if (type === 'land') {
        return [
            { label: "รูปถ่ายหน้าที่ดิน (เห็นป้ายซอย/หลักหมุด/ทางเข้า)", required: true },
            { label: "รูปถ่ายสภาพที่ดิน 1", required: true },
            { label: "รูปถ่ายสภาพที่ดิน 2", required: true },
            { label: "รูปถ่ายสภาพที่ดิน 3", required: true },
            { label: "รูปถ่ายสภาพที่ดิน 4", required: true },
            { label: "รูปถ่ายทางเข้า-ออก", required: true },
            { label: "รูปถ่ายบ้านเลขที่ (ถ้ามี)", required: false },
            { label: "รูปถ่ายสภาพสิ่งปลูกสร้าง (ถ้ามี)", required: false }
        ];
    }
    return [
        { label: "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์", required: true },
        { label: "รูปหน้ารถ - เฉียงซ้าย45องศา", required: true },
        { label: "รูปหน้ารถ - เฉียงขวา45องศา", required: true },
        { label: "รูปหลังรถ - เฉียงซ้าย45องศา", required: true },
        { label: "รูปหลังรถ - เฉียงขวา45องศา", required: true },
        { label: "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ", required: true },
        { label: "รูปเลขตัวถัง/คัสซี", required: true },
        { label: "รูปเกียร์ 4x4 / 4WD (ถ้ามี)_สำหรับรถกระบะที่ขับเคลื่อน 4ล้อ(Optional)", required: false }
    ];
};

const getPaperDocs = (type: string, data: any = {}) => {
    if (type === 'land') {
        const docs = [
            { label: "รูปถ่ายโฉนดที่ดิน ด้านหน้า", required: true },
            { label: "รูปถ่ายโฉนดที่ดิน ด้านหลัง", required: true },
            { label: "รูปถ่ายโฉนดที่ดิน ลายน้ำ", required: true },
            { label: "ใบคู่คัดสำเนาโฉนดฉบับสำนักงานที่ดิน", required: true },
            { label: "ใบประเมินจากกรมที่ดิน อายุเอกสารไม่เกิน 30 วัน", required: true },
            { label: "ใบประเมินจาก SCB หรือบริษัทประเมินนนอกตามที่กำหนด อายุเอกสารไม่เกิน 6 เดือน (ถ้ามี)", required: false },
            { label: "ใบเสร็จชมพูฟ้า", required: true },
            { label: "รูปถ่ายพนักงานเซลฟี่กับกรมที่ดิน (Time Stamp)", required: true },
            { label: "ตรวจสอบเว็บไซด์ Landmap", required: true },
            { label: "ตรวจสอบจากเว็บไซด์กรมธนารักษ์", required: true },
        ];

        if (data.landDeedType === "อ.ช. 2") {
            docs.push({ label: "ใบปลอดภาระนิติบุคคลอาคารชุด (กรณีโฉนด อช2)", required: true });
        }
        if (data.landDeedType === "น.ส. 3 ก.") {
            docs.push({ label: "ใบระวาง อายุเอกสารไม่เกิน 30 วัน (กรณีโฉนด นส.3ก)", required: true });
        }
        // "บิลน้ำไฟ" (กรณีที่ดินพร้อมสิ่งปลูกสร้าง)
        if (data.buildingType && data.buildingType !== "ที่ดินเปล่า") {
            docs.push({ label: "บิลค่าน้ำค่าไฟ (กรณีที่ดินพร้อมสิ่งปลูกสร้าง)", required: true });
        }

        return docs;
    }

    const baseDocs = [
        { label: "รูปถ่ายเล่มทะเบียน หน้าปก", required: true },
        { label: "รูปถ่ายเล่มทะเบียน หน้ารายการจดทะเบียน", required: true },
        { label: "รูปถ่ายเล่มทะเบียน หน้ากลางเล่ม", required: true },
        { label: "รูปถ่ายเล่มทะเบียน หน้ารายการภาษี", required: true },
        { label: "รูปถ่ายเล่มทะเบียน หน้าบันทึกเจ้าหน้าที่", required: true },
        { label: "ผลเช็คต้น (ตามเงื่อนไข)", required: true },
        { label: "รูปภาพป้ายภาษี", required: true },
        { label: "หน้าตรวจสอบการชำระภาษีจากเว็ปกรมการขนส่งทางบก", required: true }
    ];

    if (type === 'truck') {
        baseDocs.push({ label: "สำเนาใบอนุญาตประกอบการขนส่งที่ยังไม่หมดอายุ (ขสบ. 11)", required: true });
    }

    return baseDocs;
};

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Initial setup if collateralType is already set
    useEffect(() => {
        if (!formData.collateralType || Object.keys(formData.collateralQuestions || {}).length === 0) {
            setFormData({
                ...formData,
                collateralType: formData.collateralType || 'car',
                // Prefill with default 'no' for all questions as seen in PreQuestionPage
                collateralQuestions: {
                    ...(formData.collateralQuestions || {}),
                    car_q1: 'no', car_q2: 'no', car_q3: 'no', car_q4: 'no', car_q5: 'no', car_q6: 'no', car_q7: 'no',
                    car_q8: 'no', car_q9: 'no', car_q10: 'no', car_q11: 'no', car_q12: 'no', car_q13: 'no', car_q14: 'no', car_q15: 'no', car_q16: 'no',
                    moto_q1: 'no', moto_q2: 'no', moto_q3: 'no',
                    truck_q1: 'no',
                    land_q1: 'no', land_q2: 'no', land_q3: 'no', land_q4: 'no', land_q5: 'no', land_q6: 'no', land_q7: 'no', land_q8: 'no', land_q9: 'no'
                },
                isLivelihoodCollateral: formData.isLivelihoodCollateral || 'yes',
                estimatedSalePrice: formData.estimatedSalePrice || '650000',
                landDeedType: formData.landDeedType || "น.ส. 4",
                landDeedNumber: formData.landDeedNumber || "12345",
                landNumber: formData.landNumber || "67",
                landVol: formData.landVol || "12",
                landPage: formData.landPage || "34",
                landLocationNotFound: formData.landLocationNotFound || "-",
                landProvince: formData.landProvince || "ปทุมธานี",
                landDistrict: formData.landDistrict || "ลำลูกกา",
                landSubDistrict: formData.landSubDistrict || "คูคต",
                landRavang: formData.landRavang || "5136 IV 7224-11",
                landPlotNumber: formData.landPlotNumber || "901",
                landMapNumber: formData.landMapNumber || "12",
                landSheetNumber: formData.landSheetNumber || "1",
                landSurveyPage: formData.landSurveyPage || "678",
                landRai: formData.landRai || "2",
                landNgan: formData.landNgan || "1",
                landWa: formData.landWa || "50",
                landUnitArea: formData.landUnitArea || "0",
                vehicleCondition: formData.vehicleCondition || "ใช้แล้ว",
                licensePlate: formData.licensePlate || "7กล 474",
                province: formData.province || "กรุงเทพมหานคร",
                brand: formData.brand || "HONDA",
                model: formData.model || "CIVIC",
                year: formData.year || "2018",
                subModel: formData.subModel || "1.8 i-VTEC EL",
                cc: formData.cc || "1,799",
                horsePower: formData.horsePower || "141",
                color: formData.color || "ขาว (Platinum White Pearl)",
                ryNumber: formData.ryNumber || "รย.1",
                appearance: formData.appearance || "เก๋งสองตอน",
                usageType: formData.usageType || "ส่วนบุคคล",
                fuelType: formData.fuelType || "เบนซิน",
                engineNumber: formData.engineNumber || "R18Z1-7842516",
                chassisNumber: formData.chassisNumber || "MRHFC1650JP742518",
                location: formData.location || "กรุงเทพมหานคร",
                appraisalMethod: formData.appraisalMethod || "กรมที่ดิน",
                appraisalDate: formData.appraisalDate || "",
                appraisalCompany: formData.appraisalCompany || "",
                landPricePerWah: formData.landPricePerWah || "",
                landAreaWah: formData.landAreaWah || "50",
                totalLandAppraisal: formData.totalLandAppraisal || "0",
                totalBuildingArea: formData.totalBuildingArea || "",
                buildingType: formData.buildingType || "บ้านเดี่ยว",
                buildingNumber: formData.buildingNumber || "",
                floorCount: formData.floorCount || "1",
                areaWidth: formData.areaWidth || "",
                areaLength: formData.areaLength || "",
                areaPerFloor: formData.areaPerFloor || "",
                buildingPricePerSqm: formData.buildingPricePerSqm || "",
                condoUnitArea: formData.condoUnitArea || "",
                totalCondoUnitAppraisal: formData.totalCondoUnitAppraisal || "",
                balconyArea: formData.balconyArea || "",
                totalBalconyAppraisal: formData.totalBalconyAppraisal || "",
                totalBuildingBeforeDepreciation: formData.totalBuildingBeforeDepreciation || "",
                depreciationAmount: formData.depreciationAmount || "",
                totalBuildingAfterDepreciation: formData.totalBuildingAfterDepreciation || "",
                totalCondoAppraisal: formData.totalCondoAppraisal || "",
                buildingAge: formData.buildingAge || "",
                isRenovated: formData.isRenovated || "no",
                lastRenovateYear: formData.lastRenovateYear || "",
                isBuildingOwnerSameAsBorrower: formData.isBuildingOwnerSameAsBorrower || "yes",
                buildingOwnerTitle: formData.buildingOwnerTitle || "นาย",
                buildingOwnerFirstName: formData.buildingOwnerFirstName || "",
                buildingOwnerLastName: formData.buildingOwnerLastName || "",
                buildingOwnerRelation: formData.buildingOwnerRelation || "ตนเอง",
                grandTotalAppraisal: formData.grandTotalAppraisal || "",
                landSeizedStatus: formData.landSeizedStatus || "ปกติ",
                landReplacementStatus: formData.landReplacementStatus || "ปกติ",
                villageName: formData.villageName || ""
            });
        }
    }, []);


    const handleAddPhoto = () => {
        setUploadedDocs(prev => [
            ...prev,
            `https://placehold.co/600x800/e2e8f0/1e293b?text=${encodeURIComponent(formData.collateralType === 'car' ? 'Car Front' : formData.collateralType === 'moto' ? 'Moto Side' : 'Document')}+${prev.length + 1}`
        ]);
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== idx));
    };

    const handleAnalyzePhotos = () => {
        setIsAnalyzing(true);
        setAiDetectedFields([]);
        toast.info("กำลังวิเคราะห์รูปถ่าย...", { duration: 1500 });

        setTimeout(() => {
            let mockData: any = { appraisalPrice: 450000 };
            let fields = ['appraisalPrice', 'brand', 'model', 'year'];

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2562', subModel: 'HEV Premium', taxDueDate: '2025-06-15', previousOwnerDate: '2017-01-20' };
                fields.push('subModel', 'taxDueDate', 'previousOwnerDate');
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2564', appraisalPrice: 35000, taxDueDate: '2025-03-10', previousOwnerDate: '2019-05-05' };
            } else if (formData.collateralType === 'truck') {
                mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2563', appraisalPrice: 500000, taxDueDate: '2024-11-22', previousOwnerDate: '2015-08-12' };
            } else if (formData.collateralType === 'agri') {
                mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2565', appraisalPrice: 600000, taxDueDate: '2026-01-01', previousOwnerDate: '2020-12-15' };
            }

            setFormData((prev: any) => ({ ...prev, ...mockData }));
            setAiDetectedFields(fields);
            setIsAnalyzing(false);
            toast.success("วิเคราะห์ข้อมูลสำเร็จ! ระบบได้กรอกข้อมูลเบื้องต้นให้แล้ว", {
                icon: <Sparkles className="w-4 h-4 text-purple-500" />
            });
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300 pb-20 pt-4">
            <div className="space-y-6">
                {/* SECTION: อัพโหลดเอกสารหลักประกัน */}
                <Card className="border-border-strong overflow-hidden mb-6">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <Upload className="w-5 h-5" />
                            อัพโหลดเอกสารหลักประกัน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ประเภทหลักประกัน <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.collateralType || "car"}
                                        onValueChange={(val) => setFormData({ ...formData, collateralType: val })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-white border-chaiyo-blue font-bold text-chaiyo-blue">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRODUCTS.map(p => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    <div className="flex items-center gap-2">
                                                        <p.icon className="w-4 h-4" />
                                                        {p.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-blue-500" />
                                    1.1 รูปถ่ายหลักประกัน
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {getPhotoDocs(formData.collateralType).map((doc, idx) => (
                                        <label key={idx} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 bg-gray-50/50 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all group cursor-pointer relative">
                                            <input type="file" accept="image/*" capture="environment" className="hidden" />
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-medium leading-tight px-1 py-0.5 rounded bg-white/80">
                                                {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Book className="w-4 h-4 text-emerald-500" />
                                    1.2 เอกสารหลักประกัน
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {getPaperDocs(formData.collateralType, formData).map((doc, idx) => (
                                        <label key={idx} className="aspect-video border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 bg-gray-50/50 hover:bg-white hover:border-emerald-400 hover:text-emerald-600 transition-all group cursor-pointer">
                                            <input type="file" accept="image/*,application/pdf" className="hidden" />
                                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Upload className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-medium leading-tight">
                                                {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <FileText className="w-5 h-5" />
                            ข้อมูลหลักประกัน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-xs text-muted-foreground mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                            * ข้อมูลเบื้องต้นดึงมาจากแบบสอบถามคัดกรอง (Pre-screening)
                        </p>

                        <div className="mt-8 space-y-6">
                            <div className="pb-2 border-b border-gray-100 mb-4">
                                <h3 className="text-sm font-bold text-gray-700">
                                    {formData.collateralType === 'land' ? 'รายละเอียดโฉนดที่ดิน' : 'รายละเอียดหลักประกัน'}
                                </h3>
                            </div>

                            {formData.collateralType === 'land' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ประเภทโฉนด</Label>
                                        <Select
                                            value={formData.landDeedType || "น.ส. 4"}
                                            onValueChange={(val) => setFormData({ ...formData, landDeedType: val })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEED_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขโฉนดที่ดิน <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landDeedNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, landDeedNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขที่ <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, landNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เล่ม <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landVol || ""}
                                            onChange={(e) => setFormData({ ...formData, landVol: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">หน้า <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landPage || ""}
                                            onChange={(e) => setFormData({ ...formData, landPage: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ไม่พบที่ตั้งที่ดินตามโฉนด</Label>
                                        <Input
                                            value={formData.landLocationNotFound || ""}
                                            onChange={(e) => setFormData({ ...formData, landLocationNotFound: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">จังหวัดที่ตั้งที่ดิน <span className="text-red-500">*</span></Label>
                                        <Combobox
                                            options={THAI_ADDRESS_DATA.map(p => ({ label: p.name, value: p.name }))}
                                            value={formData.landProvince || ""}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, landProvince: val, landDistrict: "", landSubDistrict: "" });
                                            }}
                                            className="h-10 rounded-xl"
                                            placeholder="เลือกจังหวัด"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">อำเภอ/เขต <span className="text-red-500">*</span></Label>
                                        <Combobox
                                            options={
                                                THAI_ADDRESS_DATA.find(p => p.name === formData.landProvince)
                                                    ?.districts.map(d => ({ label: d.name, value: d.name })) || []
                                            }
                                            value={formData.landDistrict || ""}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, landDistrict: val, landSubDistrict: "" });
                                            }}
                                            disabled={!formData.landProvince}
                                            className="h-10 rounded-xl"
                                            placeholder="เลือกอำเภอ/เขต"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ตำบล/แขวง <span className="text-red-500">*</span></Label>
                                        <Combobox
                                            options={
                                                THAI_ADDRESS_DATA.find(p => p.name === formData.landProvince)
                                                    ?.districts.find(d => d.name === formData.landDistrict)
                                                    ?.subdistricts.map(s => ({ label: s.name, value: s.name })) || []
                                            }
                                            value={formData.landSubDistrict || ""}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, landSubDistrict: val });
                                            }}
                                            disabled={!formData.landDistrict}
                                            className="h-10 rounded-xl"
                                            placeholder="เลือกตำบล/แขวง"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขระวาง</Label>
                                        <Input
                                            value={formData.landRavang || ""}
                                            onChange={(e) => setFormData({ ...formData, landRavang: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขที่ดิน <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landPlotNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, landPlotNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">หมายเลข <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landMapNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, landMapNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">แผ่นที่ <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landSheetNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, landSheetNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">หน้าสำรวจ</Label>
                                        <Input
                                            value={formData.landSurveyPage || ""}
                                            onChange={(e) => setFormData({ ...formData, landSurveyPage: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ไร่ <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landRai || ""}
                                            onChange={(e) => setFormData({ ...formData, landRai: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">งาน <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landNgan || ""}
                                            onChange={(e) => setFormData({ ...formData, landNgan: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ตารางวา <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landWa || ""}
                                            onChange={(e) => setFormData({ ...formData, landWa: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่ห้องชุด (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.landUnitArea || ""}
                                            onChange={(e) => setFormData({ ...formData, landUnitArea: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ลักษณสภาพรถ</Label>
                                        <Input
                                            value={formData.vehicleCondition || ""}
                                            onChange={(e) => setFormData({ ...formData, vehicleCondition: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขทะเบียน</Label>
                                        <Input
                                            value={formData.licensePlate || ""}
                                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">จังหวัด</Label>
                                        <Combobox
                                            options={THAI_ADDRESS_DATA.map(p => ({ label: p.name, value: p.name }))}
                                            value={formData.province || ""}
                                            onValueChange={(val) => setFormData({ ...formData, province: val })}
                                            className="h-10 rounded-xl"
                                            placeholder="เลือกจังหวัด"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ครบกำหนดเสียภาษี</Label>
                                        <DatePickerBE
                                            value={formData.taxDueDate}
                                            onChange={(val) => setFormData({ ...formData, taxDueDate: val })}
                                            inputClassName={cn(
                                                "h-10 transition-all focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20",
                                                aiDetectedFields.includes('taxDueDate') && "border-purple-300 ring-1 ring-purple-100 bg-purple-50/30 font-bold text-purple-700"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ยี่ห้อรถ</Label>
                                        <Input
                                            value={formData.brand || ""}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">รุ่นรถ</Label>
                                        <Input
                                            value={formData.model || ""}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">รุ่นปี ค.ศ.</Label>
                                        <Input
                                            value={formData.year || ""}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">หมายเลขรุ่นย่อย</Label>
                                        <Input
                                            value={formData.subModel || ""}
                                            onChange={(e) => setFormData({ ...formData, subModel: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ซีซี (CC)</Label>
                                        <Input
                                            value={formData.cc || ""}
                                            onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium text-left focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">แรงม้า</Label>
                                        <Input
                                            value={formData.horsePower || ""}
                                            onChange={(e) => setFormData({ ...formData, horsePower: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium text-left focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">สี</Label>
                                        <Input
                                            value={formData.color || ""}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลข รย.</Label>
                                        <Input
                                            value={formData.ryNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, ryNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ลักษณะ</Label>
                                        <Input
                                            value={formData.appearance || ""}
                                            onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ประเภทการใช้งาน</Label>
                                        <Input
                                            value={formData.usageType || ""}
                                            onChange={(e) => setFormData({ ...formData, usageType: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เชื้อเพลิง</Label>
                                        <Input
                                            value={formData.fuelType || ""}
                                            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขเครื่องยนต์</Label>
                                        <Input
                                            value={formData.engineNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium font-mono text-[12px] focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขตัวถัง</Label>
                                        <Input
                                            value={formData.chassisNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium font-mono text-[12px] focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">บริเวณสถานที่ตั้งรถ</Label>
                                        <Input
                                            value={formData.location || ""}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                        />
                                    </div>
                                </div>
                            )}

                            {COLLATERAL_QUESTIONS[formData.collateralType]?.length > 0 && !(formData.collateralType === 'land' && formData.landDeedType === 'อ.ช. 2') && (
                                <div className="pt-8 border-t border-border-subtle mt-8">
                                    <div className="pb-2 border-b border-gray-100 mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            เงื่อนไขการประเมินสภาพ{formData.collateralType === 'land' ? 'ทรัพย์สิน' : 'รถ'}
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        {COLLATERAL_QUESTIONS[formData.collateralType]?.map((q) => (
                                            <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                                <span className="text-sm text-gray-700 font-bold">{q.text}</span>
                                                <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1 rounded-lg shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' }
                                                        })}
                                                        className={cn(
                                                            "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                            formData.collateralQuestions?.[q.id] === 'yes'
                                                                ? "bg-gray-200 text-gray-700 shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        ใช่
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' }
                                                        })}
                                                        className={cn(
                                                            "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                            formData.collateralQuestions?.[q.id] === 'no'
                                                                ? "bg-chaiyo-blue text-white shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        ไม่ใช่
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 2: ข้อมูลผู้ถือกรรมสิทธิ์ */}
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <UserCheck className="w-5 h-5" />
                            ข้อมูลผู้ถือกรรมสิทธิ์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="pb-2 border-b border-gray-100 mb-2">
                                <h3 className="text-sm font-bold text-gray-700">ผู้ถือครองกรรมสิทธิ์</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-2 space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">คำนำหน้า</Label>
                                    <Combobox
                                        options={THAI_PREFIXES}
                                        value={formData.ownerTitle || "นาย"}
                                        onValueChange={(val) => setFormData({ ...formData, ownerTitle: val })}
                                        placeholder="คำนำหน้า"
                                        searchPlaceholder="ค้นหาคำนำหน้า..."
                                    />
                                </div>
                                <div className="md:col-span-10 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ชื่อ <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.ownerFirstName || "กฤตพาส"}
                                                onChange={(e) => setFormData({ ...formData, ownerFirstName: e.target.value })}
                                                className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">นามสกุล <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.ownerLastName || "อัครเดชธนาธรพงศ์"}
                                                onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                                                className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group: ระยะเวลาการถือกรรมสิทธิ์ */}
                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <div className="pb-2 border-b border-gray-100 mb-4">
                                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-chaiyo-gold" />
                                        {formData.collateralType === 'land' ? 'ข้อมูลการโอนกรรมสิทธิ์' : 'ระยะเวลาการถือกรรมสิทธิ์'}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">
                                            {formData.collateralType === 'land' ? 'วันที่โอนกรรมสิทธิ์ล่าสุด' : 'วันที่ถือกรรมสิทธิ์(จำนำ/จำนอง)/ครอบครอง(รีไฟแนนซ์)'}
                                        </Label>
                                        <DatePickerBE
                                            value={formData.ownershipStartDate}
                                            onChange={(val) => setFormData({ ...formData, ownershipStartDate: val })}
                                            inputClassName="h-12"
                                        />
                                    </div>
                                    {formData.collateralType !== 'land' && (
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ระยะเวลาถือกรรมสิทธิ์/ครอบครอง</Label>
                                            <div className="h-12 flex items-center px-4 bg-blue-50/30 border border-blue-100/50 rounded-xl text-chaiyo-blue font-medium">
                                                {formData.ownershipDuration || "3 ปี 2 เดือน 15 วัน"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group: ข้อมูลเจ้าของเดิม */}
                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <div className="pb-2 border-b border-gray-100 mb-4">
                                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Book className="w-4 h-4 text-blue-500" />
                                        ข้อมูลเจ้าของเดิม
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เจ้าของกรรมสิทธิ์เดิม</Label>
                                        <Input
                                            placeholder="ชื่อ-นามสกุล เจ้าของเดิม"
                                            value={formData.previousOwnerName || ""}
                                            onChange={(e) => setFormData({ ...formData, previousOwnerName: e.target.value })}
                                            className="h-12 rounded-xl bg-white border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ถือกรรมสิทธิ์ของเจ้าของเดิม</Label>
                                        <DatePickerBE
                                            value={formData.previousOwnerDate}
                                            onChange={(val) => setFormData({ ...formData, previousOwnerDate: val })}
                                            inputClassName={cn(
                                                "h-12 transition-all",
                                                aiDetectedFields.includes('previousOwnerDate') && "border-purple-300 ring-1 ring-purple-100 bg-purple-50/30 font-bold text-purple-700"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* NEW SECTION: รายละเอียดราคาประเมิน (Land Only) */}
                {formData.collateralType === 'land' && (
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <Calculator className="w-5 h-5" />
                                รายละเอียดราคาประเมิน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วิธีประเมิน <span className="text-red-500">*</span></Label>
                                        <RadioGroup
                                            value={formData.appraisalMethod || "กรมที่ดิน"}
                                            onValueChange={(val) => setFormData({ ...formData, appraisalMethod: val })}
                                            className="grid grid-cols-1 gap-2"
                                        >
                                            {APPRAISAL_METHODS.map(m => (
                                                <div key={m.value} className="relative">
                                                    <RadioGroupItem value={m.value} id={`method-${m.value}`} className="sr-only" />
                                                    <Label
                                                        htmlFor={`method-${m.value}`}
                                                        className={cn(
                                                            "flex h-10 items-center px-4 rounded-xl border border-gray-200 cursor-pointer transition-all font-medium text-sm",
                                                            formData.appraisalMethod === m.value ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        {m.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ประเมิน <span className="text-red-500">*</span></Label>
                                        <DatePickerBE
                                            value={formData.appraisalDate}
                                            onChange={(val) => setFormData({ ...formData, appraisalDate: val })}
                                            inputClassName="h-10 border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ชื่อบริษัทประเมิน <span className="text-red-500">*</span></Label>
                                        <RadioGroup
                                            value={formData.appraisalCompany || ""}
                                            onValueChange={(val) => setFormData({ ...formData, appraisalCompany: val })}
                                            className="grid grid-cols-1 gap-2"
                                        >
                                            {APPRAISAL_COMPANIES.map(c => (
                                                <div key={c.value} className="relative">
                                                    <RadioGroupItem value={c.value} id={`company-${c.value}`} className="sr-only" />
                                                    <Label
                                                        htmlFor={`company-${c.value}`}
                                                        className={cn(
                                                            "flex h-10 items-center px-4 rounded-xl border border-gray-200 cursor-pointer transition-all font-medium text-sm",
                                                            formData.appraisalCompany === c.value ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        {c.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Map className="w-4 h-4 text-yellow-500" />
                                        ข้อมูลราคาที่ดิน
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินที่ดิน (ตารางวาละ) <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.landPricePerWah ? Number(formData.landPricePerWah).toLocaleString() : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/,/g, '');
                                                        if (/^\d*$/.test(val)) {
                                                            const total = (Number(val) * Number(formData.landAreaWah || 0)).toString();
                                                            setFormData({
                                                                ...formData,
                                                                landPricePerWah: val,
                                                                totalLandAppraisal: total,
                                                                grandTotalAppraisal: (Number(total) + Number(formData.totalBuildingAfterDepreciation || 0)).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ (ตารางวา) <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.landAreaWah || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(val)) {
                                                            const total = (Number(formData.landPricePerWah || 0) * Number(val)).toString();
                                                            setFormData({
                                                                ...formData,
                                                                landAreaWah: val,
                                                                totalLandAppraisal: total,
                                                                grandTotalAppraisal: (Number(total) + Number(formData.totalBuildingAfterDepreciation || 0)).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ว.</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดิน <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    disabled
                                                    value={formData.totalLandAppraisal ? Number(formData.totalLandAppraisal).toLocaleString() : "0"}
                                                    className="h-10 rounded-xl bg-gray-50 border-gray-200 pr-10 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                        ข้อมูลราคาโครงการ/หมู่บ้าน
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ชื่อหมู่บ้าน</Label>
                                            <Input
                                                value={formData.villageName || ""}
                                                onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                placeholder="เช่น แลนด์ แอนด์ เฮ้าส์"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-emerald-500" />
                                        ข้อมูลสิ่งปลูกสร้าง
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ประเภทสิ่งปลูกสร้าง <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.buildingType || "บ้านเดี่ยว"}
                                                onValueChange={(val) => setFormData({ ...formData, buildingType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:ring-chaiyo-blue/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BUILDING_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">เลขที่สิ่งปลูกสร้าง <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.buildingNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ชั้น <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.floorCount || ""}
                                                onChange={(e) => setFormData({ ...formData, floorCount: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ความกว้างพื้นที่ (เมตร) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.areaWidth || ""}
                                                onChange={(e) => setFormData({ ...formData, areaWidth: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ความยาวพื้นที่ (เมตร) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.areaLength || ""}
                                                onChange={(e) => setFormData({ ...formData, areaLength: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่แต่ละชั้น (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.areaPerFloor || ""}
                                                onChange={(e) => setFormData({ ...formData, areaPerFloor: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่สิ่งปลูกสร้างทั้งหมด (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.totalBuildingArea || ""}
                                                onChange={(e) => setFormData({ ...formData, totalBuildingArea: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินสิ่งปลูกสร้าง (ตารางเมตรละ) <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.buildingPricePerSqm ? Number(formData.buildingPricePerSqm).toLocaleString() : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/,/g, '');
                                                        if (/^\d*$/.test(val)) {
                                                            setFormData({ ...formData, buildingPricePerSqm: val });
                                                        }
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-14 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท/ตร.ม.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mt-6">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่ห้องชุด (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.condoUnitArea || ""}
                                                onChange={(e) => setFormData({ ...formData, condoUnitArea: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินพื้นที่ห้องชุด <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.totalCondoUnitAppraisal ? Number(formData.totalCondoUnitAppraisal).toLocaleString() : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/,/g, '');
                                                        if (/^\d*$/.test(val)) {
                                                            setFormData({ ...formData, totalCondoUnitAppraisal: val });
                                                        }
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่ระเบียง (ตารางเมตร)</Label>
                                            <Input
                                                value={formData.balconyArea || ""}
                                                onChange={(e) => setFormData({ ...formData, balconyArea: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินพื้นที่ระเบียง</Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.totalBalconyAppraisal ? Number(formData.totalBalconyAppraisal).toLocaleString() : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/,/g, '');
                                                        if (/^\d*$/.test(val)) {
                                                            setFormData({ ...formData, totalBalconyAppraisal: val });
                                                        }
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-chaiyo-blue" />
                                        การรวมราคาและหักค่าเสื่อม
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินสิ่งปลูกสร้าง (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.totalBuildingBeforeDepreciation ? Number(formData.totalBuildingBeforeDepreciation).toLocaleString() : ""}
                                                onChange={(e) => setFormData({ ...formData, totalBuildingBeforeDepreciation: e.target.value.replace(/,/g, '') })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">หักค่าเสื่อมราคา <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.depreciationAmount || ""}
                                                onChange={(e) => setFormData({ ...formData, depreciationAmount: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินสิ่งปลูกสร้างหลังหักค่าเสื่อม <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.totalBuildingAfterDepreciation ? Number(formData.totalBuildingAfterDepreciation).toLocaleString() : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/,/g, '');
                                                    if (/^\d*$/.test(val)) {
                                                        setFormData({
                                                            ...formData,
                                                            totalBuildingAfterDepreciation: val,
                                                            grandTotalAppraisal: (Number(formData.totalLandAppraisal || 0) + Number(val)).toString()
                                                        });
                                                    }
                                                }}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดินและสิ่งปลูกสร้าง (หลังหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                            <Input
                                                disabled
                                                value={formData.grandTotalAppraisal ? Number(formData.grandTotalAppraisal).toLocaleString() : "0"}
                                                className="h-10 rounded-xl bg-gray-50 border-gray-200 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินรวมทั้งห้องชุด</Label>
                                            <Input
                                                value={formData.totalCondoAppraisal || ""}
                                                onChange={(e) => setFormData({ ...formData, totalCondoAppraisal: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                        อายุและการปรับปรุง
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">อายุสิ่งปลูกสร้าง <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.buildingAge || ""}
                                                    onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ปี</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">การรีโนเวท <span className="text-red-500">*</span></Label>
                                            <RadioGroup
                                                value={formData.isRenovated || "no"}
                                                onValueChange={(val) => setFormData({ ...formData, isRenovated: val })}
                                                className="flex h-10 gap-2"
                                            >
                                                {[
                                                    { value: 'yes', label: 'มีการรีโนเวท' },
                                                    { value: 'no', label: 'ไม่มีการรีโนเวท' }
                                                ].map((opt) => (
                                                    <div key={opt.value} className="flex-1 relative">
                                                        <RadioGroupItem value={opt.value} id={`renovate-${opt.value}`} className="sr-only" />
                                                        <Label
                                                            htmlFor={`renovate-${opt.value}`}
                                                            className={cn(
                                                                "flex h-full items-center justify-center rounded-xl border border-gray-200 cursor-pointer transition-all text-sm font-medium px-4",
                                                                formData.isRenovated === opt.value ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ปีที่รีโนเวทล่าสุด <span className="text-red-500">*</span></Label>
                                            <Input
                                                disabled={formData.isRenovated === 'no'}
                                                value={formData.lastRenovateYear || ""}
                                                onChange={(e) => setFormData({ ...formData, lastRenovateYear: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 disabled:bg-gray-50/50 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                placeholder="พ.ศ."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-chaiyo-blue" />
                                        ผู้ถือกรรมสิทธิ์สิ่งปลูกสร้าง
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ผู้ถือกรรมสิทธิ์สิ่งปลูกสร้างเป็นบุคคลเดียวกันกับผู้กู้ <span className="text-red-500">*</span></Label>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                                    <input
                                                        type="radio"
                                                        id="owner-same"
                                                        name="owner-building"
                                                        checked={formData.isBuildingOwnerSameAsBorrower === 'yes'}
                                                        onChange={() => setFormData({ ...formData, isBuildingOwnerSameAsBorrower: 'yes' })}
                                                    />
                                                    <Label htmlFor="owner-same" className="cursor-pointer">ใช่</Label>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                                    <input
                                                        type="radio"
                                                        id="owner-different"
                                                        name="owner-building"
                                                        checked={formData.isBuildingOwnerSameAsBorrower === 'no'}
                                                        onChange={() => setFormData({ ...formData, isBuildingOwnerSameAsBorrower: 'no' })}
                                                    />
                                                    <Label htmlFor="owner-different" className="cursor-pointer">ไม่ใช่</Label>
                                                </div>
                                            </div>
                                        </div>

                                        {formData.isBuildingOwnerSameAsBorrower === 'no' && (
                                            <>
                                                <div className="space-y-1">
                                                    <Label className="text-[13px] text-muted-foreground ml-1">คำนำหน้า</Label>
                                                    <Combobox
                                                        options={THAI_PREFIXES}
                                                        value={formData.buildingOwnerTitle || "นาย"}
                                                        onValueChange={(val) => setFormData({ ...formData, buildingOwnerTitle: val })}
                                                        placeholder="คำนำหน้า"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[13px] text-muted-foreground ml-1">ชื่อ</Label>
                                                    <Input
                                                        value={formData.buildingOwnerFirstName || ""}
                                                        onChange={(e) => setFormData({ ...formData, buildingOwnerFirstName: e.target.value })}
                                                        className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[13px] text-muted-foreground ml-1">นามสกุล</Label>
                                                    <Input
                                                        value={formData.buildingOwnerLastName || ""}
                                                        onChange={(e) => setFormData({ ...formData, buildingOwnerLastName: e.target.value })}
                                                        className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[13px] text-muted-foreground ml-1">ความสัมพันธ์กับผู้กู้</Label>
                                                    <Select
                                                        value={formData.buildingOwnerRelation || "ตนเอง"}
                                                        onValueChange={(val) => setFormData({ ...formData, buildingOwnerRelation: val })}
                                                    >
                                                        <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:ring-chaiyo-blue/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {RELATION_SHIPS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-red-500" />
                                        สถานะที่ดิน
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">สถานะที่ดิน การยึด/อายัด <span className="text-red-500">*</span></Label>
                                            <RadioGroup
                                                value={formData.landSeizedStatus || "ปกติ"}
                                                onValueChange={(val) => setFormData({ ...formData, landSeizedStatus: val })}
                                                className="flex h-10 gap-2"
                                            >
                                                {[
                                                    { value: 'ปกติ', label: 'ปกติ (ไม่มีการยึด)' },
                                                    { value: 'มีการยึด/อายัด', label: 'มีการยึด/อายัด' }
                                                ].map((opt) => (
                                                    <div key={opt.value} className="flex-1 relative">
                                                        <RadioGroupItem value={opt.value} id={`seized-${opt.value}`} className="sr-only" />
                                                        <Label
                                                            htmlFor={`seized-${opt.value}`}
                                                            className={cn(
                                                                "flex h-full items-center justify-center rounded-xl border border-gray-200 cursor-pointer transition-all text-sm font-medium px-4 whitespace-nowrap",
                                                                formData.landSeizedStatus === opt.value ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">สถานะที่ดิน การออกใบแทน <span className="text-red-500">*</span></Label>
                                            <RadioGroup
                                                value={formData.landReplacementStatus || "ปกติ"}
                                                onValueChange={(val) => setFormData({ ...formData, landReplacementStatus: val })}
                                                className="flex h-10 gap-2"
                                            >
                                                {[
                                                    { value: 'ปกติ', label: 'ปกติ (ไม่มีใบแทน)' },
                                                    { value: 'มีการออกใบแทน', label: 'มีการออกใบแทน' }
                                                ].map((opt) => (
                                                    <div key={opt.value} className="flex-1 relative">
                                                        <RadioGroupItem value={opt.value} id={`replace-${opt.value}`} className="sr-only" />
                                                        <Label
                                                            htmlFor={`replace-${opt.value}`}
                                                            className={cn(
                                                                "flex h-full items-center justify-center rounded-xl border border-gray-200 cursor-pointer transition-all text-sm font-medium px-4 whitespace-nowrap",
                                                                formData.landReplacementStatus === opt.value ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SECTION 4: แบบสอบถามพฤติกรรมที่เกี่ยวกับหลักประกัน (Land Only) */}
                {formData.collateralType === 'land' && (
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-chaiyo-gold/5 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 font-bold">
                                <FileText className="w-5 h-5 text-chaiyo-blue" />
                                แบบสอบถามพฤติกรรมที่เกี่ยวกับหลักประกัน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground mb-4">ส่วนนี้เป็นข้อมูลเพิ่มเติม (Optional) เพื่อใช้ประกอบการพิจารณา</p>

                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                    <span className="text-sm text-gray-700 font-bold">ใช้ทำมาหากินด้านไหน</span>
                                    <Input
                                        placeholder="ระบุ เช่น ทำสวน, ค้าขาย"
                                        className="h-11 w-full md:w-80 bg-white border-gray-200 focus:border-chaiyo-blue"
                                        value={formData.landUsageType || ""}
                                        onChange={(e) => setFormData({ ...formData, landUsageType: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                    <span className="text-sm text-gray-700 font-bold">ที่ดินทำกินมีคนช่วยทำงานหรือไม่</span>
                                    <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1 rounded-lg shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasHelpers: 'yes' })}
                                            className={cn(
                                                "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                formData.hasHelpers === 'yes' ? "bg-chaiyo-blue text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            มี
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasHelpers: 'no' })}
                                            className={cn(
                                                "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                formData.hasHelpers === 'no' ? "bg-chaiyo-blue text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            ไม่มี
                                        </button>
                                    </div>
                                </div>

                                {formData.hasHelpers === 'yes' && (
                                    <div className="flex flex-col gap-2 pl-6 border-l-2 border-blue-100 animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/20 border border-blue-50 rounded-xl gap-4">
                                            <span className="text-sm text-gray-600 font-medium">ญาติ พี่น้อง คนในครอบครัวที่ช่วยทำงาน กี่คน</span>
                                            <div className="relative w-full md:w-32">
                                                <Input
                                                    type="text"
                                                    placeholder="0"
                                                    value={formData.helperFamilyCount || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            const family = parseInt(val) || 0;
                                                            const hired = parseInt(formData.helperHiredCount || "0") || 0;
                                                            setFormData({
                                                                ...formData,
                                                                helperFamilyCount: val,
                                                                helperTotalCount: (family + hired).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-11 pr-10 text-right font-bold bg-white border-gray-200"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/20 border border-blue-50 rounded-xl gap-4">
                                            <span className="text-sm text-gray-600 font-medium">มีพนักงานว่าจ้าง กี่คน</span>
                                            <div className="relative w-full md:w-32">
                                                <Input
                                                    type="text"
                                                    placeholder="0"
                                                    value={formData.helperHiredCount || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            const hired = parseInt(val) || 0;
                                                            const family = parseInt(formData.helperFamilyCount || "0") || 0;
                                                            setFormData({
                                                                ...formData,
                                                                helperHiredCount: val,
                                                                helperTotalCount: (family + hired).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-11 pr-10 text-right font-bold bg-white border-gray-200"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/40 border border-blue-100 rounded-xl gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-chaiyo-blue" />
                                                <span className="text-sm text-chaiyo-blue font-bold">คำนวนจำนวนทั้งหมด (System sum)</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 h-11 bg-white border border-blue-200 rounded-lg min-w-32 justify-end">
                                                <span className="text-lg font-bold text-chaiyo-blue">
                                                    {formData.helperTotalCount || "0"}
                                                </span>
                                                <span className="text-sm font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SECTION 3: ราคาประเมินสินทรัพย์ */}
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <Calculator className="w-5 h-5" />
                            วิธีการประเมินและราคาประเมิน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Sub-section: Behavioral Appraisal Question */}
                            <div className="pb-2 border-b border-gray-100 mb-4">
                                <h3 className="text-sm font-bold text-gray-700">ข้อมูลการคาดการณ์ราคา</h3>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                <span className="text-sm text-gray-700 font-bold">
                                    {formData.collateralType === 'land' ? 'หากมีคนมาติดต่อขอซื้อหลักประกัน ท่านจะขายในราคาเท่าไร' : 'ถ้ามีคนมาติดต่อขอซื้อหลักประกัน ท่านจะขายในราคาเท่าไร'}
                                </span>
                                <div className="relative w-full md:w-64">
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.estimatedSalePrice ? Number(formData.estimatedSalePrice).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/,/g, '');
                                            if (/^\d*$/.test(val) || val === '') {
                                                setFormData({ ...formData, estimatedSalePrice: val });
                                            }
                                        }}
                                        className="h-12 pr-12 text-right font-bold text-chaiyo-blue border-chaiyo-blue/20 bg-white focus:border-chaiyo-blue focus:ring-chaiyo-blue/10 rounded-xl"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">บาท</span>
                                </div>
                            </div>

                            {/* Sub-section: Method and Valuation */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="pb-2 border-b border-gray-100 mb-4">
                                    <h3 className="text-sm font-bold text-gray-700">รายละเอียดราคาประเมิน</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วิธีประเมิน <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.appraisalMethod || "เรทบุ๊ค (Redbook)"}
                                            onValueChange={(val) => setFormData({ ...formData, appraisalMethod: val })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:ring-chaiyo-blue/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.collateralType === 'land' ? (
                                                    APPRAISAL_METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)
                                                ) : (
                                                    ["เรทบุ๊ค (Redbook)", "ประเมินโดยเจ้าหน้าที่", "ราคาประเมินกลาง"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ประเมิน <span className="text-red-500">*</span></Label>
                                        <DatePickerBE
                                            value={formData.appraisalDate}
                                            onChange={(val) => setFormData({ ...formData, appraisalDate: val })}
                                            inputClassName="h-10 border-gray-200"
                                        />
                                    </div>
                                    {formData.collateralType === 'land' && (
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ชื่อบริษัทประเมิน <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.appraisalCompany || ""}
                                                onValueChange={(val) => setFormData({ ...formData, appraisalCompany: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกบริษัทประเมิน" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {APPRAISAL_COMPANIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    {formData.collateralType === 'land' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินที่ดิน</Label>
                                                <div className="text-lg font-bold text-chaiyo-blue">
                                                    {formData.totalLandAppraisal ? Number(formData.totalLandAppraisal).toLocaleString() : "0"} <span className="text-xs text-muted-foreground ml-1">บาท</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินสิ่งปลูกสร้าง (สุทธิ)</Label>
                                                <div className="text-lg font-bold text-chaiyo-blue">
                                                    {formData.totalBuildingAfterDepreciation ? Number(formData.totalBuildingAfterDepreciation).toLocaleString() : "0"} <span className="text-xs text-muted-foreground ml-1">บาท</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl md:col-span-2">
                                                <Label className="text-base font-bold text-emerald-800">ราคาประเมินรวมทั้งสิ้น</Label>
                                                <div className="text-2xl font-bold text-emerald-600">
                                                    {formData.grandTotalAppraisal ? Number(formData.grandTotalAppraisal).toLocaleString() : "0"} <span className="text-sm text-emerald-800/60 ml-1">บาท</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl gap-4">
                                                <Label className="text-base font-bold text-gray-700">ราคาประเมิน/เรทบุ๊ค</Label>
                                                <div className="relative w-full md:w-64">
                                                    <Input
                                                        type="text"
                                                        placeholder="0"
                                                        value={formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : '0'}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/,/g, '');
                                                            if (/^\d*$/.test(val) || val === '') {
                                                                setFormData({ ...formData, appraisalPrice: val });
                                                            }
                                                        }}
                                                        className="h-12 pr-12 text-right font-bold text-chaiyo-blue border-chaiyo-blue/20 bg-white focus:border-chaiyo-blue focus:ring-chaiyo-blue/10 rounded-xl"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">บาท</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-6 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
                                                <Label className="text-lg font-bold text-emerald-800">ยอดจัดที่แนะนำ</Label>
                                                <div className="text-3xl font-bold text-emerald-600">
                                                    {(Number(formData.appraisalPrice || 0) * 0.9).toLocaleString()} <span className="text-sm text-emerald-800/60 ml-1">บาท</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Lightbox */}
            {
                lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md">
                            <X className="w-8 h-8" />
                        </button>

                        <img
                            src={uploadedDocs[lightboxIndex as number]}
                            className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="mt-8 flex gap-3 px-4 py-3 bg-white/5 rounded-2xl backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                            {uploadedDocs.map((doc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                                        idx === lightboxIndex ? "border-white scale-110" : "border-transparent opacity-40 hover:opacity-100"
                                    )}
                                >
                                    <img src={doc} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
