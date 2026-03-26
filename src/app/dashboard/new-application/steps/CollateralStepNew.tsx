// Merged Collateral Step - Replaced with Pre-question style UI
"use client";

import { useState, useEffect, useRef } from "react";
import {
    Car, Bike, Truck, Tractor, Map, Sparkles, Upload, FileText,
    Loader2, Camera, Book, Trash2, X, Plus,
    ChevronLeft, ChevronRight, ChevronDown, Eye, UserCheck, Calculator, ShieldCheck,
    CheckCircle2, AlertTriangle, FilePlus, Info, Check, ImagePlus
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
import dynamic from "next/dynamic";
import { MapPin, ExternalLink, RefreshCcw, Navigation } from "lucide-react";

const MapContents = dynamic(() => import('@/components/application/MapContents').then(mod => mod.MapContents || mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
});

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
        label: "รถเก่าเพื่อการเกษตร",
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
        { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่/รถสองแถว/รถรับส่งผู้โดยสาร/รถอาสามูลนิธิ' },
        { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
        { id: 'car_q6', text: 'เป็นรถที่ตัดแต่งคัสซี / ตัดเว้าคัสซี' },
        { id: 'car_q7', text: 'รถที่เปลี่ยนเครื่องยนต์ กรณีเปลี่ยนเครื่องยนต์ใช้เครื่องยนต์รุ่นเดียวกัน / รถติดก๊าซ LPG / NGV โดยการติดตั้งเอง รวมถึงรถที่เคยมีประวัติติดตั้งก๊าซ (ยกเว้น การติดตั้งมาตรฐานจากโรงงานผู้ผลิตรถยนต์ของยี่ห้อนั้นๆ)' },
        { id: 'car_q9', text: 'ดัดแปลงสภาพภายใน เจาะคอนโซล เจาะแผงประตู เปลี่ยนเบาะใหม่ที่แตกต่างจากมาตรฐาน' },
        { id: 'car_q10', text: 'สีเสื่อมสภาพ เป็นสนิม รอยบุบ ชน เปลี่ยนสีใหม่(ไม่ใช่สีเดิม)' },
        { id: 'car_q11', text: 'รถดัดแปลงสภาพช่วงล่าง รถเสริมแหนบ ต่อเติมเสริมคอกกระบะ (เกินตัวรถ) ต่อเติมตู้ทึบจากกระบะ' },
        { id: 'car_q12', text: 'เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่' },
    ],
    moto: [
        { id: 'moto_q1', text: 'เป็นรถจากเต้นท์' },
        { id: 'moto_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
        { id: 'moto_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        { id: 'moto_q4', text: 'เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่' },
    ],
    truck: [
        { id: 'truck_q1', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        { id: 'truck_q2', text: 'เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่' },
    ],
    agri: [
        { id: 'agri_q1', text: 'เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่' },
    ],
    land: [
        { id: 'land_q1', text: 'เป็นที่ดินตาบอด / ภาระจำยอมของบุคคลอื่น / มีรั้วปิดทางเข้าออก / ที่ดินติดคลอง / ติดลำธารที่ไม่ติดถนนสาธารณะ / ที่ดินสาธารณะประโยชน์ที่รถยนต์ไม่สามารถเข้าออกได้' },
        { id: 'land_q2', text: 'เป็นที่ดินติดโรงเรียน / วัด / ศาลเจ้า / สถานที่ศักดิ์อื่น ๆ / สุสาน / ป่าช้า / บ่อขยะ / ติดเขตการรถไฟ' },
        { id: 'land_q3', text: 'ที่ดินรกร้างไม่ได้ทำประโยชน์ / เป็นที่ดินเชิงเขาและอยู่ในเขตป่าสงวน / ป่าไม้แห่งชาติ / มีบ่อน้ำในที่ดินเกิน 40%' },
        { id: 'land_q4', text: 'เป็นที่ดินที่มีสัญญาเช่าระยะยาว เช่น ให้เช่าตั้งสัญญาณโทรศัพท์ / มินิมาร์ท' },
    ],
};

const DEED_TYPES = [
    { value: "น.ส. 4", label: "น.ส. 4" },
    { value: "น.ส. 3 ก.", label: "น.ส. 3 ก." },
    { value: "อ.ช. 2", label: "อ.ช. 2" },
    { value: "โฉนดตราจอง", label: "โฉนดตราจอง" },
    { value: "ตราจองที่ว่าได้ทำประโยชน์แล้ว", label: "ตราจองที่ว่าได้ทำประโยชน์แล้ว" },
];

const COLLATERAL_PHOTO_GUIDES: Record<string, Array<{ id: string; title: string; icon: any; description: string; demoUrl: string }>> = {
    car: [
        { id: "front_plate_engine", title: "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์", icon: Camera, description: "ถ่ายหน้ารถให้เห็นป้ายทะเบียน เปิดกระโปงหน้า และเครื่องยนต์ชัดเจน", demoUrl: "/images/guidelines/car_front_engine_demo.png" },
        { id: "back_plate_selfie", title: "รูปหลังรถ เห็นป้ายทะเบียน / พนักงานเซลฟี่", icon: Camera, description: "ถ่ายหลังรถให้เห็นป้ายทะเบียน พร้อมพนักงานเซลฟี่หรือเจ้าของรถ", demoUrl: "/images/guidelines/car_back_selfie_demo.png" },
        { id: "front_left_45", title: "รูปหน้ารถ - เฉียงซ้าย 45 องศา", icon: Camera, description: "ถ่ายรถจากมุมเฉียงหน้า-ซ้าย 45 องศา เห็นสภาพประตู กระบะ และตัวรถ", demoUrl: "/images/guidelines/car_front_left_45_demo.png" },
        { id: "front_right_45", title: "รูปหน้ารถ - เฉียงขวา 45 องศา", icon: Camera, description: "ถ่ายรถจากมุมเฉียงหน้า-ขวา 45 องศา เห็นสภาพประตู กระบะ และตัวรถ", demoUrl: "/images/guidelines/car_front_right_45_demo.png" },
        { id: "back_left_45", title: "รูปหลังรถ - เฉียงซ้าย 45 องศา", icon: Camera, description: "ถ่ายรถจากมุมเฉียงหลัง-ซ้าย 45 องศา เห็นสภาพประตู กระบะ และตัวรถ", demoUrl: "/images/guidelines/car_back_left_45_demo.png" },
        { id: "back_right_45", title: "รูปหลังรถ - เฉียงขวา 45 องศา", icon: Camera, description: "ถ่ายรถจากมุมเฉียงหลัง-ขวา 45 องศา เห็นสภาพประตู กระบะ และตัวรถ", demoUrl: "/images/guidelines/car_back_right_45_demo.png" },
        { id: "interior_console_gear", title: "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ", icon: Camera, description: "ถ่ายภายในรถให้เห็นคอนโซล เกียร์ สถานะเบาะและภาพโดยรวมภายใน", demoUrl: "/images/guidelines/car_interior_console_gear_demo.png" },
        { id: "vin_chassis", title: "รูปเลขตัวถัง / คัสซี่", icon: Camera, description: "ถ่ายเลขตัวถัง (VIN Number) บริเวณประตูคนขับหรือพื้นรถให้ชัดเจน", demoUrl: "/images/guidelines/car_vin_chassis_demo.png" },
    ],
    moto: [
        { id: "front_plate_engine", title: "รูปหน้ารถจักรยานยนต์ เห็นป้ายทะเบียน", icon: Camera, description: "ถ่ายหน้ารถให้เห็นป้ายทะเบียนและหน้ารถชัดเจน เปิดกระโปงหน้าเห็นเครื่องยนต์", demoUrl: "/images/guidelines/moto_front_demo.png" },
        { id: "back_plate_selfie", title: "รูปหลังรถจักรยานยนต์ เห็นป้ายทะเบียน / พนักงานเซลฟี่", icon: Camera, description: "ถ่ายหลังรถให้เห็นป้ายทะเบียน พร้อมพนักงานเซลฟี่หรือเจ้าของรถ", demoUrl: "/images/guidelines/moto_back_selfie_demo.png" },
        { id: "left_side_45", title: "รูปด้านซ้าย - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงซ้าย 45 องศา เห็นสภาพรถโดยรวม", demoUrl: "/images/guidelines/moto_left_45_demo.png" },
        { id: "right_side_45", title: "รูปด้านขวา - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงขวา 45 องศา เห็นสภาพรถโดยรวม", demoUrl: "/images/guidelines/moto_right_45_demo.png" },
        { id: "odometer", title: "รูปมาตรวัดระยะ / แดชบอร์ด", icon: Camera, description: "ถ่ายมาตรวัดระยะทาง (Odometer) ให้ชัดเจน", demoUrl: "/images/guidelines/moto_odometer_demo.png" },
        { id: "vin_chassis", title: "รูปเลขตัวถัง / หมายเลขเครื่องยนต์", icon: Camera, description: "ถ่ายเลขตัวถังหรือเลขเครื่องยนต์ให้ชัดเจน", demoUrl: "/images/guidelines/moto_vin_demo.png" },
    ],
    truck: [
        { id: "front_plate_engine", title: "รูปหน้ารถบรรทุก เห็นป้ายทะเบียน / เปิดกระโปงหน้า", icon: Camera, description: "ถ่ายหน้ารถให้เห็นป้ายทะเบียน เปิดกระโปงหน้าเห็นเครื่องยนต์", demoUrl: "/images/guidelines/truck_front_demo.png" },
        { id: "back_plate_selfie", title: "รูปหลังรถ เห็นป้ายทะเบียน / พนักงานเซลฟี่", icon: Camera, description: "ถ่ายหลังรถให้เห็นป้ายทะเบียน พร้อมพนักงานเซลฟี่", demoUrl: "/images/guidelines/truck_back_selfie_demo.png" },
        { id: "left_side_45", title: "รูปด้านซ้าย - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงซ้าย 45 องศา เห็นสภาพรถโดยรวม", demoUrl: "/images/guidelines/truck_left_45_demo.png" },
        { id: "right_side_45", title: "รูปด้านขวา - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงขวา 45 องศา เห็นสภาพรถโดยรวม", demoUrl: "/images/guidelines/truck_right_45_demo.png" },
        { id: "interior_cabin", title: "รูปห้องโดยสาร / คณะผู้บริหาร", icon: Camera, description: "ถ่ายภายในห้องโดยสารและแดชบอร์ด", demoUrl: "/images/guidelines/truck_interior_demo.png" },
        { id: "odometer", title: "รูปมาตรวัดระยะ", icon: Camera, description: "ถ่ายมาตรวัดระยะทางให้ชัดเจน", demoUrl: "/images/guidelines/truck_odometer_demo.png" },
        { id: "vin_chassis", title: "รูปเลขตัวถัง / คัสซี่", icon: Camera, description: "ถ่ายเลขตัวถังให้ชัดเจน", demoUrl: "/images/guidelines/truck_vin_demo.png" },
    ],
    agri: [
        { id: "front_view", title: "รูปหน้าของเครื่องจักร", icon: Camera, description: "ถ่ายหน้าเครื่องจักรเห็นโครงสร้างหลักชัดเจน", demoUrl: "/images/guidelines/agri_front_demo.png" },
        { id: "back_view", title: "รูปหลังของเครื่องจักร", icon: Camera, description: "ถ่ายหลังเครื่องจักรเห็นสภาพทั่วไปชัดเจน", demoUrl: "/images/guidelines/agri_back_demo.png" },
        { id: "left_side_45", title: "รูปด้านซ้าย - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงซ้าย 45 องศา เห็นสภาพเครื่องจักร", demoUrl: "/images/guidelines/agri_left_45_demo.png" },
        { id: "right_side_45", title: "รูปด้านขวา - เฉียง 45 องศา", icon: Camera, description: "ถ่ายจากมุมเฉียงขวา 45 องศา เห็นสภาพเครื่องจักร", demoUrl: "/images/guidelines/agri_right_45_demo.png" },
        { id: "engine_motor", title: "รูปเครื่องยนต์ / มอเตอร์", icon: Camera, description: "ถ่ายเครื่องยนต์หรือมอเตอร์ให้ชัดเจน", demoUrl: "/images/guidelines/agri_engine_demo.png" },
        { id: "serial_badge", title: "รูปหมายเลขประจำตัว / ป้ายเครื่องหมาย", icon: Camera, description: "ถ่ายหมายเลขประจำตัวหรือป้ายเครื่องหมายให้ชัดเจน", demoUrl: "/images/guidelines/agri_serial_demo.png" },
    ],
    land: [
        { id: "overall_view", title: "รูปมุมกว้างที่ดิน", icon: Camera, description: "ถ่ายภาพรวมของที่ดิน เห็นพื้นที่ทั้งหมด และบริเวณข้างเคียง", demoUrl: "/images/guidelines/land_overall_demo.png" },
        { id: "boundary_markers", title: "รูปเขตแดนที่ดิน", icon: Camera, description: "ถ่ายเขตแดน เส้นกั้น หรือรั้วของที่ดิน เห็นมุมต่างๆ ชัดเจน", demoUrl: "/images/guidelines/land_boundary_demo.png" },
        { id: "deed_document", title: "รูปโฉนดที่ดิน", icon: Camera, description: "ถ่ายโฉนดที่ดิน ให้เห็นเลขที่ เนื้อที่ และหมายเหตุสำคัญชัดเจน", demoUrl: "/images/guidelines/land_deed_demo.png" },
        { id: "address_sign", title: "รูปเลขที่ตั้งที่ดิน", icon: Camera, description: "ถ่ายเลขที่ตั้งที่ดิน หรือป้ายบอกตำแหน่งให้ชัดเจน", demoUrl: "/images/guidelines/land_address_demo.png" },
        { id: "surroundings", title: "รูปบริเวณโดยรอบ", icon: Camera, description: "ถ่ายบริเวณข้างเคียง สถานที่ใกล้เคียง หรือจุดสังเกตุหลัก", demoUrl: "/images/guidelines/land_surroundings_demo.png" },
    ],
};

const APPRAISAL_METHODS = [
    { value: "หนังสือรับรองจากสำนักงานที่ดิน", label: "หนังสือรับรองจากสำนักงานที่ดิน" },
    { value: "ราคาประเมินจากกรมธนารักษ์", label: "ราคาประเมินจากกรมธนารักษ์" },
    { value: "ใบประเมินราคาจากบริษัทภายนอก", label: "ใบประเมินราคาจากบริษัทภายนอก" }
];

// Generate unique IDs that work in all environments
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const createDefaultBlock = () => ({ id: generateId(), width: "", length: "", area: "", zoneDetails: "" });
const createDefaultFloor = () => ({ id: generateId(), blocks: [createDefaultBlock()], totalArea: "" });
const createDefaultOwner = () => ({ id: generateId(), isBorrower: false, name: "", lastName: "", relationship: "" });
const createDefaultBuilding = () => ({
    id: generateId(),
    appraisalPrice: "",
    floors: [createDefaultFloor()],
    totalBuildingArea: "",
    priceBeforeDepreciation: "",
    depreciation: "",
    priceAfterDepreciation: "",
    totalIncludingUnits: "",
    age: "",
    hasRenovation: false,
    renovationYear: "",
    // Cost/Market Approach fields
    hasCostApproach: false,
    costBeforeDepreciation: "",
    costDepreciation: "",
    costAfterDepreciation: "",
    // Market Approach fields
    marketBeforeDepreciation: "",
    marketDepreciation: "",
    marketAfterDepreciation: ""
});
const createDefaultAppraisalMethod = (method: string) => ({
    method,
    companyName: "",
    appraisalDate: "",
    landPricePerWah: "",
    landAreaWah: "",
    totalLandAppraisal: "",
    totalBuildingArea: "",
    buildings: [],
    // Cost Approach fields for external appraisal
    hasCostApproachLand: false,
    costLandPricePerWah: "",
    costLandAreaWah: "",
    costTotalLandAppraisal: "",
    hasCostApproachBuilding: false,
    costBuildingBeforeDepreciation: "",
    costBuildingDepreciation: "",
    costBuildingAfterDepreciation: ""
});

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

const SUBDIVISIONS = [
    { value: "หมู่บ้านสวนสยาม", label: "หมู่บ้านสวนสยาม" },
    { value: "หมู่บ้านนวมินทร์", label: "หมู่บ้านนวมินทร์" },
    { value: "หมู่บ้านวิลเลจ", label: "หมู่บ้านวิลเลจ" },
    { value: "หมู่บ้านศรีสมุทร", label: "หมู่บ้านศรีสมุทร" },
    { value: "หมู่บ้านปรมวุฒิ", label: "หมู่บ้านปรมวุฒิ" },
    { value: "อื่นๆ", label: "อื่นๆ" }
];

const RELATION_SHIPS = [
    { value: "ตนเอง", label: "ตนเอง" },
    { value: "บิดา/มารดา", label: "บิดา/มารดา" },
    { value: "บุตร", label: "บุตร" },
    { value: "คู่สมรส", label: "คู่สมรส" },
    { value: "พี่น้อง", label: "พี่น้อง" }
];

const OWNER_RELATIONSHIPS = [
    { value: "พ่อ", label: "พ่อ" },
    { value: "แม่", label: "แม่" },
    { value: "บุตร", label: "บุตร" },
    { value: "บุตรบุญธรรม", label: "บุตรบุญธรรม" },
    { value: "คู่สมรสจดทะเบียน", label: "คู่สมรสจดทะเบียน" },
    { value: "คู่สมรสไม่จดทะเบียน", label: "คู่สมรสไม่จดทะเบียน" },
    { value: "พี่ น้อง ร่วมบิดา มารดา", label: "พี่ น้อง ร่วมบิดา มารดา" },
    { value: "ญาติ", label: "ญาติ" },
    { value: "เพื่อน", label: "เพื่อน" },
    { value: "อื่นๆ", label: "อื่นๆ" }
];

const VEHICLE_CONDITION = [
    { value: "ปรับสภาพโดยไม่ลงทะเบียน", label: "ปรับสภาพโดยไม่ลงทะเบียน" },
    { value: "มือสอง-ปรับสภาพแล้ว", label: "มือสอง-ปรับสภาพแล้ว" },
    { value: "ใช้แล้ว", label: "ใช้แล้ว" },
    { value: "ใหม่", label: "ใหม่" }
];

const FUEL_TYPES = [
    { value: "ดีเซล", label: "ดีเซล" },
    { value: "เบนซิน", label: "เบนซิน" },
    { value: "ไฟฟ้า", label: "ไฟฟ้า" },
    { value: "ไฮบริด", label: "ไฮบริด" },
    { value: "LPG", label: "LPG" }
];

const VEHICLE_COLORS = [
    { value: "แดง", label: "แดง" },
    { value: "ดำ", label: "ดำ" },
    { value: "ขาว", label: "ขาว" },
    { value: "เทา", label: "เทา" },
    { value: "เงิน", label: "เงิน" },
    { value: "น้ำเงิน", label: "น้ำเงิน" },
    { value: "เขียว", label: "เขียว" },
    { value: "เหลือง", label: "เหลือง" },
    { value: "ส้ม", label: "ส้ม" },
    { value: "ม่วง", label: "ม่วง" },
    { value: "น้ำตาล", label: "น้ำตาล" },
    { value: "ครีม", label: "ครีม" }
];

const VEHICLE_CLASSES_RY = [
    { value: "รย.1", label: "รย.1 รถจดทะเบียนนั่งส่วนบุคคลไม่เกิน 7 คน" },
    { value: "รย.2", label: "รย.2 รถจดทะเบียนนั่งส่วนบุคคลเกิน 7 คน" },
    { value: "รย.3", label: "รย.3 รถบรรทุกส่วนบุคคล" },
    { value: "รย.4", label: "รย.4 รถยนต์สามล้อส่วนบุคคล" },
    { value: "รย.5", label: "รย.5 รถรับจ้างระหว่างจังหวัด" },
    { value: "รย.6", label: "รย.6 รถรับจ้างบรรทุกคนโดยสารไม่เกิน 7 คน" },
    { value: "รย.7", label: "รย.7 รถสี่ล้อเล็กรับจ้าง" },
    { value: "รย.8", label: "รย.8 รถรับจ้างสามล้อ" },
    { value: "รย.9", label: "รย.9 รถรับจ้างสามล้อ" },
    { value: "รย.10", label: "รย.10 รถบริการทัศนาจร" },
    { value: "รย.11", label: "รย.11 รถบริการให้เช่า" },
    { value: "รย.12", label: "รย.12 รถจักรยานยนต์" },
    { value: "รย.13", label: "รย.13 รถแทรกเตอร์" },
    { value: "รย.14", label: "รย.14 รถบดถนน" },
    { value: "รย.15", label: "รย.15 รถใช้งานเกษตรกรรม" },
    { value: "รย.16", label: "รย.16 รถพ่วง" },
    { value: "รย.17", label: "รย.17 รถจักรยานยนต์สาธารณะ" },
    { value: "รย.18", label: "รย.18 รถยนต์รับจ้างผ่านระบบอิเล็กทรอนิกส์หรือแอปพลิเคชัน" }
];

const CAR_TYPES = [
    { value: "รถกระบะ", label: "รถกระบะ" },
    { value: "รถตู้", label: "รถตู้" },
    { value: "รถยนต์ส่วนบุคคล", label: "รถยนต์ส่วนบุคคล" },
    { value: "อื่นๆ", label: "อื่นๆ" }
];

const TRUCK_TYPES = [
    { value: "รถบรรทุก 10 ล้อ", label: "รถบรรทุก 10 ล้อ" },
    { value: "รถบรรทุก 4 ล้อ", label: "รถบรรทุก 4 ล้อ" },
    { value: "รถบรรทุก 6 ล้อ", label: "รถบรรทุก 6 ล้อ" },
    { value: "รถบรรทุกมากกว่า 10 ล้อ", label: "รถบรรทุกมากกว่า 10 ล้อ" },
    { value: "หางพ่วง", label: "หางพ่วง" }
];

const AGRI_TYPES = [
    { value: "ดาวน์มากกว่า 25%", label: "ดาวน์มากกว่า 25%" },
    { value: "ดาวน์มากกว่า 35%", label: "ดาวน์มากกว่า 35%" },
    { value: "รถเกษตรเก่า", label: "รถเกษตรเก่า" }
];

const AGRI_USAGE_TYPES = [
    { value: "ใช้งานเกษตรกรรม", label: "ใช้งานเกษตรกรรม" },
    { value: "ใช้งานก่อสร้าง", label: "ใช้งานก่อสร้าง" },
    { value: "ใช้งานขนส่ง", label: "ใช้งานขนส่ง" },
    { value: "ใช้งานอื่น ๆ", label: "ใช้งานอื่น ๆ" }
];

const LAND_OFFICES = [
    { value: "กรุงเทพมหานคร", label: "สำนักงานที่ดินกรุงเทพมหานคร" },
    { value: "นนทบุรี", label: "สำนักงานที่ดินนนทบุรี" },
    { value: "ปทุมธานี", label: "สำนักงานที่ดินปทุมธานี" },
    { value: "สมุทรปราการ", label: "สำนักงานที่ดินสมุทรปราการ" },
    { value: "จังหวัดอื่น ๆ", label: "จังหวัดอื่น ๆ" }
];

const LAND_USE_TYPES = [
    { value: "ที่อยู่อาศัย", label: "ที่อยู่อาศัย" },
    { value: "ที่ประกอบการ", label: "ที่ประกอบการ" },
    { value: "ที่เกษตรกรรม", label: "ที่เกษตรกรรม" },
    { value: "ที่อื่น ๆ", label: "ที่อื่น ๆ" }
];

const LAND_USE_TYPES_NS4 = [
    { value: "เพื่ออยู่อาศัย", label: "เพื่ออยู่อาศัย" },
    { value: "เพื่อการเกษตร", label: "เพื่อการเกษตร" }
];

const OWNERSHIP_TYPES = [
    { value: "กรรมสิทธิ์เดี่ยว", label: "กรรมสิทธิ์เดี่ยว" },
    { value: "กรรมสิทธิ์ร่วม", label: "กรรมสิทธิ์ร่วม" },
    { value: "อื่น ๆ", label: "อื่น ๆ" }
];

const OWNERSHIP_TYPES_NS4 = [
    { value: "สิทธิซื้อขายขาด", label: "สิทธิซื้อขายขาด" },
    { value: "สิทธิการเช่า", label: "สิทธิการเช่า" }
];

const USAGE_TYPES = [
    { value: "ส่วนบุคคล", label: "ส่วนบุคคล" },
    { value: "พาณิชย์", label: "พาณิชย์" },
    { value: "จดทะเบียน", label: "จดทะเบียน" },
    { value: "อื่น ๆ", label: "อื่น ๆ" }
];

const OFFICE_LOCATIONS = [
    { value: "สำนักงานเขต", label: "สำนักงานเขต" },
    { value: "สำนักงานจังหวัด", label: "สำนักงานจังหวัด" },
    { value: "อื่น ๆ", label: "อื่น ๆ" }
];

const getPhotoDocs = (type: string) => {
    if (type === 'land') {
        return [
            {
                label: "รูปถ่ายหน้าที่ดิน (เห็นป้ายซอย/หลักหมุด/ทางเข้า)",
                required: true,
                guideline: "ถ่ายรูปให้เห็นตัวประจำตัวประกอบของที่ดิน เช่น ป้ายซอย หลักหมุด หรือสัญลักษณ์ทางเข้า",
                example: "/images/guidelines/address_sign_demo.png"
            },
            {
                label: "รูปถ่ายสภาพที่ดิน 1",
                required: true,
                guideline: "ถ่ายรูปด้านหน้าของที่ดิน เห็นวิวทั่วไปและสภาพแวดล้อม"
            },
            {
                label: "รูปถ่ายสภาพที่ดิน 2",
                required: true,
                guideline: "ถ่ายรูปด้านข้างหรือมุมอื่นของที่ดิน"
            },
            {
                label: "รูปถ่ายสภาพที่ดิน 3",
                required: true,
                guideline: "ถ่ายรูปเชื่อมต่อหรือมุมมองจากทิศทางอื่น"
            },
            {
                label: "รูปถ่ายสภาพที่ดิน 4",
                required: true,
                guideline: "ถ่ายรูปจากมุมทั่วไปหรือวิวที่สำคัญของที่ดิน"
            },
            {
                label: "รูปถ่ายทางเข้า-ออก",
                required: true,
                guideline: "ถ่ายรูปเส้นทางการเข้าออกและความกว้างของทางเข้า"
            },
            {
                label: "รูปถ่ายบ้านเลขที่ (ถ้ามี)",
                required: false,
                guideline: "ถ่ายรูปป้ายบ้านเลขที่ให้เห็นชัดเจน"
            },
            {
                label: "รูปถ่ายสภาพสิ่งปลูกสร้าง (ถ้ามี)",
                required: false,
                guideline: "ถ่ายรูปสิ่งปลูกสร้างที่อยู่บนที่ดิน เช่น บ้าน อาคาร เป็นต้น"
            }
        ];
    }
    return [
        {
            label: "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์",
            required: true,
            guideline: "ถ่ายรูปด้านหน้าของรถให้เห็นป้ายทะเบียนชัดเจน และเปิดกระโปงหน้าเพื่อเห็นเครื่องยนต์"
        },
        {
            label: "รูปหลังรถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์",
            required: true,
            guideline: "ถ่ายรูปด้านหลังของรถให้เห็นป้ายทะเบียนชัดเจน"
        },
        {
            label: "รูปหน้ารถ - เฉียงซ้าย45องศา",
            required: true,
            guideline: "ถ่ายรูปจากมุมเฉียงด้านซ้ายประมาณ 45 องศา เพื่อเห็นลักษณะทั่วไปของรถ"
        },
        {
            label: "รูปหน้ารถ - เฉียงขวา45องศา",
            required: true,
            guideline: "ถ่ายรูปจากมุมเฉียงด้านขวาประมาณ 45 องศา"
        },
        {
            label: "รูปหลังรถ - เฉียงซ้าย45องศา",
            required: true,
            guideline: "ถ่ายรูปด้านหลังจากมุมเฉียงซ้ายประมาณ 45 องศา"
        },
        {
            label: "รูปหลังรถ - เฉียงขวา45องศา",
            required: true,
            guideline: "ถ่ายรูปด้านหลังจากมุมเฉียงขวาประมาณ 45 องศา"
        },
        {
            label: "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ",
            required: true,
            guideline: "ถ่ายรูปภายในรถให้เห็นคอนโซล พวงมาลัย เกียร์ และสภาพของห้องโดยสารทั่วไป"
        },
        {
            label: "รูปเลขตัวถัง/คัสซี",
            required: true,
            guideline: "ถ่ายรูปเลขตัวถัง (VIN) และหมายเลขคัสซี่ (Chassis) ให้เห็นชัดเจน"
        }
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
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]); // For old compatibility if needed, but we'll use below
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [photoGuideDialogOpen, setPhotoGuideDialogOpen] = useState(false);
    const [paperGuideDialogOpen, setPaperGuideDialogOpen] = useState(false);
    const [collateralQuestionsExpanded, setCollateralQuestionsExpanded] = useState(true);
    const [examplePhotoDialog, setExamplePhotoDialog] = useState<{ open: boolean; label: string; example?: string }>({ open: false, label: "" });
    const [photoInfoDialog, setPhotoInfoDialog] = useState<{ open: boolean; label: string; guideline?: string }>({ open: false, label: "" });

    // New upload states
    const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string, label: string }[]>([]);
    const [uploadedPaperDocs, setUploadedPaperDocs] = useState<{ url: string, label: string }[]>([]);
    const [collateralPhotos, setCollateralPhotos] = useState<Record<string, string[]>>({});
    const [analyzedPhotoCount, setAnalyzedPhotoCount] = useState(0);
    const [analyzedPaperCount, setAnalyzedPaperCount] = useState(0);
    const [currentYear, setCurrentYear] = useState(2024);
    const [deleteOwnerConfirm, setDeleteOwnerConfirm] = useState<{ type: 'land' | 'building'; ownerIdx: number; buildingIdx?: number; name: string } | null>(null);
    const [coordinateModalOpen, setCoordinateModalOpen] = useState(false);
    const [searchLat, setSearchLat] = useState("");
    const [searchLng, setSearchLng] = useState("");
    const [itemToDelete, setItemToDelete] = useState<{ guideId: string; photoIndex: number } | null>(null);
    const [examplePhotoDialog2, setExamplePhotoDialog2] = useState<{ open: boolean; title: string; demoUrl: string }>({ open: false, title: "", demoUrl: "" });

    // Refs
    const photoInputRef = useRef<HTMLInputElement>(null);
    const photoCameraRef = useRef<HTMLInputElement>(null);
    const paperInputRef = useRef<HTMLInputElement>(null);
    const paperCameraRef = useRef<HTMLInputElement>(null);
    const categoryPhotoInputRef = useRef<HTMLInputElement>(null);
    const categoryCameraRef = useRef<HTMLInputElement>(null);
    const [currentPhotoGuideId, setCurrentPhotoGuideId] = useState<string>("");

    // Set current year on client side to prevent hydration mismatch
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

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
                    moto_q1: 'no', moto_q2: 'no', moto_q3: 'no', moto_q4: 'no',
                    truck_q1: 'no', truck_q2: 'no',
                    agri_q1: 'no', agri_q2: '',
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
                licensePlate: formData.licensePlate || "7กล",
                province: formData.province || "กรุงเทพมหานคร",
                brand: formData.brand || "HONDA",
                model: formData.model || "CIVIC",
                year: formData.year || "2018",
                subModel: formData.subModel || "1.8 i-VTEC EL",
                cc: formData.cc || "1,799",
                horsePower: formData.horsePower || "141",
                color: formData.color || "ขาว (Platinum White Pearl)",
                vehicleConditionInspection: formData.vehicleConditionInspection || "",
                ryNumber: formData.ryNumber || "รย.1",
                appearance: formData.appearance || "เก๋งสองตอน",
                usageType: formData.usageType || "ส่วนบุคคล",
                fuelType: formData.fuelType || "เบนซิน",
                engineNumber: formData.engineNumber || "R18Z1-7842516",
                chassisNumber: formData.chassisNumber || "MRHFC16501P000001",
                location: formData.location || "กรุงเทพมหานคร",
                selectedAppraisalMethods: formData.selectedAppraisalMethods || ["หนังสือรับรองจากสำนักงานที่ดิน"],
                appraisalMethodsData: formData.appraisalMethodsData || {
                    "หนังสือรับรองจากสำนักงานที่ดิน": createDefaultAppraisalMethod("หนังสือรับรองจากสำนักงานที่ดิน")
                },
                grandTotalAppraisal: formData.grandTotalAppraisal || "",
                landSeizedStatus: formData.landSeizedStatus || "ปกติ",
                landReplacementStatus: formData.landReplacementStatus || "ปกติ",
                villageName: formData.villageName || "",
                landOwners: formData.landOwners && formData.landOwners.length > 0 ? formData.landOwners : [createDefaultOwner()]
            });
        }
    }, []);
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const availableDocs = getPhotoDocs(formData.collateralType);
        const newPhotos: { url: string, label: string }[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = URL.createObjectURL(files[i]);
            const defaultLabel = availableDocs[uploadedPhotos.length + i]?.label || "อื่นๆ";
            newPhotos.push({ url, label: defaultLabel });
        }

        const currentPhotoCount = uploadedPhotos.length;
        setUploadedPhotos((prev: { url: string, label: string }[]) => [...prev, ...newPhotos]);
        setIsAnalyzing(true);
        toast.info("กำลังวิเคราะห์รูปถ่ายหลักประกัน...", { duration: 1500 });

        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalyzedPhotoCount(prev => prev + newPhotos.length);
            toast.success("วิเคราะห์รูปถ่ายหลักประกันสำเร็จ!", {
                icon: <Sparkles className="w-4 h-4 text-purple-500" />
            });
            // If it's the first upload, also trigger the global photo analysis
            if (currentPhotoCount === 0) {
                handleAnalyzePhotos();
            }
        }, 1500);

        e.target.value = '';
    };

    const handlePaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const availableDocs = getPaperDocs(formData.collateralType, formData);
        const newDocs: { url: string, label: string }[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = URL.createObjectURL(files[i]);
            const defaultLabel = availableDocs[uploadedPaperDocs.length + i]?.label || "อื่นๆ";
            newDocs.push({ url, label: defaultLabel });
        }

        setUploadedPaperDocs((prev: { url: string, label: string }[]) => [...prev, ...newDocs]);
        setIsAnalyzing(true);
        toast.info("กำลังตรวจสอบเอกสารหลักประกัน...", { duration: 1500 });

        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalyzedPaperCount(prev => prev + newDocs.length);
            toast.success("ตรวจสอบเอกสารหลักประกันสำเร็จ!");
        }, 1500);

        e.target.value = '';
    };

    const handleRemovePhoto = (idx: number) => {
        const photo = uploadedPhotos[idx] as any;
        const urlToRemove = typeof photo === 'string' ? photo : photo?.url;
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
        setUploadedPhotos((prev: { url: string, label: string }[]) => prev.filter((_, i) => i !== idx));
        setAnalyzedPhotoCount(prev => Math.max(0, prev - 1));
    };

    const handleRemovePaper = (idx: number) => {
        const doc = uploadedPaperDocs[idx] as any;
        const urlToRemove = typeof doc === 'string' ? doc : doc?.url;
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
        setUploadedPaperDocs((prev: { url: string, label: string }[]) => prev.filter((_, i) => i !== idx));
        setAnalyzedPaperCount(prev => Math.max(0, prev - 1));
    };

    const handleAnalyzePhotos = () => {
        setIsAnalyzing(true);
        setAiDetectedFields([]);
        toast.info("กำลังวิเคราะห์ข้อมูลจากรูปถ่าย...", { duration: 1500 });

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

    const handleTriggerCategoryPhotoUpload = (guideId: string) => {
        setCurrentPhotoGuideId(guideId);
        categoryCameraRef.current?.click();
    };

    const handleCategoryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = URL.createObjectURL(files[i]);
            newUrls.push(url);
        }

        setCollateralPhotos(prev => ({
            ...prev,
            [currentPhotoGuideId]: [...(prev[currentPhotoGuideId] || []), ...newUrls]
        }));

        toast.success(`เพิ่มรูปสำเร็จ (${newUrls.length} รูป)`);
        e.target.value = '';
    };

    const handleRemoveCategoryPhoto = (guideId: string, photoIndex: number) => {
        const photo = collateralPhotos[guideId]?.[photoIndex];
        if (photo) URL.revokeObjectURL(photo);
        setCollateralPhotos(prev => ({
            ...prev,
            [guideId]: (prev[guideId] || []).filter((_, i) => i !== photoIndex)
        }));
    };

    const handleAnalyzeDocuments = () => {
        setIsAnalyzing(true);
        setAiDetectedFields([]);
        toast.info("กำลังตรวจสอบหลักประกันและเอกสาร...", { duration: 1500 });

        setTimeout(() => {
            let mockData: any = { appraisalPrice: 450000 };
            let fields = ['appraisalPrice', 'brand', 'model', 'year'];

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2562', subModel: 'HEV Premium', taxDueDate: '2025-06-15', previousOwnerDate: '2017-01-20', licensePlate: 'กท-1234' };
                fields.push('subModel', 'taxDueDate', 'previousOwnerDate', 'licensePlate');
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2564', appraisalPrice: 35000, taxDueDate: '2025-03-10', previousOwnerDate: '2019-05-05', licensePlate: 'กม-5678' };
                fields.push('licensePlate');
            } else if (formData.collateralType === 'truck') {
                mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2563', appraisalPrice: 500000, taxDueDate: '2024-11-22', previousOwnerDate: '2015-08-12', licensePlate: 'กบ-9999' };
                fields.push('licensePlate');
            } else if (formData.collateralType === 'agri') {
                mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2565', appraisalPrice: 600000, taxDueDate: '2026-01-01', previousOwnerDate: '2020-12-15' };
            }

            setFormData((prev: any) => ({ ...prev, ...mockData }));
            setAnalyzedPhotoCount(getPhotoDocs(formData.collateralType).length);
            setAnalyzedPaperCount(getPaperDocs(formData.collateralType, formData).length);
            setAiDetectedFields(fields);
            setIsAnalyzing(false);
            toast.success("ตรวจสอบสำเร็จ! ระบบได้อัปเดทข้อมูลเบื้องต้นให้แล้ว", {
                icon: <Sparkles className="w-4 h-4 text-emerald-500" />
            });
        }, 2000);
    };

    return (
        <div className="w-full animate-in slide-in-from-right-8 duration-300 pb-20">
            <div className="space-y-6">
                {/* SECTION: อัปโหลดเอกสารหลักประกัน */}
                <Card className="border-border-strong overflow-hidden mb-6">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <Upload className="w-5 h-5" />
                            อัปโหลดเอกสารหลักประกัน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border-subtle">
                            {/* COLLATERAL TYPE SELECT */}
                            <div className="p-6 bg-gray-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ประเภทหลักประกัน <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.collateralType || "car"}
                                            onValueChange={(val) => setFormData({ ...formData, collateralType: val })}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl bg-white border-chaiyo-blue font-bold text-chaiyo-blue shadow-sm">
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
                                    {formData.collateralType === 'land' && (
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ประเภทโฉนดที่ดิน <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.landDeedType || "น.ส. 4"}
                                                onValueChange={(val) => setFormData({ ...formData, landDeedType: val })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
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
                                    )}
                                </div>
                            </div>

                            {/* PHOTO UPLOAD SECTION - CATEGORIZED GRID */}
                            <div className="p-6 space-y-4">
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                        <ImagePlus className="w-5 h-5 text-chaiyo-blue" />
                                        อัปโหลดรูปหลักประกัน
                                    </h4>
                                </div>

                                {/* Categorized Grid Layout */}
                                <div className="grid grid-cols-4 gap-x-6 gap-y-8">
                                    {(COLLATERAL_PHOTO_GUIDES[formData.collateralType] || []).map((guide) => {
                                        const photos = collateralPhotos[guide.id] || [];
                                        const hasPhotos = photos.length > 0;

                                        return (
                                            <div key={guide.id} className="space-y-3">
                                                {/* 1. Label and Info Icon */}
                                                <div className="flex items-center justify-between group">
                                                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 cursor-default truncate">
                                                        {guide.title}
                                                        {hasPhotos && (
                                                            <span className="ml-1.5 text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                                {photos.length}
                                                            </span>
                                                        )}
                                                    </Label>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-chaiyo-blue hover:bg-blue-50 transition-all opacity-100 lg:opacity-60 group-hover:opacity-100 shrink-0"
                                                                title="ดูตัวอย่างภาพ"
                                                            >
                                                                <Info className="w-4 h-4" />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>{guide.title}</DialogTitle>
                                                                <DialogDescription>{guide.description}</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                                                <img src={guide.demoUrl} alt={guide.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>

                                                {/* 2. Photo Grid */}
                                                {hasPhotos ? (
                                                    <div className="space-y-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {photos.map((photoUrl: string, pIdx: number) => (
                                                                <div key={pIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-emerald-100 bg-emerald-50/10 shadow-sm group">
                                                                    <img src={photoUrl} alt={`${guide.title} ${pIdx + 1}`} className="w-full h-full object-cover" />
                                                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow border border-white z-20">
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 z-30 backdrop-blur-[1px]">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setLightboxIndex(pIdx);
                                                                                setUploadedDocs(photos);
                                                                            }}
                                                                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-all"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveCategoryPhoto(guide.id, pIdx)}
                                                                            className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 flex items-center justify-center text-red-100 transition-all"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {/* Add more photos button */}
                                                            <div
                                                                className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all flex flex-col items-center justify-center cursor-pointer"
                                                                onClick={() => handleTriggerCategoryPhotoUpload(guide.id)}
                                                            >
                                                                <Camera className="w-6 h-6 text-gray-400" />
                                                                <span className="text-[10px] text-muted-foreground mt-1">ถ่ายเพิ่มเติม</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all flex flex-col items-center justify-center cursor-pointer"
                                                        onClick={() => handleTriggerCategoryPhotoUpload(guide.id)}
                                                    >
                                                        <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 border border-gray-200">
                                                                <guide.icon className="w-6 h-6" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-bold leading-tight text-gray-600">แตะเพื่อเปิดกล้อง</p>
                                                                <p className="text-[10px] text-muted-foreground">ถ่ายรูปด้วยกล้องตรงนี้</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* PAPER DOCS UPLOAD SECTION - 2 COLUMN LAYOUT */}
                            <div className="p-6 space-y-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Book className="w-4 h-4 text-emerald-600" />
                                        รายการเอกสารที่ต้องใช้
                                        <button
                                            type="button"
                                            onClick={() => setPaperGuideDialogOpen(true)}
                                            className="text-gray-400 hover:text-emerald-600 transition-colors"
                                        >
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </h4>
                                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full hidden">
                                        {analyzedPaperCount} / {getPaperDocs(formData.collateralType, formData).length} ชุด
                                    </span>
                                </div>

                                {/* 2-Column Layout: 60% Left (Documents) + 40% Right (Checklist) */}
                                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
                                    {/* LEFT: Document Upload Area */}
                                    <div className="space-y-3">
                                        {/* Upload Buttons */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                ref={paperInputRef}
                                                className="hidden"
                                                accept="image/*,application/pdf"
                                                multiple
                                                onChange={handlePaperUpload}
                                            />
                                            <input
                                                type="file"
                                                ref={paperCameraRef}
                                                className="hidden"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handlePaperUpload}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => paperInputRef.current?.click()}
                                                disabled={isAnalyzing}
                                                size="sm"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                อัปโหลดเอกสาร
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => paperCameraRef.current?.click()}
                                                disabled={isAnalyzing}
                                                size="sm"
                                            >
                                                <Camera className="w-4 h-4 mr-2" />
                                                เปิดกล้อง
                                            </Button>
                                        </div>

                                        {/* Document Grid - Larger Previews */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-200 min-h-[280px]">
                                            {uploadedPaperDocs.length === 0 ? (
                                                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-60 py-8">
                                                    <FilePlus className="w-10 h-10" />
                                                    <p className="text-sm font-medium italic">ยังไม่มีการอัปโหลดเอกสาร</p>
                                                </div>
                                            ) : (
                                                uploadedPaperDocs.map((docObj: any, idx) => {
                                                    const url = typeof docObj === 'string' ? docObj : docObj.url;
                                                    const label = typeof docObj === 'string' ? "อื่นๆ" : (docObj.label || "อื่นๆ");

                                                    return (
                                                        <div key={idx} className="flex flex-col gap-2 relative bg-white p-2 border border-border-strong rounded-lg shadow-sm group">
                                                            <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden bg-gray-50 border border-border-subtle">
                                                                {url.endsWith('.pdf') ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 gap-1.5 p-2">
                                                                        <FileText className="w-8 h-8" />
                                                                        <span className="text-[8px] font-bold truncate w-full text-center">PDF</span>
                                                                    </div>
                                                                ) : (
                                                                    <img src={url} alt={`paper-${idx}`} className="w-full h-full object-cover" />
                                                                )}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => { setLightboxIndex(idx); setUploadedDocs(uploadedPaperDocs.map((p: any) => typeof p === 'string' ? p : p.url)); }}
                                                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full border border-white/30 backdrop-blur-sm text-white"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRemovePaper(idx)}
                                                                        className="p-1.5 bg-white/20 hover:bg-red-500 rounded-full border border-white/30 backdrop-blur-sm text-white"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                {idx >= analyzedPaperCount && isAnalyzing && (
                                                                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                                                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Select
                                                                value={label}
                                                                onValueChange={(val) => {
                                                                    const newDocs: any[] = [...uploadedPaperDocs];
                                                                    if (typeof newDocs[idx] === 'string') {
                                                                        newDocs[idx] = { url: newDocs[idx], label: val };
                                                                    } else {
                                                                        newDocs[idx] = { ...newDocs[idx], label: val };
                                                                    }
                                                                    setUploadedPaperDocs(newDocs);
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-9 text-[11px] bg-white border-gray-200">
                                                                    <div className="truncate text-left pr-2"><SelectValue /></div>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {getPaperDocs(formData.collateralType, formData).map((doc, dIdx) => (
                                                                        <SelectItem key={dIdx} value={doc.label} className="text-[11px]">
                                                                            {doc.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                    <SelectItem value="อื่นๆ" className="text-[11px]">อื่นๆ</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT: Required Documents Checklist - Auto-checked by AI */}
                                    <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">รายการเอกสารที่ต้องใช้</h5>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {getPaperDocs(formData.collateralType, formData).map((doc, idx) => {
                                                const isAnalyzed = idx < analyzedPaperCount;

                                                return (
                                                    <div key={idx} className={cn(
                                                        "flex items-start gap-2 p-2 rounded border transition-colors text-xs",
                                                        isAnalyzed
                                                            ? "bg-emerald-50 border-emerald-200"
                                                            : "bg-white border-gray-200"
                                                    )}>
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                                                            isAnalyzed
                                                                ? "bg-emerald-500 text-white"
                                                                : "border-2 border-gray-300"
                                                        )}>
                                                            {isAnalyzed && (
                                                                <Check className="w-3 h-3 font-bold" />
                                                            )}
                                                        </div>
                                                        <p className={cn(
                                                            "leading-tight flex-1",
                                                            isAnalyzed ? "text-emerald-700 font-medium" : "text-gray-600"
                                                        )}>
                                                            {doc.label}
                                                        </p>
                                                        {isAnalyzed && (
                                                            <span className="text-[10px] text-emerald-600 font-semibold whitespace-nowrap">ยืนยันแล้ว</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ANALYSIS BUTTON */}
                            <div className="p-6 border-t border-border-subtle bg-gray-50/30 flex justify-end">
                                <Button
                                    onClick={handleAnalyzeDocuments}
                                    disabled={isAnalyzing || (uploadedPhotos.length === 0 && uploadedPaperDocs.length === 0)}
                                    className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white font-semibold"
                                    size="lg"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            กำลังตรวจสอบ...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            ตรวจสอบหลักประกันและเอกสาร
                                        </>
                                    )}
                                </Button>
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
                        <div className="mt-2 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                {formData.collateralType === 'land' ? 'รายละเอียดโฉนดที่ดิน' : 'รายละเอียดหลักประกัน'}
                            </h3>

                            {formData.collateralType === 'land' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-3">
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
                                            <div className="flex items-center gap-2 p-2 bg-blue-50/30 rounded-lg">
                                                <Checkbox
                                                    id="landLocationNotFound"
                                                    checked={formData.landLocationNotFound === "yes" || false}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, landLocationNotFound: checked ? "yes" : "" })}
                                                    className="w-4 h-4 rounded border-gray-300 text-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white cursor-pointer"
                                                />
                                                <label htmlFor="landLocationNotFound" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                    ไม่พบที่ตั้งที่ดินตามโฉนด
                                                </label>
                                            </div>
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
                                            <Label className="text-[13px] text-muted-foreground ml-1">เลขโฉนดที่ดิน <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.landDeedNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, landDeedNumber: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        {formData.landDeedType !== "น.ส. 4" && formData.landDeedType !== "อ.ช. 2" && (
                                            <>
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
                                            </>
                                        )}
                                        {formData.landDeedType !== "อ.ช. 2" && (
                                            <>
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
                                                        placeholder="เช่น 67"
                                                        className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                    />
                                                </div>
                                                {formData.landDeedType !== "น.ส. 4" && (
                                                    <>
                                                        <div className="space-y-1">
                                                            <Label className="text-[13px] text-muted-foreground ml-1">หมายเลข <span className="text-red-500">*</span></Label>
                                                            <Input
                                                                value={formData.landMapNumber || ""}
                                                                onChange={(e) => setFormData({ ...formData, landMapNumber: e.target.value })}
                                                                placeholder="เช่น ABC"
                                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-[13px] text-muted-foreground ml-1">แผ่นที่ <span className="text-red-500">*</span></Label>
                                                            <Input
                                                                value={formData.landSheetNumber || ""}
                                                                onChange={(e) => setFormData({ ...formData, landSheetNumber: e.target.value })}
                                                                placeholder="เช่น 12"
                                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="space-y-1">
                                                    <Label className="text-[13px] text-muted-foreground ml-1">หน้าสำรวจ</Label>
                                                    <Input
                                                        value={formData.landSurveyPage || ""}
                                                        onChange={(e) => setFormData({ ...formData, landSurveyPage: e.target.value })}
                                                        placeholder="เช่น 1"
                                                        className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                    />
                                                </div>
                                                {formData.collateralType === 'land' && formData.landDeedType !== "อ.ช. 2" && (
                                                    <div className="space-y-1">
                                                        <Label className="text-[13px] text-muted-foreground ml-1">จำนวนสิ่งปลูกสร้าง</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="5"
                                                            value={formData.buildingCount || "0"}
                                                            onChange={(e) => {
                                                                const val = Math.min(5, Math.max(0, Number(e.target.value)));
                                                                setFormData({ ...formData, buildingCount: val });
                                                            }}
                                                            className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    {formData.landDeedType !== "อ.ช. 2" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
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
                                        </div>
                                    )}

                                    {formData.landDeedType === "อ.ช. 2" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่ห้องชุด (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.landUnitArea || ""}
                                                    onChange={(e) => setFormData({ ...formData, landUnitArea: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">ห้องชุดเลขที่ <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.condoUnitNumber || ""}
                                                    onChange={(e) => setFormData({ ...formData, condoUnitNumber: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">ชั้นที่ <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.condoFloor || ""}
                                                    onChange={(e) => setFormData({ ...formData, condoFloor: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">อาคารเลขที่ <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.condoBuildingNumber || ""}
                                                    onChange={(e) => setFormData({ ...formData, condoBuildingNumber: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">ชื่ออาคารชุด <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.condoBuildingName || ""}
                                                    onChange={(e) => setFormData({ ...formData, condoBuildingName: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">ทะเบียนอาคารชุดเลขที่ <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.condoRegistrationNumber || ""}
                                                    onChange={(e) => setFormData({ ...formData, condoRegistrationNumber: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">สำนักงานที่ดิน <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.landOffice || ""}
                                                onValueChange={(val) => setFormData({ ...formData, landOffice: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกสำนักงานที่ดิน" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LAND_OFFICES.map((office) => (
                                                        <SelectItem key={office.value} value={office.value}>
                                                            {office.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">การใช้ประโยชน์ของที่ดิน <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.landUseType || (formData.landDeedType === "น.ส. 4" ? "เพื่ออยู่อาศัย" : "")}
                                                onValueChange={(val) => setFormData({ ...formData, landUseType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกการใช้ประโยชน์" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(formData.landDeedType === "น.ส. 4" ? LAND_USE_TYPES_NS4 : LAND_USE_TYPES).map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ประเภทกรรมสิทธิ์ <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.ownershipType || ""}
                                                onValueChange={(val) => setFormData({ ...formData, ownershipType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกประเภทกรรมสิทธิ์" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(formData.landDeedType === "น.ส. 4" ? OWNERSHIP_TYPES_NS4 : OWNERSHIP_TYPES).map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="flex flex-col gap-4">
                                            <div className="relative group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[220px] flex flex-col">
                                                <div className="flex-1 bg-gray-100 relative shadow-inner overflow-hidden">
                                                    {formData.landLat && formData.landLng ? (
                                                        <div className="absolute inset-0 z-0 scale-100 group-hover:scale-105 transition-transform duration-500">
                                                            <MapContents
                                                                center={[parseFloat(formData.landLat), parseFloat(formData.landLng)]}
                                                                zoom={15}
                                                                position={[parseFloat(formData.landLat), parseFloat(formData.landLng)]}
                                                                onLocationSelect={() => { }}
                                                            />
                                                            <div
                                                                className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                                                                onClick={() => { }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                                                                <MapPin className="w-6 h-6 text-gray-400 group-hover:text-chaiyo-blue transition-colors" />
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-500">คลิกเพื่อระบุตำแหน่ง</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3 bg-white border-t border-gray-100 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">พิกัดสถานที่ที่ดิน</span>
                                                            <a
                                                                href="https://landsmaps.dol.go.th/"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[10px] text-chaiyo-blue hover:text-chaiyo-blue/70 font-semibold"
                                                            >
                                                                Landmap Thailand
                                                                <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSearchLat(formData.landLat || "");
                                                                    setSearchLng(formData.landLng || "");
                                                                    setCoordinateModalOpen(true);
                                                                }}
                                                                className="text-xs font-bold shadow-none"
                                                            >
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                {formData.landLat && formData.landLng ? "เปลี่ยนตำแหน่ง" : "ตั้งตำแหน่ง"}
                                                            </Button>
                                                            {formData.landLat && formData.landLng && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(`https://www.google.com/maps?q=${formData.landLat},${formData.landLng}`, '_blank')}
                                                                    className="text-xs font-bold shadow-none"
                                                                >
                                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                                    ดูบนแผนที่
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {formData.landLat && formData.landLng ? (
                                                        <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100/50 transition-colors" onClick={() => {
                                                            setSearchLat(formData.landLat || "");
                                                            setSearchLng(formData.landLng || "");
                                                            setCoordinateModalOpen(true);
                                                        }}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-chaiyo-blue rounded-md flex items-center justify-center shrink-0">
                                                                    <Navigation className="w-3.5 h-3.5 text-white" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-mono font-bold text-chaiyo-blue leading-tight">
                                                                        {parseFloat(formData.landLat).toFixed(6)}
                                                                    </span>
                                                                    <span className="text-[10px] font-mono font-bold text-chaiyo-blue leading-tight">
                                                                        {parseFloat(formData.landLng).toFixed(6)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] text-muted-foreground cursor-pointer hover:text-gray-700" onClick={() => {
                                                            setSearchLat("");
                                                            setSearchLng("");
                                                            setCoordinateModalOpen(true);
                                                        }}>ยังไม่ได้ระบุตำแหน่ง - คลิกเพื่อตั้งตำแหน่ง</p>
                                                    )}

                                                    <p className="text-[11px] text-gray-500">* กรุณาระบุพิกัดให้ตรงกับตำแหน่งสถานที่จริงเพื่อใช้ในการประเมินและตรวจสอบ</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* ROW 1: ลักษณะ */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ลักษณะ</Label>
                                            <Select
                                                value={formData.vehicleType || ""}
                                                onValueChange={(val) => setFormData({ ...formData, vehicleType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกลักษณะ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.collateralType === 'car' && CAR_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                    {formData.collateralType === 'moto' && (
                                                        <SelectItem value="รถจักรยานยนต์">
                                                            รถจักรยานยนต์
                                                        </SelectItem>
                                                    )}
                                                    {formData.collateralType === 'truck' && TRUCK_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                    {formData.collateralType === 'agri' && AGRI_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* ROW 2: ยี่ห้อรถ, รุ่นรถ, รุ่นปี ค.ศ. */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mt-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ยี่ห้อรถ <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.brand || ""}
                                                onValueChange={(val) => setFormData({ ...formData, brand: val, model: "", subModel: "" })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกยี่ห้อรถ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.collateralType === 'car' && CAR_BRANDS.map((brand) => (
                                                        <SelectItem key={brand.value} value={brand.label}>
                                                            {brand.label}
                                                        </SelectItem>
                                                    ))}
                                                    {formData.collateralType === 'moto' && MOTO_BRANDS.map((brand) => (
                                                        <SelectItem key={brand.value} value={brand.label}>
                                                            {brand.label}
                                                        </SelectItem>
                                                    ))}
                                                    {formData.collateralType === 'truck' && TRUCK_BRANDS.map((brand) => (
                                                        <SelectItem key={brand.value} value={brand.label}>
                                                            {brand.label}
                                                        </SelectItem>
                                                    ))}
                                                    {formData.collateralType === 'agri' && AGRI_BRANDS.map((brand) => (
                                                        <SelectItem key={brand.value} value={brand.label}>
                                                            {brand.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">รุ่นรถ <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.model || ""}
                                                onValueChange={(val) => setFormData({ ...formData, model: val, subModel: "" })}
                                                disabled={!formData.brand}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <SelectValue placeholder={formData.brand ? "เลือกรุ่นรถ" : "เลือกยี่ห้อรถก่อน"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.brand && MODELS_BY_BRAND[formData.brand]?.map((model) => (
                                                        <SelectItem key={model.value} value={model.label}>
                                                            {model.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">รุ่นปี ค.ศ. <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.year || ""}
                                                onValueChange={(val) => setFormData({ ...formData, year: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกปี" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEARS_AD.map((yr) => (
                                                        <SelectItem key={yr.value} value={yr.value}>
                                                            {yr.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* ROW 3: รุ่นย่อย, ซีซี */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">หมายเลขรุ่นย่อย</Label>
                                            <Select
                                                value={formData.subModel || ""}
                                                onValueChange={(val) => setFormData({ ...formData, subModel: val })}
                                                disabled={!formData.model}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <SelectValue placeholder={formData.model ? "เลือกรุ่นย่อย" : "เลือกรุ่นรถก่อน"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.model && SUB_MODELS_BY_MODEL[formData.model]?.map((subModel) => (
                                                        <SelectItem key={subModel.value} value={subModel.label}>
                                                            {subModel.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formData.vehicleType !== "หางพ่วง" && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ซีซี (CC)</Label>
                                                    <Input
                                                        value={formData.cc || ""}
                                                        onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                                                        className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium text-left focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* ROW 3B: Agricultural Vehicle Specific Fields */}
                                    {formData.collateralType === 'agri' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ซีซี (CC)</Label>
                                                <Input
                                                    value={formData.cc || ""}
                                                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium text-left focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-gray-700 ml-0.5">แรงม้า</Label>
                                                <Input
                                                    value={formData.horsePower || ""}
                                                    onChange={(e) => setFormData({ ...formData, horsePower: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium text-left focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ประเภทการใช้งาน</Label>
                                                <Select
                                                    value={formData.agriUsageType || ""}
                                                    onValueChange={(val) => setFormData({ ...formData, agriUsageType: val })}
                                                >
                                                    <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                        <SelectValue placeholder="เลือกประเภทการใช้งาน" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {AGRI_USAGE_TYPES.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEPARATOR */}
                                    <div className="border-t border-border-subtle my-8"></div>

                                    {/* ROW 4: เลขทะเบียน, จังหวัด, ปีที่จดทะเบียน */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">เลขทะเบียน <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    maxLength={4}
                                                    placeholder="กท"
                                                    value={formData.licensePlate?.split('-')[0] || ""}
                                                    onChange={(e) => {
                                                        const part2 = formData.licensePlate?.split('-')[1] || "";
                                                        setFormData({ ...formData, licensePlate: `${e.target.value}-${part2}` });
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 flex-1"
                                                />
                                                <Input
                                                    maxLength={4}
                                                    placeholder="1234"
                                                    value={formData.licensePlate?.split('-')[1] || ""}
                                                    onChange={(e) => {
                                                        const part1 = formData.licensePlate?.split('-')[0] || "";
                                                        setFormData({ ...formData, licensePlate: `${part1}-${e.target.value}` });
                                                    }}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">จังหวัด <span className="text-red-500">*</span></Label>
                                            <Combobox
                                                options={THAI_ADDRESS_DATA.map(p => ({ label: p.name, value: p.name }))}
                                                value={formData.province || ""}
                                                onValueChange={(val) => setFormData({ ...formData, province: val })}
                                                className="h-10 rounded-xl"
                                                placeholder="เลือกจังหวัด"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ปีที่จดทะเบียน <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="พ.ศ."
                                                value={formData.registrationYear || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                                    setFormData({ ...formData, registrationYear: value });
                                                }}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                    </div>

                                    {/* ROW 5: ประเภทการใช้งาน, เลข รย., ลักษณะสภาพรถ */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ประเภทการใช้งาน</Label>
                                            <Select
                                                value={formData.usageType || ""}
                                                onValueChange={(val) => setFormData({ ...formData, usageType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกประเภทการใช้งาน" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {USAGE_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">เลข รย. <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.ryNumber || ""}
                                                onValueChange={(val) => setFormData({ ...formData, ryNumber: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกเลข รย." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {VEHICLE_CLASSES_RY.map((ry) => (
                                                        <SelectItem key={ry.value} value={ry.value}>
                                                            {ry.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">ลักษณะสภาพรถ</Label>
                                            <Select
                                                value={formData.vehicleCondition || "ใช้แล้ว"}
                                                onValueChange={(val) => setFormData({ ...formData, vehicleCondition: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {VEHICLE_CONDITION.map((cond) => (
                                                        <SelectItem key={cond.value} value={cond.value}>
                                                            {cond.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* ROW 6: เชื้อเพลิง, เลขเครื่องยนต์, space */}
                                    {formData.vehicleType !== "หางพ่วง" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-gray-700 ml-0.5">เชื้อเพลิง</Label>
                                                <Select
                                                    value={formData.fuelType || ""}
                                                    onValueChange={(val) => setFormData({ ...formData, fuelType: val })}
                                                >
                                                    <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                        <SelectValue placeholder="เลือกเชื้อเพลิง" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FUEL_TYPES.map((fuel) => (
                                                            <SelectItem key={fuel.value} value={fuel.value}>
                                                                {fuel.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-gray-700 ml-0.5">เลขเครื่องยนต์</Label>
                                                <Input
                                                    value={formData.engineNumber || ""}
                                                    onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium font-mono text-[12px] focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                            {/* Space block */}
                                            <div></div>
                                        </div>
                                    )}

                                    {/* ROW 7: วันที่ครบกำหนดเสียภาษี, เลขตัวถัง, สี */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">วันที่ครบกำหนดเสียภาษี <span className="text-red-500">*</span></Label>
                                            <DatePickerBE
                                                value={formData.taxDueDate}
                                                onChange={(val) => setFormData({ ...formData, taxDueDate: val })}
                                                inputClassName={cn(
                                                    "h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 transition-all",
                                                    aiDetectedFields.includes('taxDueDate') && "border-purple-300 ring-1 ring-purple-100 bg-purple-50/30 font-bold text-purple-700"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">เลขตัวถัง</Label>
                                            <Input
                                                value={formData.chassisNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium font-mono text-[12px] focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-gray-700 ml-0.5">สี</Label>
                                            <Select
                                                value={formData.color || "ดำ-ขาว"}
                                                onValueChange={(val) => setFormData({ ...formData, color: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {VEHICLE_COLORS.map((color) => (
                                                        <SelectItem key={color.value} value={color.value}>
                                                            {color.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Vehicle Condition Inspection */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex flex-col md:col-span-2">
                                            <Label className="text-[13px] font-medium text-gray-700 mb-3">การตรวจสอบสภาพรถ</Label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, vehicleConditionInspection: 'ผ่าน' })}
                                                    className={cn(
                                                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                                        formData.vehicleConditionInspection === 'ผ่าน'
                                                            ? "bg-chaiyo-blue text-white shadow-sm"
                                                            : "bg-white border border-gray-200 text-gray-700 hover:border-chaiyo-blue hover:text-chaiyo-blue"
                                                    )}
                                                >
                                                    ผ่าน
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, vehicleConditionInspection: 'ไม่ผ่าน' })}
                                                    className={cn(
                                                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                                        formData.vehicleConditionInspection === 'ไม่ผ่าน'
                                                            ? "bg-red-600 text-white shadow-sm"
                                                            : "bg-white border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600"
                                                    )}
                                                >
                                                    ไม่ผ่าน
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}

                            {COLLATERAL_QUESTIONS[formData.collateralType]?.length > 0 && !(formData.collateralType === 'land' && formData.landDeedType === 'อ.ช. 2') && (
                                <div className="pt-8 border-t border-border-subtle mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setCollateralQuestionsExpanded(!collateralQuestionsExpanded)}
                                        className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
                                    >
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            {formData.collateralType === 'agri' ? 'เงื่อนไขการประเมินหลักประกัน' : `เงื่อนไขการประเมินสภาพ${formData.collateralType === 'land' ? 'ทรัพย์สิน' : 'รถ'}`}
                                        </h4>
                                        <ChevronDown
                                            className={cn(
                                                "w-5 h-5 text-gray-400 transition-transform",
                                                collateralQuestionsExpanded && "rotate-180"
                                            )}
                                        />
                                    </button>
                                    {collateralQuestionsExpanded && (
                                        <div className="border border-border-strong rounded-xl overflow-hidden">
                                            <div className="divide-y divide-border-subtle">
                                                {COLLATERAL_QUESTIONS[formData.collateralType]?.map((q) => (
                                                    <div key={q.id}>
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-4 gap-4">
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
                                                                            ? "bg-chaiyo-blue text-white shadow-sm"
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

                                                    </div>
                                                ))}

                                                <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-4 gap-4">
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
                                                            className="h-10 pr-12 text-right font-medium text-gray-900 border-gray-200 bg-white focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 rounded-xl"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">บาท</span>
                                                    </div>
                                                </div>

                                                {/* ที่ดินทำกินมีคนช่วยทำงานหรือไม่ - moved after land_q9 */}
                                                {formData.collateralType === 'land' && (
                                                    <>
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-4 gap-4">
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

                                                        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-4 gap-4">
                                                            <span className="text-sm text-gray-700 font-bold">ใช้ทำมาหากินด้านไหน</span>
                                                            <Select value={formData.landUsageType || ""} onValueChange={(value) => setFormData({ ...formData, landUsageType: value })}>
                                                                <SelectTrigger className="h-10 w-full md:w-80 bg-white border-gray-200 focus:border-chaiyo-blue">
                                                                    <SelectValue placeholder="กรุณาระบุ" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="เกษตรกรรม">เกษตรกรรม</SelectItem>
                                                                    <SelectItem value="ค้าขาย">ค้าขาย</SelectItem>
                                                                    <SelectItem value="ให้เช่า">ให้เช่า</SelectItem>
                                                                    <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 2: ข้อมูลผู้ถือครอง/กรรมสิทธิ์ */}
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <UserCheck className="w-5 h-5" />
                            ข้อมูลผู้ถือครอง/กรรมสิทธิ์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Group: ข้อมูลผู้ถือครอง/กรรมสิทธิ์ */}

                            {/* Land Owner Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        {formData.collateralType === 'land' ? 'ข้อมูลผู้ถือกรรมสิทธิ์ที่ดิน' : 'ข้อมูลผู้ถือครอง/กรรมสิทธิ์'} <span className="text-red-500">*</span>
                                    </h4>
                                    {(formData.landOwners || []).length < 5 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, landOwners: [...(formData.landOwners || []), createDefaultOwner()] })}
                                            className="text-xs gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> เพิ่ม ({(formData.landOwners || []).length}/5)
                                        </Button>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/80">
                                            <TableRow>
                                                <TableHead className="w-[80px] text-center text-xs">เป็นผู้กู้</TableHead>
                                                <TableHead className="w-[120px] text-xs">คำนำหน้า <span className="text-red-500">*</span></TableHead>
                                                <TableHead className="text-xs">ชื่อ <span className="text-red-500">*</span></TableHead>
                                                <TableHead className="text-xs">นามสกุล <span className="text-red-500">*</span></TableHead>

                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(formData.landOwners || []).length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-6 text-gray-400 text-sm">
                                                        คลิก "เพิ่ม" เพื่อเพิ่มข้อมูลผู้ถือครอง
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                (formData.landOwners || []).map((owner: any, oIdx: number) => (
                                                    <TableRow key={owner.id || oIdx} className="hover:bg-transparent">
                                                        <TableCell className="text-center align-middle">
                                                            <Checkbox
                                                                checked={owner.isBorrower || false}
                                                                onCheckedChange={(checked) => {
                                                                    const newOwners = [...(formData.landOwners || [])];
                                                                    if (checked) {
                                                                        newOwners.forEach(o => o.isBorrower = false);
                                                                    }
                                                                    newOwners[oIdx] = { ...newOwners[oIdx], isBorrower: Boolean(checked) };
                                                                    setFormData({ ...formData, landOwners: newOwners });
                                                                }}
                                                                className="w-4 h-4 mx-auto block rounded border-gray-300 text-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white cursor-pointer"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="align-top">
                                                            <Select
                                                                value={owner.title || ""}
                                                                onValueChange={(value) => {
                                                                    const newOwners = [...(formData.landOwners || [])];
                                                                    newOwners[oIdx] = { ...newOwners[oIdx], title: value };
                                                                    setFormData({ ...formData, landOwners: newOwners });
                                                                }}
                                                                disabled={owner.isBorrower}
                                                            >
                                                                <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                    <SelectValue placeholder="เลือก" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="นาย">นาย (Mr.)</SelectItem>
                                                                    <SelectItem value="นาง">นาง (Mrs.)</SelectItem>
                                                                    <SelectItem value="นางสาว">นางสาว (Ms.)</SelectItem>
                                                                    <SelectItem value="ดร.">ดร. (Dr.)</SelectItem>
                                                                    <SelectItem value="ศ.">ศ. (Prof.)</SelectItem>
                                                                    <SelectItem value="รศ.">รศ. (Assoc. Prof.)</SelectItem>
                                                                    <SelectItem value="ผศ.">ผศ. (Asst. Prof.)</SelectItem>
                                                                    <SelectItem value="พอ.">พอ. (Commander)</SelectItem>
                                                                    <SelectItem value="อ.">อ. (Khun)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell className="align-top">
                                                            <Input
                                                                value={owner.name || ""}
                                                                onChange={(e) => {
                                                                    const newOwners = [...(formData.landOwners || [])];
                                                                    newOwners[oIdx] = { ...newOwners[oIdx], name: e.target.value };
                                                                    setFormData({ ...formData, landOwners: newOwners });
                                                                }}
                                                                placeholder="ชื่อ"
                                                                className="h-9 rounded-lg text-sm"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="align-top">
                                                            <Input
                                                                value={owner.lastName || ""}
                                                                onChange={(e) => {
                                                                    const newOwners = [...(formData.landOwners || [])];
                                                                    newOwners[oIdx] = { ...newOwners[oIdx], lastName: e.target.value };
                                                                    setFormData({ ...formData, landOwners: newOwners });
                                                                }}
                                                                placeholder="นามสกุล"
                                                                className="h-9 rounded-lg text-sm"
                                                            />
                                                        </TableCell>

                                                        <TableCell className="text-right align-middle">
                                                            {(formData.landOwners || []).length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        const owner = (formData.landOwners || [])[oIdx];
                                                                        const name = [owner?.firstName, owner?.lastName].filter(Boolean).join(' ') || `แถวที่ ${oIdx + 1}`;
                                                                        setDeleteOwnerConfirm({ type: 'land', ownerIdx: oIdx, name });
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Building Owner Sections - Show when buildingCount is set */}
                            {(formData.buildingCount && formData.buildingCount > 0) && (
                                Array.from({ length: formData.buildingCount }).map((_, bIdx) => (
                                    <div key={`building-owners-${bIdx}`} className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                ข้อมูลผู้ถือครอง/กรรมสิทธิ์สิ่งปลูกสร้าง {bIdx + 1}
                                            </h4>
                                            {((formData.buildingOwners?.[bIdx] || []).length < 5) && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newBuildingOwners = [...(formData.buildingOwners || [])];
                                                        if (!newBuildingOwners[bIdx]) newBuildingOwners[bIdx] = [];
                                                        newBuildingOwners[bIdx] = [...newBuildingOwners[bIdx], createDefaultOwner()];
                                                        setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                                    }}
                                                    className="text-xs gap-1"
                                                >
                                                    <Plus className="w-3 h-3" /> เพิ่ม ({(formData.buildingOwners?.[bIdx] || []).length}/5)
                                                </Button>
                                            )}
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-gray-50/80">
                                                    <TableRow>
                                                        <TableHead className="w-[80px] text-center text-xs">เป็นผู้กู้</TableHead>
                                                        <TableHead className="w-[120px] text-xs">คำนำหน้า <span className="text-red-500">*</span></TableHead>
                                                        <TableHead className="text-xs">ชื่อ <span className="text-red-500">*</span></TableHead>
                                                        <TableHead className="text-xs">นามสกุล <span className="text-red-500">*</span></TableHead>

                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {((formData.buildingOwners?.[bIdx] || []).length > 0 ? formData.buildingOwners[bIdx] : [createDefaultOwner()]).map((owner: any, oIdx: number) => {
                                                        const isDefaultAndEmpty = (formData.buildingOwners?.[bIdx] || []).length === 0;
                                                        return (
                                                            <TableRow key={owner.id || oIdx} className="hover:bg-transparent">
                                                                <TableCell className="text-center align-middle">
                                                                    <Checkbox
                                                                        checked={owner.isBorrower || false}
                                                                        onCheckedChange={(checked) => {
                                                                            const newBuildingOwners = [...(formData.buildingOwners || [])];
                                                                            let currentBuildingOwners = newBuildingOwners[bIdx] || [];
                                                                            if (currentBuildingOwners.length === 0) {
                                                                                currentBuildingOwners = [{ ...owner }];
                                                                            } else {
                                                                                currentBuildingOwners = [...currentBuildingOwners];
                                                                            }

                                                                            if (checked) {
                                                                                currentBuildingOwners.forEach((o: any) => o.isBorrower = false);
                                                                            }
                                                                            currentBuildingOwners[oIdx] = { ...currentBuildingOwners[oIdx], isBorrower: Boolean(checked) };
                                                                            newBuildingOwners[bIdx] = currentBuildingOwners;
                                                                            setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                                                        }}
                                                                        className="w-4 h-4 mx-auto block rounded border-gray-300 text-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white cursor-pointer"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={owner.title || ""}
                                                                        onValueChange={(value) => {
                                                                            const newBuildingOwners = [...(formData.buildingOwners || [])];
                                                                            if (!newBuildingOwners[bIdx] || newBuildingOwners[bIdx].length === 0) {
                                                                                newBuildingOwners[bIdx] = [{ ...owner, title: value }];
                                                                            } else {
                                                                                const newOwners = [...(newBuildingOwners[bIdx] || [])];
                                                                                newOwners[oIdx] = { ...newOwners[oIdx], title: value };
                                                                                newBuildingOwners[bIdx] = newOwners;
                                                                            }
                                                                            setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                                                        }}
                                                                        disabled={owner.isBorrower}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="นาย">นาย (Mr.)</SelectItem>
                                                                            <SelectItem value="นาง">นาง (Mrs.)</SelectItem>
                                                                            <SelectItem value="นางสาว">นางสาว (Ms.)</SelectItem>
                                                                            <SelectItem value="ดร.">ดร. (Dr.)</SelectItem>
                                                                            <SelectItem value="ศ.">ศ. (Prof.)</SelectItem>
                                                                            <SelectItem value="รศ.">รศ. (Assoc. Prof.)</SelectItem>
                                                                            <SelectItem value="ผศ.">ผศ. (Asst. Prof.)</SelectItem>
                                                                            <SelectItem value="พอ.">พอ. (Commander)</SelectItem>
                                                                            <SelectItem value="อ.">อ. (Khun)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Input
                                                                        value={owner.name || ""}
                                                                        onChange={(e) => {
                                                                            const newBuildingOwners = [...(formData.buildingOwners || [])];
                                                                            if (!newBuildingOwners[bIdx] || newBuildingOwners[bIdx].length === 0) {
                                                                                newBuildingOwners[bIdx] = [{ ...owner, name: e.target.value }];
                                                                            } else {
                                                                                const newOwners = [...(newBuildingOwners[bIdx] || [])];
                                                                                newOwners[oIdx] = { ...newOwners[oIdx], name: e.target.value };
                                                                                newBuildingOwners[bIdx] = newOwners;
                                                                            }
                                                                            setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                                                        }}
                                                                        placeholder="ชื่อ"
                                                                        className="h-9 rounded-lg text-sm"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Input
                                                                        value={owner.lastName || ""}
                                                                        onChange={(e) => {
                                                                            const newBuildingOwners = [...(formData.buildingOwners || [])];
                                                                            if (!newBuildingOwners[bIdx] || newBuildingOwners[bIdx].length === 0) {
                                                                                newBuildingOwners[bIdx] = [{ ...owner, lastName: e.target.value }];
                                                                            } else {
                                                                                const newOwners = [...(newBuildingOwners[bIdx] || [])];
                                                                                newOwners[oIdx] = { ...newOwners[oIdx], lastName: e.target.value };
                                                                                newBuildingOwners[bIdx] = newOwners;
                                                                            }
                                                                            setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                                                        }}
                                                                        placeholder="นามสกุล"
                                                                        className="h-9 rounded-lg text-sm"
                                                                    />
                                                                </TableCell>

                                                                <TableCell className="text-right align-middle">
                                                                    {!isDefaultAndEmpty && (formData.buildingOwners?.[bIdx] || []).length > 1 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                const owner = (formData.buildingOwners?.[bIdx] || [])[oIdx];
                                                                                const name = [owner?.firstName, owner?.lastName].filter(Boolean).join(' ') || `แถวที่ ${oIdx + 1}`;
                                                                                setDeleteOwnerConfirm({ type: 'building', ownerIdx: oIdx, buildingIdx: bIdx, name });
                                                                            }}
                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ))
                            )}
                            {/* Group: ระยะเวลาการถือกรรมสิทธิ์ */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    {formData.collateralType === 'land' ? 'ข้อมูลการโอนกรรมสิทธิ์' : 'ระยะเวลาการถือกรรมสิทธิ์'}
                                </h4>
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

                            {/* Group: ข้อมูลเจ้าของเดิม - Moved First */}
                            <div className="pt-4 border-t border-gray-100 -mt-6 pt-0 border-t-0">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    ข้อมูลเจ้าของเดิม
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ความสัมพันธ์กับผู้กู้</Label>
                                        <Select
                                            value={formData.previousOwnerName || ""}
                                            onValueChange={(val) => setFormData({ ...formData, previousOwnerName: val })}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                <SelectValue placeholder="เลือกความสัมพันธ์" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="คู่สมรส">คู่สมรส</SelectItem>
                                                <SelectItem value="บิดา">บิดา</SelectItem>
                                                <SelectItem value="มารดา">มารดา</SelectItem>
                                                <SelectItem value="พี่น้อง">พี่น้อง</SelectItem>
                                                <SelectItem value="บุตร">บุตร</SelectItem>
                                                <SelectItem value="ลูกสะใภ้">ลูกสะใภ้</SelectItem>
                                                <SelectItem value="อื่น ๆ">อื่น ๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                {/* วิธีประเมิน multi-select (min 1, max 3) */}
                                <div className="space-y-2">
                                    <Label className="text-[13px] text-muted-foreground ml-1">วิธีประเมิน (เลือกได้สูงสุด 3 วิธี, อย่างน้อย 1 วิธี) <span className="text-red-500">*</span></Label>
                                    <div className="space-y-3">
                                        {APPRAISAL_METHODS.map(m => {
                                            const selected = (formData.selectedAppraisalMethods || []).includes(m.value);
                                            return (
                                                <label
                                                    key={m.value}
                                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <Checkbox
                                                        checked={selected}
                                                        onCheckedChange={(checked) => {
                                                            const current: string[] = formData.selectedAppraisalMethods || [];
                                                            let updated: string[];
                                                            const newData = { ...(formData.appraisalMethodsData || {}) };
                                                            if (checked) {
                                                                if (current.length >= 3) return; // max 3
                                                                updated = [...current, m.value];
                                                                if (!newData[m.value]) {
                                                                    newData[m.value] = createDefaultAppraisalMethod(m.value);
                                                                }
                                                            } else {
                                                                if (current.length <= 1) return; // min 1
                                                                updated = current.filter((v: string) => v !== m.value);
                                                                delete newData[m.value];
                                                            }
                                                            setFormData({ ...formData, selectedAppraisalMethods: updated, appraisalMethodsData: newData });
                                                        }}
                                                        className="w-5 h-5 rounded border-gray-300 text-chaiyo-blue cursor-pointer"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{m.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Render each selected appraisal method */}
                                {(formData.selectedAppraisalMethods || []).map((methodKey: string, methodIdx: number) => {
                                    const methodData = (formData.appraisalMethodsData || {})[methodKey] || createDefaultAppraisalMethod(methodKey);
                                    const updateMethodData = (field: string, value: any) => {
                                        const newData = { ...(formData.appraisalMethodsData || {}) };
                                        newData[methodKey] = { ...methodData, [field]: value };
                                        // Auto-calc totalLandAppraisal
                                        if (field === 'landPricePerWah' || field === 'landAreaWah') {
                                            const price = field === 'landPricePerWah' ? Number(value) : Number(methodData.landPricePerWah || 0);
                                            const area = field === 'landAreaWah' ? Number(value) : Number(methodData.landAreaWah || 0);
                                            newData[methodKey].totalLandAppraisal = (price * area).toString();
                                        }
                                        // Auto-calc costTotalLandAppraisal (Cost Approach)
                                        if (field === 'costLandPricePerWah' || field === 'costLandAreaWah') {
                                            const price = field === 'costLandPricePerWah' ? Number(value) : Number(methodData.costLandPricePerWah || 0);
                                            const area = field === 'costLandAreaWah' ? Number(value) : Number(methodData.costLandAreaWah || 0);
                                            newData[methodKey].costTotalLandAppraisal = (price * area).toString();
                                        }
                                        // Auto-calc costBuildingAfterDepreciation
                                        if (field === 'costBuildingBeforeDepreciation' || field === 'costBuildingDepreciation') {
                                            const before = field === 'costBuildingBeforeDepreciation' ? Number(value) : Number(methodData.costBuildingBeforeDepreciation || 0);
                                            const depreciation = field === 'costBuildingDepreciation' ? Number(value) : Number(methodData.costBuildingDepreciation || 0);
                                            newData[methodKey].costBuildingAfterDepreciation = (before - depreciation).toString();
                                        }
                                        setFormData({ ...formData, appraisalMethodsData: newData });
                                    };
                                    const updateBuildings = (buildings: any[]) => {
                                        const newData = { ...(formData.appraisalMethodsData || {}) };
                                        newData[methodKey] = { ...methodData, buildings };
                                        setFormData({ ...formData, appraisalMethodsData: newData });
                                    };

                                    return (
                                        <div key={methodKey} className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="text-sm font-bold text-chaiyo-blue mb-4 flex items-center gap-2">
                                                <Badge className="bg-chaiyo-blue text-white text-xs">{methodIdx + 1}</Badge>
                                                {methodKey}
                                            </h4>

                                            {/* Accordion for Land and Building Information */}
                                            <Accordion type="multiple" className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Group 1: ข้อมูลที่ดิน */}
                                                <AccordionItem value="land-info" className="border-b-0">
                                                    <AccordionTrigger className="bg-blue-50/50 hover:bg-blue-50 px-6 py-4 font-bold text-sm text-gray-900">
                                                        ข้อมูลที่ดิน
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 py-6 bg-white">
                                                        {methodKey === "หนังสือรับรองจากสำนักงานที่ดิน" ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                                {/* Row 1: วันที่ประเมิน + 2 empty */}
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">วันที่ประเมิน <span className="text-red-500">*</span></Label>
                                                                    <DatePickerBE
                                                                        value={methodData.appraisalDate || ""}
                                                                        onChange={(val) => updateMethodData('appraisalDate', val)}
                                                                        inputClassName="h-10 border-gray-200"
                                                                    />
                                                                </div>
                                                                <div></div>
                                                                <div></div>

                                                                {/* Row 2: ราคาประเมินที่ดิน + เนื้อที่ + รวมราคาประเมิน */}
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินที่ดิน <span className="text-red-500">*</span></Label>
                                                                    <div className="relative">
                                                                        <Input
                                                                            value={methodData.landPricePerWah ? Number(methodData.landPricePerWah).toLocaleString() : ""}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value.replace(/,/g, '');
                                                                                if (/^\d*$/.test(val)) updateMethodData('landPricePerWah', val);
                                                                            }}
                                                                            className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท/ตร.ว.</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ <span className="text-red-500">*</span></Label>
                                                                    <div className="relative">
                                                                        <Input
                                                                            value={methodData.landAreaWah || ""}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(val)) updateMethodData('landAreaWah', val);
                                                                            }}
                                                                            className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ว.</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดิน</Label>
                                                                    <div className="relative">
                                                                        <Input
                                                                            disabled
                                                                            value={methodData.totalLandAppraisal ? Number(methodData.totalLandAppraisal).toLocaleString() : "0"}
                                                                            className="h-10 rounded-xl bg-gray-50 border-gray-200 pr-10 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                    </div>
                                                                </div>

                                                                {/* Row 3: สถานะที่ดิน (ยึด/อายัด) + สถานะที่ดิน (ออกใบแทน) + empty */}
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">สถานะที่ดิน การยึด/อายัด</Label>
                                                                    <Select
                                                                        value={methodData.landSeizureStatus || ""}
                                                                        onValueChange={(val) => updateMethodData('landSeizureStatus', val)}
                                                                    >
                                                                        <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20">
                                                                            <SelectValue placeholder="เลือก..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ไม่มีการยึดหรืออายัด">ไม่มีการยึดหรืออายัด</SelectItem>
                                                                            <SelectItem value="มีการยึดหรืออายัด ตาม">มีการยึดหรืออายัด ตาม</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">สถานะที่ดิน การออกใบแทน</Label>
                                                                    <Select
                                                                        value={methodData.landReplacementStatus || ""}
                                                                        onValueChange={(val) => updateMethodData('landReplacementStatus', val)}
                                                                    >
                                                                        <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20">
                                                                            <SelectValue placeholder="เลือก..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ไม่มีการออกใบแทน">ไม่มีการออกใบแทน</SelectItem>
                                                                            <SelectItem value="ปัจจุบันเป็นใบแทน">ปัจจุบันเป็นใบแทน</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div></div>
                                                            </div>
                                                        ) : methodKey === "ใบประเมินราคาจากบริษัทภายนอก" ? (
                                                            <div className="space-y-4">
                                                                {/* Initial 3-column grid */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ประเมิน <span className="text-red-500">*</span></Label>
                                                                        <DatePickerBE
                                                                            value={methodData.appraisalDate || ""}
                                                                            onChange={(val) => updateMethodData('appraisalDate', val)}
                                                                            inputClassName="h-10 border-gray-200"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่สิ่งปลูกสร้างทั้งหมด <span className="text-red-500">*</span></Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={methodData.totalBuildingArea || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(val)) updateMethodData('totalBuildingArea', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ม.</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">ชื่อบริษัทที่ประเมิน <span className="text-red-500">*</span></Label>
                                                                        <Select
                                                                            value={methodData.companyName || ""}
                                                                            onValueChange={(val) => updateMethodData('companyName', val)}
                                                                        >
                                                                            <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20">
                                                                                <SelectValue placeholder="เลือกบริษัท" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {APPRAISAL_COMPANIES.map((company) => (
                                                                                    <SelectItem key={company.value} value={company.value}>
                                                                                        {company.label}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>

                                                                {/* Cost Approach checkbox - only for non-land collaterals */}
                                                                {formData.collateralType !== 'land' && (
                                                                    <div className="flex items-center gap-3">
                                                                        <Checkbox
                                                                            checked={methodData.hasCostApproachLand || false}
                                                                            onCheckedChange={(checked) => updateMethodData('hasCostApproachLand', checked)}
                                                                        />
                                                                        <Label className="text-sm font-medium cursor-pointer">มีราคาประเมินแบบคิดต้นทุน (Cost Approach)</Label>
                                                                    </div>
                                                                )}

                                                                {/* Cost Approach section - always visible for land, conditional for others */}
                                                                {(formData.collateralType === 'land' || methodData.hasCostApproachLand) && (
                                                                    <div className="space-y-3">
                                                                        <Label className="text-sm font-semibold text-gray-700">คิดต้นทุน (Cost Approach)</Label>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินที่ดิน <span className="text-red-500">*</span></Label>
                                                                                <div className="relative">
                                                                                    <Input
                                                                                        value={methodData.costLandPricePerWah ? Number(methodData.costLandPricePerWah).toLocaleString() : ""}
                                                                                        onChange={(e) => {
                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                            if (/^\d*$/.test(val)) updateMethodData('costLandPricePerWah', val);
                                                                                        }}
                                                                                        className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                    />
                                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท/ตร.ว.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ <span className="text-red-500">*</span></Label>
                                                                                <div className="relative">
                                                                                    <Input
                                                                                        value={methodData.costLandAreaWah || ""}
                                                                                        onChange={(e) => {
                                                                                            const val = e.target.value;
                                                                                            if (/^\d*\.?\d*$/.test(val)) updateMethodData('costLandAreaWah', val);
                                                                                        }}
                                                                                        className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                    />
                                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ว.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดิน</Label>
                                                                                <div className="relative">
                                                                                    <Input
                                                                                        disabled
                                                                                        value={methodData.costTotalLandAppraisal ? Number(methodData.costTotalLandAppraisal).toLocaleString() : "0"}
                                                                                        className="h-10 rounded-xl bg-gray-50 border-gray-200 pr-10 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                                                                    />
                                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Market Approach - always visible */}
                                                                <div className="space-y-3">
                                                                    <Label className="text-sm font-semibold text-gray-700">เปรียบเทียบตลาด (Market Approach)</Label>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินที่ดิน <span className="text-red-500">*</span></Label>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    value={methodData.landPricePerWah ? Number(methodData.landPricePerWah).toLocaleString() : ""}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value.replace(/,/g, '');
                                                                                        if (/^\d*$/.test(val)) updateMethodData('landPricePerWah', val);
                                                                                    }}
                                                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                />
                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท/ตร.ว.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ <span className="text-red-500">*</span></Label>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    value={methodData.landAreaWah || ""}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        if (/^\d*\.?\d*$/.test(val)) updateMethodData('landAreaWah', val);
                                                                                    }}
                                                                                    className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                />
                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ว.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดิน</Label>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    disabled
                                                                                    value={methodData.totalLandAppraisal ? Number(methodData.totalLandAppraisal).toLocaleString() : "0"}
                                                                                    className="h-10 rounded-xl bg-gray-50 border-gray-200 pr-10 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                                                                />
                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[13px] text-muted-foreground ml-1">วันที่ประเมิน <span className="text-red-500">*</span></Label>
                                                                    <DatePickerBE
                                                                        value={methodData.appraisalDate || ""}
                                                                        onChange={(val) => updateMethodData('appraisalDate', val)}
                                                                        inputClassName="h-10 border-gray-200"
                                                                    />
                                                                </div>
                                                                {methodKey !== "ราคาประเมินจากกรมธนารักษ์" && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินที่ดิน (ตารางวาละ) <span className="text-red-500">*</span></Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={methodData.landPricePerWah ? Number(methodData.landPricePerWah).toLocaleString() : ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value.replace(/,/g, '');
                                                                                    if (/^\d*$/.test(val)) updateMethodData('landPricePerWah', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {methodKey !== "ราคาประเมินจากกรมธนารักษ์" && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ (ตารางวา) <span className="text-red-500">*</span></Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={methodData.landAreaWah || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(val)) updateMethodData('landAreaWah', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ว.</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {methodKey !== "ราคาประเมินจากกรมธนารักษ์" && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่สิ่งปลูกสร้างทั้งหมด (ตารางเมตร)</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={methodData.totalBuildingArea || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(val)) updateMethodData('totalBuildingArea', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตร.ม.</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {methodKey !== "ราคาประเมินจากกรมธนารักษ์" && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-muted-foreground ml-1">รวมราคาประเมินที่ดิน</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                disabled
                                                                                value={methodData.totalLandAppraisal ? Number(methodData.totalLandAppraisal).toLocaleString() : "0"}
                                                                                className="h-10 rounded-xl bg-gray-50 border-gray-200 pr-10 text-right font-bold text-chaiyo-blue disabled:opacity-100"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* Group 2: ข้อมูลสิ่งปลูกสร้าง - only show if buildingCount > 0 */}
                                                {formData.buildingCount > 0 && (
                                                    <AccordionItem value="building-info" className="border-b-0">
                                                        <AccordionTrigger className="bg-emerald-50/50 hover:bg-emerald-50 px-6 py-4 font-bold text-sm text-gray-900">
                                                            ข้อมูลสิ่งปลูกสร้าง
                                                        </AccordionTrigger>
                                                        <AccordionContent className="px-6 py-6 bg-white">
                                                            <div className="space-y-4">
                                                                {formData.landDeedType !== "อ.ช. 2" && (
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[13px] text-gray-600 ml-1">ชื่อหมู่บ้านจัดสรร (ถ้ามี)</Label>
                                                                            <Select
                                                                                value={methodData.subdivisionName || ""}
                                                                                onValueChange={(val) => updateMethodData('subdivisionName', val)}
                                                                            >
                                                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20">
                                                                                    <SelectValue placeholder="เลือกหมู่บ้าน..." />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {SUBDIVISIONS.map((subdivision) => (
                                                                                        <SelectItem key={subdivision.value} value={subdivision.value}>
                                                                                            {subdivision.label}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        {methodData.subdivisionName === "อื่นๆ" && (
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[13px] text-gray-600 ml-1">ระบุชื่อหมู่บ้าน</Label>
                                                                                <Input
                                                                                    value={methodData.subdivisionNameOther || ""}
                                                                                    onChange={(e) => updateMethodData('subdivisionNameOther', e.target.value)}
                                                                                    className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                    placeholder="โปรดระบุ"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {methodData.subdivisionName !== "อื่นๆ" && (
                                                                            <div></div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center justify-between">
                                                                    <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                                        <Plus className="w-4 h-4 text-emerald-500" />
                                                                        สิ่งปลูกสร้าง​ {(methodData.buildings || []).length}
                                                                    </h5>
                                                                    {(methodData.buildings || []).length < (formData.landDeedType === "อ.ช. 2" ? 1 : 20) && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newBuildings = [...(methodData.buildings || [])];
                                                                                newBuildings.push({
                                                                                    id: generateId(),
                                                                                    appraisalPrice: "",
                                                                                    floors: [createDefaultFloor()]
                                                                                });
                                                                                updateBuildings(newBuildings);
                                                                            }}
                                                                            className="text-xs gap-1 h-7"
                                                                        >
                                                                            <Plus className="w-3 h-3" /> เพิ่มสิ่งปลูกสร้าง ({(methodData.buildings || []).length}/{formData.landDeedType === "อ.ช. 2" ? 1 : 20})
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                {(methodData.buildings || []).map((building: any, bIdx: number) => {
                                                                    const updateBuilding = (field: string, value: any) => {
                                                                        const newBuildings = [...(methodData.buildings || [])];
                                                                        newBuildings[bIdx] = { ...newBuildings[bIdx], [field]: value };
                                                                        updateBuildings(newBuildings);
                                                                    };
                                                                    const updateFloors = (floors: any[]) => {
                                                                        const newBuildings = [...(methodData.buildings || [])];
                                                                        newBuildings[bIdx] = { ...newBuildings[bIdx], floors };
                                                                        updateBuildings(newBuildings);
                                                                    };

                                                                    return (
                                                                        <div key={building.id || bIdx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-sm font-semibold text-gray-700">สิ่งปลูกสร้างที่ {bIdx + 1}</span>
                                                                                {(methodData.buildings || []).length > 1 && (
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => {
                                                                                            const newBuildings = (methodData.buildings || []).filter((_: any, i: number) => i !== bIdx);
                                                                                            updateBuildings(newBuildings);
                                                                                        }}
                                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                                                                                    >
                                                                                        <Trash2 className="w-3 h-3 mr-1" /> ลบ
                                                                                    </Button>
                                                                                )}
                                                                            </div>

                                                                            {/* Additional fields for land collateral (except อ.ช. 2) */}
                                                                            {formData.collateralType === 'land' && formData.landDeedType !== "อ.ช. 2" && (
                                                                                <div className="p-3 bg-white border border-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                                    {/* Row 1: ประเภท, เลขที่, empty */}
                                                                                    <div className="space-y-1">
                                                                                        <Label className="text-[12px] text-gray-600">ประเภทสิ่งปลูกสร้าง <span className="text-red-500">*</span></Label>
                                                                                        <select
                                                                                            value={building.buildingType || ""}
                                                                                            onChange={(e) => updateBuilding('buildingType', e.target.value)}
                                                                                            className="w-full h-9 rounded-lg bg-white border border-gray-200 px-2 text-xs focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                        >
                                                                                            <option value="">เลือกประเภท...</option>
                                                                                            <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                                                                                            <option value="อาคารพาณิชย์">อาคารพาณิชย์</option>
                                                                                            <option value="โรงงาน">โรงงาน</option>
                                                                                            <option value="เกษตรกรรม">เกษตรกรรม</option>
                                                                                            <option value="อื่นๆ">อื่นๆ</option>
                                                                                        </select>
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <Label className="text-[12px] text-gray-600">เลขที่สิ่งปลูกสร้าง</Label>
                                                                                        <Input
                                                                                            placeholder="123/456"
                                                                                            value={building.buildingNumber || ""}
                                                                                            onChange={(e) => updateBuilding('buildingNumber', e.target.value)}
                                                                                            className="h-9 rounded-lg bg-white border-gray-200 text-xs px-2 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                        />
                                                                                    </div>

                                                                                    {/* Empty col */}
                                                                                    <div></div>

                                                                                    {/* Row 2: Conditional - Approach sections for external appraisal, or depreciation fields */}
                                                                                    {methodKey === "ใบประเมินราคาจากบริษัทภายนอก" ? (
                                                                                        <>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">รวมราคาประเมิน (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.costBeforeDepreciation ? Number(building.costBeforeDepreciation).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('costBeforeDepreciation', val);
                                                                                                        }}
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 text-xs text-right px-2 pr-8 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">หักค่าเสื่อม <span className="text-red-500">*</span></Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.costDepreciation ? Number(building.costDepreciation).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('costDepreciation', val);
                                                                                                        }}
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 text-xs text-right px-2 pr-8 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">ราคาประเมิน (หลังหักค่าเสื่อม)</Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        readOnly
                                                                                                        value={(() => {
                                                                                                            const before = Number(building.costBeforeDepreciation || 0);
                                                                                                            const depreciation = Number(building.costDepreciation || 0);
                                                                                                            const after = before - depreciation;
                                                                                                            return after > 0 ? after.toLocaleString() : "";
                                                                                                        })()}
                                                                                                        className="h-9 rounded-lg bg-gray-100 border-gray-200 text-xs text-right px-2 pr-8 text-gray-600"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">ราคาประเมิน (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.totalAppraisalBeforeDepreciation ? Number(building.totalAppraisalBeforeDepreciation).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('totalAppraisalBeforeDepreciation', val);
                                                                                                        }}
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 text-xs text-right px-2 pr-8 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท/ตร.ม.</span>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">หักค่าเสื่อม</Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.depreciationAmount ? Number(building.depreciationAmount).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('depreciationAmount', val);
                                                                                                        }}
                                                                                                        placeholder="0"
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 text-xs text-right px-2 pr-8 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">ราคาประเมิน (หลังหักค่าเสื่อม)</Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        readOnly
                                                                                                        value={(() => {
                                                                                                            const before = Number(building.totalAppraisalBeforeDepreciation || 0);
                                                                                                            const depreciation = Number(building.depreciationAmount || 0);
                                                                                                            const after = before - depreciation;
                                                                                                            return after > 0 ? after.toLocaleString() : "";
                                                                                                        })()}
                                                                                                        className="h-9 rounded-lg bg-gray-100 border-gray-200 text-xs text-right px-2 pr-8 text-gray-600"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    )}

                                                                                    {/* Row 3: อายุ, รีโนเวท, ปีรีโนเวท */}
                                                                                    <div className="space-y-1">
                                                                                        <Label className="text-[12px] text-gray-600">อายุสิ่งปลูกสร้าง (ปี)</Label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            min="0"
                                                                                            placeholder="0"
                                                                                            value={building.buildingAge || ""}
                                                                                            onChange={(e) => updateBuilding('buildingAge', e.target.value)}
                                                                                            className="h-9 rounded-lg bg-white border-gray-200 text-xs text-right px-2 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                        />
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <Label className="text-[12px] text-gray-600">รีโนเวท</Label>
                                                                                        <div className="flex gap-2 items-center h-9">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => updateBuilding('hasRenovation', 'yes')}
                                                                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${building.hasRenovation === 'yes'
                                                                                                    ? 'bg-emerald-500 text-white'
                                                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                                                    }`}
                                                                                            >
                                                                                                มี
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => updateBuilding('hasRenovation', 'no')}
                                                                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${building.hasRenovation === 'no'
                                                                                                    ? 'bg-gray-500 text-white'
                                                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                                                    }`}
                                                                                            >
                                                                                                ไม่มี
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>

                                                                                    {building.hasRenovation === 'yes' && (
                                                                                        <div className="space-y-1">
                                                                                            <Label className="text-[12px] text-gray-600">ปีที่รีโนเวทล่าสุด <span className="text-red-500">*</span></Label>
                                                                                            <Input
                                                                                                type="number"
                                                                                                min="1900"
                                                                                                max={currentYear}
                                                                                                placeholder="2023"
                                                                                                value={building.renovationYear || ""}
                                                                                                onChange={(e) => updateBuilding('renovationYear', e.target.value)}
                                                                                                className="h-9 rounded-lg bg-white border-gray-200 text-xs px-2 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                    {building.hasRenovation !== 'yes' && (
                                                                                        <div></div>
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                            {/* Cost Approach and Market Approach for external appraisal */}
                                                                            {methodKey === "ใบประเมินราคาจากบริษัทภายนอก" && (
                                                                                <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                                                                                    {/* Cost Approach checkbox - only for non-land collaterals */}
                                                                                    {formData.collateralType !== 'land' && (
                                                                                        <div className="flex items-center gap-3">
                                                                                            <Checkbox
                                                                                                checked={building.hasCostApproach || false}
                                                                                                onCheckedChange={(checked) => updateBuilding('hasCostApproach', checked)}
                                                                                            />
                                                                                            <Label className="text-sm font-medium cursor-pointer">มีราคาประเมินแบบคิดต้นทุน (Cost Approach)</Label>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Cost Approach section - always visible for land, conditional for others */}
                                                                                    {(formData.collateralType === 'land' || building.hasCostApproach) && (
                                                                                        <div className="space-y-2">
                                                                                            <Label className="text-sm font-semibold text-gray-700">คิดต้นทุน (Cost Approach)</Label>
                                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                                                                                                <div className="space-y-1">
                                                                                                    <Label className="text-[12px] text-gray-600">ราคาประเมิน (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                                                                                    <div className="relative">
                                                                                                        <Input
                                                                                                            value={building.costBeforeDepreciation ? Number(building.costBeforeDepreciation).toLocaleString() : ""}
                                                                                                            onChange={(e) => {
                                                                                                                const val = e.target.value.replace(/,/g, '');
                                                                                                                if (/^\d*$/.test(val)) updateBuilding('costBeforeDepreciation', val);
                                                                                                            }}
                                                                                                            className="h-9 rounded-lg bg-white border-gray-200 pr-8 text-right text-xs focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                        />
                                                                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="space-y-1">
                                                                                                    <Label className="text-[12px] text-gray-600">หักค่าเสื่อมราคา <span className="text-red-500">*</span></Label>
                                                                                                    <div className="relative">
                                                                                                        <Input
                                                                                                            value={building.costDepreciation ? Number(building.costDepreciation).toLocaleString() : ""}
                                                                                                            onChange={(e) => {
                                                                                                                const val = e.target.value.replace(/,/g, '');
                                                                                                                if (/^\d*$/.test(val)) updateBuilding('costDepreciation', val);
                                                                                                            }}
                                                                                                            className="h-9 rounded-lg bg-white border-gray-200 pr-8 text-right text-xs focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                        />
                                                                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="space-y-1">
                                                                                                    <Label className="text-[12px] text-gray-600">ราคาประเมิน (หลังหักค่าเสื่อม)</Label>
                                                                                                    <div className="relative">
                                                                                                        <Input
                                                                                                            readOnly
                                                                                                            value={(() => {
                                                                                                                const before = Number(building.costBeforeDepreciation || 0);
                                                                                                                const depreciation = Number(building.costDepreciation || 0);
                                                                                                                const after = before - depreciation;
                                                                                                                return after > 0 ? after.toLocaleString() : "";
                                                                                                            })()}
                                                                                                            className="h-9 rounded-lg bg-gray-100 border-gray-200 pr-8 text-right text-xs text-gray-600"
                                                                                                        />
                                                                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Market Approach - always visible */}
                                                                                    <div className="space-y-2">
                                                                                        <Label className="text-sm font-semibold text-gray-700">เปรียบเทียบตลาด (Market Approach)</Label>
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">ราคาประเมิน (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.marketBeforeDepreciation ? Number(building.marketBeforeDepreciation).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('marketBeforeDepreciation', val);
                                                                                                        }}
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 pr-8 text-right text-xs focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">หักค่าเสื่อม <span className="text-red-500">*</span></Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        value={building.marketDepreciation ? Number(building.marketDepreciation).toLocaleString() : ""}
                                                                                                        onChange={(e) => {
                                                                                                            const val = e.target.value.replace(/,/g, '');
                                                                                                            if (/^\d*$/.test(val)) updateBuilding('marketDepreciation', val);
                                                                                                        }}
                                                                                                        className="h-9 rounded-lg bg-white border-gray-200 pr-8 text-right text-xs focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <Label className="text-[12px] text-gray-600">ราคาประเมิน (หลังหักค่าเสื่อม)</Label>
                                                                                                <div className="relative">
                                                                                                    <Input
                                                                                                        readOnly
                                                                                                        value={(() => {
                                                                                                            const before = Number(building.marketBeforeDepreciation || 0);
                                                                                                            const depreciation = Number(building.marketDepreciation || 0);
                                                                                                            const after = before - depreciation;
                                                                                                            return after > 0 ? after.toLocaleString() : "";
                                                                                                        })()}
                                                                                                        className="h-9 rounded-lg bg-gray-100 border-gray-200 pr-8 text-right text-xs text-gray-600"
                                                                                                    />
                                                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">บาท</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Floors section */}
                                                                            <div className="space-y-3 mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-sm font-semibold text-gray-900">จำนวนชั้น: {(building.floors || []).length}</span>
                                                                                    {(building.floors || []).length < (formData.landDeedType === "อ.ช. 2" ? 3 : 10) && (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => updateFloors([...(building.floors || []), createDefaultFloor()])}
                                                                                            className="text-xs gap-1 h-7"
                                                                                        >
                                                                                            <Plus className="w-3 h-3" /> เพิ่มชั้น ({(building.floors || []).length}/{formData.landDeedType === "อ.ช. 2" ? 3 : 10})
                                                                                        </Button>
                                                                                    )}
                                                                                </div>

                                                                                {(building.floors || []).map((floor: any, fIdx: number) => {
                                                                                    const updateBlocks = (blocks: any[]) => {
                                                                                        const newFloors = [...(building.floors || [])];
                                                                                        newFloors[fIdx] = { ...newFloors[fIdx], blocks };
                                                                                        updateFloors(newFloors);
                                                                                    };
                                                                                    const updateFloor = (field: string, value: any) => {
                                                                                        const newFloors = [...(building.floors || [])];
                                                                                        newFloors[fIdx] = { ...newFloors[fIdx], [field]: value };
                                                                                        updateFloors(newFloors);
                                                                                    };

                                                                                    return (
                                                                                        <div key={floor.id || fIdx} className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <span className="text-sm font-semibold text-gray-900">ชั้นที่ {fIdx + 1}</span>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    {(floor.blocks || []).length < 10 && (
                                                                                                        <Button
                                                                                                            type="button"
                                                                                                            variant="outline"
                                                                                                            size="sm"
                                                                                                            onClick={() => updateBlocks([...(floor.blocks || []), createDefaultBlock()])}
                                                                                                            className="text-xs gap-1 h-7"
                                                                                                        >
                                                                                                            <Plus className="w-3 h-3" /> เพิ่มบล็อก ({(floor.blocks || []).length}/10)
                                                                                                        </Button>
                                                                                                    )}
                                                                                                    {(building.floors || []).length > 1 && (
                                                                                                        <Button
                                                                                                            type="button"
                                                                                                            variant="ghost"
                                                                                                            size="sm"
                                                                                                            onClick={() => {
                                                                                                                const newFloors = (building.floors || []).filter((_: any, i: number) => i !== fIdx);
                                                                                                                updateFloors(newFloors);
                                                                                                            }}
                                                                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-6 px-1.5 text-xs"
                                                                                                        >
                                                                                                            <Trash2 className="w-3 h-3" />
                                                                                                        </Button>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Blocks section - Table format */}
                                                                                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                                                                <Table>
                                                                                                    <TableHeader className="bg-gray-50/80">
                                                                                                        <TableRow>
                                                                                                            <TableHead className="w-[80px] text-center text-xs">บล็อก</TableHead>
                                                                                                            <TableHead className="text-xs">รายละเอียดโซน</TableHead>
                                                                                                            <TableHead className="text-xs">Width (ม.) <span className="text-red-500">*</span></TableHead>
                                                                                                            <TableHead className="text-xs">Length (ม.) <span className="text-red-500">*</span></TableHead>
                                                                                                            <TableHead className="w-[100px] text-xs">Area (ตร.ม.)</TableHead>
                                                                                                            <TableHead className="w-[50px]"></TableHead>
                                                                                                        </TableRow>
                                                                                                    </TableHeader>
                                                                                                    <TableBody>
                                                                                                        {(floor.blocks || []).length === 0 ? (
                                                                                                            <TableRow>
                                                                                                                <TableCell colSpan={6} className="text-center py-6 text-gray-400 text-sm">
                                                                                                                    คลิก "เพิ่มบล็อก" เพื่อเพิ่มข้อมูล
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        ) : (
                                                                                                            (floor.blocks || []).map((_block: any, blkIdx: number) => {
                                                                                                                const updateBlock = (field: string, value: any) => {
                                                                                                                    const newBlocks = [...(floor.blocks || [])];
                                                                                                                    newBlocks[blkIdx] = { ...newBlocks[blkIdx], [field]: value };
                                                                                                                    if (field === 'width' || field === 'length') {
                                                                                                                        const width = field === 'width' ? Number(value) : Number(_block.width || 0);
                                                                                                                        const length = field === 'length' ? Number(value) : Number(_block.length || 0);
                                                                                                                        newBlocks[blkIdx].area = (width * length).toString();
                                                                                                                    }
                                                                                                                    const floorTotal = newBlocks.reduce((sum: number, b: any) => sum + (Number(b.area) || 0), 0);
                                                                                                                    const newFloors = [...(building.floors || [])];
                                                                                                                    newFloors[fIdx] = { ...newFloors[fIdx], blocks: newBlocks, totalArea: floorTotal.toString() };
                                                                                                                    updateFloors(newFloors);
                                                                                                                };

                                                                                                                return (
                                                                                                                    <TableRow key={_block.id || blkIdx} className="hover:bg-transparent">
                                                                                                                        <TableCell className="text-center align-middle text-xs font-medium">
                                                                                                                            {blkIdx + 1}
                                                                                                                        </TableCell>
                                                                                                                        <TableCell className="align-top">
                                                                                                                            <Input
                                                                                                                                type="text"
                                                                                                                                value={_block.zoneDetails || ""}
                                                                                                                                onChange={(e) => updateBlock('zoneDetails', e.target.value)}
                                                                                                                                className="h-9 rounded-lg text-sm bg-white"
                                                                                                                                placeholder="เช่น ห้อง A"
                                                                                                                            />
                                                                                                                        </TableCell>
                                                                                                                        <TableCell className="align-top">
                                                                                                                            <Input
                                                                                                                                type="number"
                                                                                                                                value={_block.width || ""}
                                                                                                                                onChange={(e) => updateBlock('width', e.target.value)}
                                                                                                                                className="h-9 rounded-lg text-sm bg-white"
                                                                                                                                placeholder="0"
                                                                                                                            />
                                                                                                                        </TableCell>
                                                                                                                        <TableCell className="align-top">
                                                                                                                            <Input
                                                                                                                                type="number"
                                                                                                                                value={_block.length || ""}
                                                                                                                                onChange={(e) => updateBlock('length', e.target.value)}
                                                                                                                                className="h-9 rounded-lg text-sm bg-white"
                                                                                                                                placeholder="0"
                                                                                                                            />
                                                                                                                        </TableCell>
                                                                                                                        <TableCell className="align-top">
                                                                                                                            <Input
                                                                                                                                disabled
                                                                                                                                value={_block.area || "0"}
                                                                                                                                className="h-9 rounded-lg text-sm bg-gray-50 text-right font-medium"
                                                                                                                            />
                                                                                                                        </TableCell>
                                                                                                                        <TableCell className="text-right align-middle">
                                                                                                                            {(floor.blocks || []).length > 1 && (
                                                                                                                                <Button
                                                                                                                                    type="button"
                                                                                                                                    variant="ghost"
                                                                                                                                    size="icon"
                                                                                                                                    onClick={() => {
                                                                                                                                        const newBlocks = (floor.blocks || []).filter((_: any, i: number) => i !== blkIdx);
                                                                                                                                        const floorTotal = newBlocks.reduce((sum: number, b: any) => sum + (Number(b.area) || 0), 0);
                                                                                                                                        const newFloors = [...(building.floors || [])];
                                                                                                                                        newFloors[fIdx] = { ...newFloors[fIdx], blocks: newBlocks, totalArea: floorTotal.toString() };
                                                                                                                                        updateFloors(newFloors);
                                                                                                                                    }}
                                                                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                                                                                                                                >
                                                                                                                                    <Trash2 className="w-4 h-4" />
                                                                                                                                </Button>
                                                                                                                            )}
                                                                                                                        </TableCell>
                                                                                                                    </TableRow>
                                                                                                                );
                                                                                                            })
                                                                                                        )}
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>

                                                                            {/* Building totals */}
                                                                            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                                                                                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                                                                    <span className="text-sm font-semibold text-emerald-900">รวมพื้นที่สิ่งปลูกสร้าง</span>
                                                                                    <span className="text-sm font-bold text-emerald-700">
                                                                                        {(() => {
                                                                                            const totalArea = (building.floors || []).reduce((sum: number, f: any) => {
                                                                                                const floorArea = (f.blocks || []).reduce((blockSum: number, b: any) => blockSum + (Number(b.area) || 0), 0);
                                                                                                return sum + floorArea;
                                                                                            }, 0);
                                                                                            return totalArea.toLocaleString('en-US', { maximumFractionDigits: 2 });
                                                                                        })()} ตร.ม.
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                                                                    <span className="text-sm font-semibold text-blue-900">ราคาประเมินสิ่งปลูกสร้าง</span>
                                                                                    <span className="text-sm font-bold text-blue-700">
                                                                                        {(() => {
                                                                                            const totalArea = (building.floors || []).reduce((sum: number, f: any) => sum + (Number(f.totalArea) || 0), 0);
                                                                                            const pricePerSqm = Number(building.appraisalPrice || 0);
                                                                                            const totalPrice = totalArea * pricePerSqm;
                                                                                            return totalPrice.toLocaleString();
                                                                                        })()} บาท
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )}
                                            </Accordion>

                                            {/* ราคาประเมินสินทรัพย์ Summary */}
                                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                                {(() => {
                                                    const landAppraisal = Number(methodData.totalLandAppraisal || 0);
                                                    const buildingAppraisal = (methodData.buildings || []).reduce((sum: number, b: any) => {
                                                        const totalArea = (b.floors || []).reduce((floorSum: number, f: any) => floorSum + (Number(f.totalArea) || 0), 0);
                                                        const pricePerSqm = Number(b.appraisalPrice || 0);
                                                        return sum + (totalArea * pricePerSqm);
                                                    }, 0);
                                                    const totalAppraisal = landAppraisal + buildingAppraisal;

                                                    return (
                                                        <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-400 rounded-lg px-4 py-3">
                                                            <span className="text-sm font-bold text-amber-900">ราคาประเมินสินทรัพย์</span>
                                                            <span className="text-lg font-bold text-amber-700">
                                                                {totalAppraisal.toLocaleString()} บาท
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SECTION: ประเมินความสามารถลูกค้า */}
                <Card className="border-border-strong overflow-hidden mb-6">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                            <UserCheck className="w-5 h-5" />
                            ข้อมูลทรัพย์สินอื่นๆ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-8">
                            {/* Question 1: อื่นๆ */}
                            <div className="space-y-4">
                                <Label className="text-base font-bold text-gray-800">มีรถยนต์ หรือมอเตอร์ไซค์ คันอื่นๆเพิ่มหรือไม่</Label>
                                <RadioGroup
                                    value={formData.hasOtherVehicles || "no"}
                                    onValueChange={(val) => setFormData({ ...formData, hasOtherVehicles: val })}
                                    className="flex items-center gap-6"
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                        <RadioGroupItem value="no" id="v-no" className="border-gray-300 text-chaiyo-blue h-5 w-5" />
                                        <Label htmlFor="v-no" className="font-bold text-gray-600 cursor-pointer uppercase">ไม่มี</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                        <RadioGroupItem value="yes" id="v-yes" className="border-gray-300 text-chaiyo-blue h-5 w-5" />
                                        <Label htmlFor="v-yes" className="font-bold text-gray-600 cursor-pointer text-chaiyo-blue uppercase">มี</Label>
                                    </div>
                                </RadioGroup>

                                {formData.hasOtherVehicles === "yes" && (
                                    <div className="pl-6 border-l-2 border-blue-100 space-y-4 animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex justify-end gap-2 mb-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={(formData.otherVehicles || []).length >= 20}
                                                onClick={() => {
                                                    const currentVehicles = formData.otherVehicles || [];
                                                    if (currentVehicles.length < 20) {
                                                        setFormData({
                                                            ...formData,
                                                            otherVehicles: [...currentVehicles, { id: Date.now(), carNumber: (currentVehicles.length + 1).toString(), type: "", brand: "", model: "", status: "" }]
                                                        });
                                                    }
                                                }}
                                                className="text-xs gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> เพิ่ม ({(formData.otherVehicles || []).length}/20)
                                            </Button>
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-gray-50/80">
                                                    <TableRow>
                                                        <TableHead className="w-[60px] text-center text-xs">คันที่</TableHead>
                                                        <TableHead className="text-xs">ประเภทรถ</TableHead>
                                                        <TableHead className="text-xs">ยี่ห้อรถ</TableHead>
                                                        <TableHead className="text-xs">รถใช้สำหรับ</TableHead>
                                                        <TableHead className="text-xs">สถานะสินทรัพย์</TableHead>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(formData.otherVehicles || []).length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-6 text-gray-400 text-sm">
                                                                คลิก "เพิ่ม" เพื่อเพิ่มข้อมูลรถยนต์
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        (formData.otherVehicles || []).map((vehicle: any, idx: number) => (
                                                            <TableRow key={vehicle.id || idx} className="hover:bg-transparent">
                                                                <TableCell className="text-center align-middle text-xs font-medium">
                                                                    {idx + 1}
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={vehicle.type || ""}
                                                                        onValueChange={(value) => {
                                                                            const newVehicles = [...(formData.otherVehicles || [])];
                                                                            newVehicles[idx] = { ...newVehicles[idx], type: value };
                                                                            setFormData({ ...formData, otherVehicles: newVehicles });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {CAR_TYPES.map((type) => (
                                                                                <SelectItem key={type.value} value={type.value}>
                                                                                    {type.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={vehicle.brand || ""}
                                                                        onValueChange={(value) => {
                                                                            const newVehicles = [...(formData.otherVehicles || [])];
                                                                            newVehicles[idx] = { ...newVehicles[idx], brand: value };
                                                                            setFormData({ ...formData, otherVehicles: newVehicles });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {CAR_BRANDS.map((brand) => (
                                                                                <SelectItem key={brand.value} value={brand.label}>
                                                                                    {brand.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={vehicle.usageType || ""}
                                                                        onValueChange={(value) => {
                                                                            const newVehicles = [...(formData.otherVehicles || [])];
                                                                            newVehicles[idx] = { ...newVehicles[idx], usageType: value };
                                                                            setFormData({ ...formData, otherVehicles: newVehicles });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ประกอบอาชีพ">ประกอบอาชีพ</SelectItem>
                                                                            <SelectItem value="ใช้เพื่อการเดินทาง">ใช้เพื่อการเดินทาง</SelectItem>
                                                                            <SelectItem value="ปฏิเสธการให้ข้อมูล">ปฏิเสธการให้ข้อมูล</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={vehicle.status || ""}
                                                                        onValueChange={(value) => {
                                                                            const newVehicles = [...(formData.otherVehicles || [])];
                                                                            newVehicles[idx] = { ...newVehicles[idx], status: value };
                                                                            setFormData({ ...formData, otherVehicles: newVehicles });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ปลอดภาระ">ปลอดภาระ</SelectItem>
                                                                            <SelectItem value="ติดไฟแนนซ์">ติดไฟแนนซ์</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="text-right align-middle">
                                                                    {(formData.otherVehicles || []).length > 0 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                const newVehicles = (formData.otherVehicles || []).filter((_: any, i: number) => i !== idx);
                                                                                setFormData({ ...formData, otherVehicles: newVehicles });
                                                                            }}
                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Question 2: ที่ดินอื่นๆ */}
                            <div className="space-y-4">
                                <Label className="text-base font-bold text-gray-800">มีที่ดินอื่นๆ เพิ่มหรือไม่</Label>
                                <RadioGroup
                                    value={formData.hasOtherLands || "no"}
                                    onValueChange={(val) => setFormData({ ...formData, hasOtherLands: val })}
                                    className="flex items-center gap-6"
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                        <RadioGroupItem value="no" id="l-no" className="border-gray-300 text-chaiyo-blue h-5 w-5" />
                                        <Label htmlFor="l-no" className="font-bold text-gray-600 cursor-pointer uppercase">ไม่มี</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                        <RadioGroupItem value="yes" id="l-yes" className="border-gray-300 text-chaiyo-blue h-5 w-5" />
                                        <Label htmlFor="l-yes" className="font-bold text-gray-600 cursor-pointer text-chaiyo-blue uppercase">มี</Label>
                                    </div>
                                </RadioGroup>

                                {formData.hasOtherLands === "yes" && (
                                    <div className="pl-6 border-l-2 border-green-100 space-y-4 animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex justify-end gap-2 mb-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={(formData.otherLands || []).length >= 20}
                                                onClick={() => {
                                                    const currentLands = formData.otherLands || [];
                                                    if (currentLands.length < 20) {
                                                        setFormData({
                                                            ...formData,
                                                            otherLands: [...currentLands, { id: Date.now(), landNumber: (currentLands.length + 1).toString(), landUse: "", status: "" }]
                                                        });
                                                    }
                                                }}
                                                className="text-xs gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> เพิ่ม ({(formData.otherLands || []).length}/20)
                                            </Button>
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-gray-50/80">
                                                    <TableRow>
                                                        <TableHead className="w-[100px] text-center text-xs">แปลงที่</TableHead>
                                                        <TableHead className="text-xs">ที่ดินใช้สำหรับ</TableHead>
                                                        <TableHead className="text-xs">สถานะสินทรัพย์</TableHead>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(formData.otherLands || []).length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-gray-400 text-sm">
                                                                คลิก "เพิ่ม" เพื่อเพิ่มข้อมูลที่ดิน
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        (formData.otherLands || []).map((land: any, idx: number) => (
                                                            <TableRow key={land.id || idx} className="hover:bg-transparent">
                                                                <TableCell className="text-center align-middle text-xs font-medium">
                                                                    {idx + 1}
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={land.landUse || ""}
                                                                        onValueChange={(value) => {
                                                                            const newLands = [...(formData.otherLands || [])];
                                                                            newLands[idx] = { ...newLands[idx], landUse: value };
                                                                            setFormData({ ...formData, otherLands: newLands });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {LAND_USE_TYPES.map((use) => (
                                                                                <SelectItem key={use.value} value={use.value}>
                                                                                    {use.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="align-top">
                                                                    <Select
                                                                        value={land.status || ""}
                                                                        onValueChange={(value) => {
                                                                            const newLands = [...(formData.otherLands || [])];
                                                                            newLands[idx] = { ...newLands[idx], status: value };
                                                                            setFormData({ ...formData, otherLands: newLands });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-9 rounded-lg text-sm bg-white">
                                                                            <SelectValue placeholder="เลือก" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ปลอดภาระ">ปลอดภาระ</SelectItem>
                                                                            <SelectItem value="ติดไฟแนนซ์">ติดไฟแนนซ์</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="text-right align-middle">
                                                                    {(formData.otherLands || []).length > 0 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                const newLands = (formData.otherLands || []).filter((_: any, i: number) => i !== idx);
                                                                                setFormData({ ...formData, otherLands: newLands });
                                                                            }}
                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 3: ราคาประเมินสินทรัพย์ */}

                {(formData.collateralType === 'car' || formData.collateralType === 'land') && (
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <Calculator className="w-5 h-5" />
                                ราคาประเมินสินทรัพย์
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">


                                {formData.collateralType === 'land' ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                        <Label className="text-base font-bold text-gray-700">ราคาประเมิน/เรทบุ๊ค</Label>
                                        <div className="text-2xl font-bold text-chaiyo-blue">
                                            550,000 <span className="text-sm text-muted-foreground ml-1">บาท</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>

            {/* Photo Guideline Dialog */}
            <Dialog open={photoGuideDialogOpen} onOpenChange={setPhotoGuideDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            รายการรูปถ่ายที่ต้องใช้
                        </DialogTitle>
                        <DialogDescription>
                            กรุณาถ่ายรูปตามรายการด้านล่างให้ครบถ้วน
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        {getPhotoDocs(formData.collateralType).map((doc, idx) => {
                            const isCompleted = idx < analyzedPhotoCount;
                            return (
                                <div key={idx} className={cn(
                                    "p-3 rounded-lg border transition-colors",
                                    isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
                                )}>
                                    <div className="flex items-start gap-2.5 mb-2">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                                        )}
                                        <span className={cn(
                                            "text-[13px] font-medium leading-tight",
                                            isCompleted ? "text-emerald-700" : "text-gray-700"
                                        )}>
                                            {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                        </span>
                                    </div>
                                    {doc.guideline && (
                                        <p className={cn(
                                            "text-[11px] leading-relaxed ml-6",
                                            isCompleted ? "text-emerald-600" : "text-gray-600"
                                        )}>
                                            {doc.guideline}
                                        </p>
                                    )}
                                    {doc.example && (
                                        <div className="ml-6 mt-2 bg-white rounded border border-gray-200 overflow-hidden">
                                            <img
                                                src={doc.example}
                                                alt={doc.label}
                                                className="w-full h-auto max-h-40 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Paper Guideline Dialog */}
            <Dialog open={paperGuideDialogOpen} onOpenChange={setPaperGuideDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            รายการเอกสารที่ต้องใช้
                        </DialogTitle>
                        <DialogDescription>
                            กรุณาถ่ายรูปหรือสแกนเอกสารตามรายการด้านล่างให้ครบถ้วน
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 pt-2">
                        {getPaperDocs(formData.collateralType, formData).map((doc, idx) => {
                            const isCompleted = idx < analyzedPaperCount;
                            return (
                                <div key={idx} className={cn(
                                    "flex items-start gap-2.5 text-[12px] font-medium leading-tight p-2.5 rounded-lg transition-colors",
                                    isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600"
                                )}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                                    )}
                                    <span>{doc.label} {doc.required && <span className="text-red-500">*</span>}</span>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Example Photo Modal */}
            <Dialog open={examplePhotoDialog.open} onOpenChange={(open) => setExamplePhotoDialog({ ...examplePhotoDialog, open })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            ตัวอย่างรูปถ่าย
                        </DialogTitle>
                        <DialogDescription>
                            {examplePhotoDialog.label}
                        </DialogDescription>
                    </DialogHeader>
                    {examplePhotoDialog.example && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <img
                                src={examplePhotoDialog.example}
                                alt={examplePhotoDialog.label}
                                className="w-full max-w-md max-h-96 object-contain rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Photo Info Dialog */}
            <Dialog open={photoInfoDialog.open} onOpenChange={(open) => setPhotoInfoDialog({ ...photoInfoDialog, open })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {photoInfoDialog.label}
                        </DialogTitle>
                        <DialogDescription>
                            รายละเอียดการถ่ายรูปถ่าย
                        </DialogDescription>
                    </DialogHeader>
                    {photoInfoDialog.guideline && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {photoInfoDialog.guideline}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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

                        <div className="mt-6 px-6 py-4 bg-white/10 rounded-2xl backdrop-blur-md max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <Select
                                value={typeof uploadedPhotos[lightboxIndex as number] === 'string' ? "อื่นๆ" : (uploadedPhotos[lightboxIndex as number]?.label || "อื่นๆ")}
                                onValueChange={(val) => {
                                    const newPhotos: any[] = [...uploadedPhotos];
                                    const photoIdx = lightboxIndex as number;
                                    if (typeof newPhotos[photoIdx] === 'string') {
                                        newPhotos[photoIdx] = { url: newPhotos[photoIdx], label: val };
                                    } else {
                                        newPhotos[photoIdx] = { ...newPhotos[photoIdx], label: val };
                                    }
                                    setUploadedPhotos(newPhotos);
                                }}
                            >
                                <SelectTrigger className="bg-white text-gray-900 border-white/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {getPhotoDocs(formData.collateralType).map((doc: any, idx: number) => (
                                        <SelectItem key={idx} value={doc.label}>
                                            {doc.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
            {/* Delete Owner Confirmation Dialog */}
            <AlertDialog open={!!deleteOwnerConfirm} onOpenChange={(open) => !open && setDeleteOwnerConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูลผู้ถือครอง &quot;{deleteOwnerConfirm?.name}&quot; ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (!deleteOwnerConfirm) return;
                                if (deleteOwnerConfirm.type === 'land') {
                                    const newOwners = (formData.landOwners || []).filter((_: any, i: number) => i !== deleteOwnerConfirm.ownerIdx);
                                    setFormData({ ...formData, landOwners: newOwners });
                                } else if (deleteOwnerConfirm.type === 'building' && deleteOwnerConfirm.buildingIdx !== undefined) {
                                    const newBuildingOwners = [...(formData.buildingOwners || [])];
                                    newBuildingOwners[deleteOwnerConfirm.buildingIdx] = (newBuildingOwners[deleteOwnerConfirm.buildingIdx] || []).filter((_: any, i: number) => i !== deleteOwnerConfirm.ownerIdx);
                                    setFormData({ ...formData, buildingOwners: newBuildingOwners });
                                }
                                setDeleteOwnerConfirm(null);
                            }}
                        >
                            ลบข้อมูล
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Coordinate Modal Dialog */}
            <Dialog open={coordinateModalOpen} onOpenChange={setCoordinateModalOpen}>
                <DialogContent className="sm:max-w-md p-6">
                    <DialogHeader className="pb-4">
                        <DialogTitle>ตั้งตำแหน่งที่ดิน</DialogTitle>
                        <DialogDescription>
                            ป้อนพิกัด lat, long โดยตรง
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Merged Coordinates Input */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">พิกัด (ละติจูด, ลองจิจูด)</Label>
                            <Input
                                placeholder="เช่น 14.352519, 100.562641"
                                value={searchLat && searchLng ? `${searchLat}, ${searchLng}` : ""}
                                onChange={(e) => {
                                    const coords = e.target.value.split(",").map(c => c.trim());
                                    if (coords.length === 2) {
                                        setSearchLat(coords[0]);
                                        setSearchLng(coords[1]);
                                    } else if (coords.length === 1) {
                                        setSearchLat(coords[0]);
                                        setSearchLng("");
                                    }
                                }}
                                className="h-10 border-gray-200"
                            />
                            <p className="text-xs text-gray-500">สามารถคัดลอก lat, lng จาก Google Maps ได้ (แยกด้วยเครื่องหมายจุลภาค)</p>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCoordinateModalOpen(false)}
                            className="h-9 text-sm"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (searchLat && searchLng) {
                                    const lat = parseFloat(searchLat);
                                    const lng = parseFloat(searchLng);
                                    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                                        setFormData({
                                            ...formData,
                                            landLat: searchLat,
                                            landLng: searchLng
                                        });
                                        setCoordinateModalOpen(false);
                                        toast.success("บันทึกพิกัดสำเร็จ");
                                    } else {
                                        toast.error("พิกัดไม่ถูกต้อง กรุณาตรวจสอบค่า lat/lng");
                                    }
                                } else {
                                    toast.error("กรุณาป้อนพิกัด lat, lng");
                                }
                            }}
                            className="h-9 text-sm bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                        >
                            บันทึก
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hidden file input for categorized photo uploads */}
            <input
                type="file"
                ref={categoryPhotoInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleCategoryPhotoUpload}
            />

            {/* Hidden camera input for collateral photo uploads */}
            <input
                type="file"
                ref={categoryCameraRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleCategoryPhotoUpload}
            />
        </div>
    );
}
