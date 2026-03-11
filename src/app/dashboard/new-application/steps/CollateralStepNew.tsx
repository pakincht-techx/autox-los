// Merged Collateral Step - Replaced with Pre-question style UI
"use client";

import { useState, useEffect, useRef } from "react";
import {
    Car, Bike, Truck, Tractor, Map, Sparkles, Upload, FileText,
    Check, Loader2, AlertCircle, Camera, Book, X, Plus,
    ChevronLeft, ChevronRight, Eye, UserCheck, Calculator, ShieldCheck,
    CheckCircle2, AlertTriangle, FilePlus
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
        { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่/รถสองแถว/รถรับส่งผู้โดยสาร/รถอาสามูลนิธิ' },
        { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
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
        { id: 'car_q17', text: 'เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่' },
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
    { value: "หนังสือรับรองจากสำนักงานที่ดิน", label: "หนังสือรับรองจากสำนักงานที่ดิน" },
    { value: "ใบประเมินราคาจากบริษัทภายนอก", label: "ใบประเมินราคาจากบริษัทภายนอก" },
    { value: "ราคาประเมินจากกรมธนารักษ์", label: "ราคาประเมินจากกรมธนารักษ์" }
];

const createDefaultBlock = () => ({ id: crypto.randomUUID(), width: "", length: "", area: "" });
const createDefaultFloor = () => ({ id: crypto.randomUUID(), blocks: [], totalArea: "" });
const createDefaultOwner = () => ({ id: crypto.randomUUID(), isBorrower: false, name: "", lastName: "", relationship: "" });
const createDefaultBuilding = () => ({
    id: crypto.randomUUID(),
    appraisalPrice: "",
    floors: [createDefaultFloor()],
    totalBuildingArea: "",
    priceBeforeDepreciation: "",
    depreciation: "",
    priceAfterDepreciation: "",
    totalIncludingUnits: "",
    age: "",
    hasRenovation: false,
    renovationYear: ""
});
const createDefaultAppraisalMethod = (method: string) => ({
    method,
    companyName: "",
    appraisalDate: "",
    landPricePerWah: "",
    landAreaWah: "",
    totalLandAppraisal: "",
    totalBuildingArea: "",
    buildings: []
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

const OWNERSHIP_TYPES = [
    { value: "กรรมสิทธิ์เดี่ยว", label: "กรรมสิทธิ์เดี่ยว" },
    { value: "กรรมสิทธิ์ร่วม", label: "กรรมสิทธิ์ร่วม" },
    { value: "อื่น ๆ", label: "อื่น ๆ" }
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
        { label: "รูปหลังรถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์", required: true },
        { label: "รูปหน้ารถ - เฉียงซ้าย45องศา", required: true },
        { label: "รูปหน้ารถ - เฉียงขวา45องศา", required: true },
        { label: "รูปหลังรถ - เฉียงซ้าย45องศา", required: true },
        { label: "รูปหลังรถ - เฉียงขวา45องศา", required: true },
        { label: "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ", required: true },
        { label: "รูปเลขตัวถัง/คัสซี", required: true }
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
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]); // For old compatibility if needed, but we'll use below
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // New upload states
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [uploadedPaperDocs, setUploadedPaperDocs] = useState<string[]>([]);
    const [analyzedPhotoCount, setAnalyzedPhotoCount] = useState(0);
    const [analyzedPaperCount, setAnalyzedPaperCount] = useState(0);

    // Refs
    const photoInputRef = useRef<HTMLInputElement>(null);
    const photoCameraRef = useRef<HTMLInputElement>(null);
    const paperInputRef = useRef<HTMLInputElement>(null);
    const paperCameraRef = useRef<HTMLInputElement>(null);

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
                chassisNumber: formData.chassisNumber || "MRHFC16501P000001",
                location: formData.location || "กรุงเทพมหานคร",
                selectedAppraisalMethods: formData.selectedAppraisalMethods || ["หนังสือรับรองจากสำนักงานที่ดิน"],
                appraisalMethodsData: formData.appraisalMethodsData || {
                    "หนังสือรับรองจากสำนักงานที่ดิน": createDefaultAppraisalMethod("หนังสือรับรองจากสำนักงานที่ดิน")
                },
                grandTotalAppraisal: formData.grandTotalAppraisal || "",
                landSeizedStatus: formData.landSeizedStatus || "ปกติ",
                landReplacementStatus: formData.landReplacementStatus || "ปกติ",
                villageName: formData.villageName || ""
            });
        }
    }, []);
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newPhotos: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = URL.createObjectURL(files[i]);
            newPhotos.push(url);
        }

        const currentPhotoCount = uploadedPhotos.length;
        setUploadedPhotos((prev: string[]) => [...prev, ...newPhotos]);
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

        const newDocs: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = URL.createObjectURL(files[i]);
            newDocs.push(url);
        }

        setUploadedPaperDocs((prev: string[]) => [...prev, ...newDocs]);
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
        const urlToRemove = uploadedPhotos[idx];
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
        setUploadedPhotos((prev: string[]) => prev.filter((_, i) => i !== idx));
        setAnalyzedPhotoCount(prev => Math.max(0, prev - 1));
    };

    const handleRemovePaper = (idx: number) => {
        const urlToRemove = uploadedPaperDocs[idx];
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
        setUploadedPaperDocs((prev: string[]) => prev.filter((_, i) => i !== idx));
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

                            {/* PHOTO UPLOAD SECTION */}
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Checklist Column */}
                                    <div className="w-full md:w-80 shrink-0 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-chaiyo-blue" />
                                                1.1 รายการรูปถ่ายที่ต้องใช้
                                            </h4>
                                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-chaiyo-blue border-blue-100">
                                                {analyzedPhotoCount} / {getPhotoDocs(formData.collateralType).length} รูป
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl border border-border-subtle p-3 space-y-2.5">
                                            {getPhotoDocs(formData.collateralType).map((doc, idx) => {
                                                const isCompleted = idx < analyzedPhotoCount;
                                                return (
                                                    <div key={idx} className={cn(
                                                        "flex items-start gap-2.5 text-[11px] font-medium leading-tight p-2 rounded-lg transition-colors",
                                                        isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500 border border-transparent shadow-sm"
                                                    )}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" />
                                                        ) : (
                                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0 mt-0.5" />
                                                        )}
                                                        <span>{doc.label} {doc.required && <span className="text-red-500">*</span>}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Upload Area Column */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                ref={photoInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotoUpload}
                                            />
                                            <input
                                                type="file"
                                                ref={photoCameraRef}
                                                className="hidden"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handlePhotoUpload}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => photoInputRef.current?.click()}
                                                className="flex-1 md:flex-none h-11 rounded-xl border-dashed border-2 hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all font-bold group"
                                                disabled={isAnalyzing}
                                            >
                                                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                เลือกรูปภาพ
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => photoCameraRef.current?.click()}
                                                className="flex-1 md:flex-none h-11 rounded-xl border-dashed border-2 hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all font-bold group"
                                                disabled={isAnalyzing}
                                            >
                                                <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                เปิดกล้อง
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 min-h-[160px]">
                                            {uploadedPhotos.length === 0 ? (
                                                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-60">
                                                    <FilePlus className="w-8 h-8" />
                                                    <p className="text-xs font-medium italic">ยังไม่มีการอัพโหลดรูปถ่าย</p>
                                                </div>
                                            ) : (
                                                uploadedPhotos.map((doc, idx) => (
                                                    <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border-strong group shadow-sm bg-white">
                                                        <img src={doc} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => { setLightboxIndex(idx); setUploadedDocs(uploadedPhotos); }}
                                                                className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full border border-white/30 backdrop-blur-sm text-white"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemovePhoto(idx)}
                                                                className="p-1.5 bg-white/20 hover:bg-red-500 rounded-full border border-white/30 backdrop-blur-sm text-white"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        {idx >= analyzedPhotoCount && isAnalyzing && (
                                                            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                                                <Loader2 className="w-6 h-6 text-chaiyo-blue animate-spin" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PAPER DOCS UPLOAD SECTION */}
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Checklist Column */}
                                    <div className="w-full md:w-80 shrink-0 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <Book className="w-4 h-4 text-emerald-600" />
                                                1.2 รายการเอกสารที่ต้องใช้
                                            </h4>
                                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100">
                                                {analyzedPaperCount} / {getPaperDocs(formData.collateralType, formData).length} ชุด
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl border border-border-subtle p-3 space-y-2.5">
                                            {getPaperDocs(formData.collateralType, formData).map((doc, idx) => {
                                                const isCompleted = idx < analyzedPaperCount;
                                                return (
                                                    <div key={idx} className={cn(
                                                        "flex items-start gap-2.5 text-[11px] font-medium leading-tight p-2 rounded-lg transition-colors",
                                                        isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500 border border-transparent shadow-sm"
                                                    )}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" />
                                                        ) : (
                                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0 mt-0.5" />
                                                        )}
                                                        <span>{doc.label} {doc.required && <span className="text-red-500">*</span>}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Upload Area Column */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
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
                                                className="flex-1 md:flex-none h-11 rounded-xl border-dashed border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all font-bold group"
                                                disabled={isAnalyzing}
                                            >
                                                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                อัพโหลดเอกสาร
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => paperCameraRef.current?.click()}
                                                className="flex-1 md:flex-none h-11 rounded-xl border-dashed border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all font-bold group"
                                                disabled={isAnalyzing}
                                            >
                                                <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                เปิดกล้อง
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 min-h-[160px]">
                                            {uploadedPaperDocs.length === 0 ? (
                                                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-60">
                                                    <FilePlus className="w-8 h-8" />
                                                    <p className="text-xs font-medium italic">ยังไม่มีการอัพโหลดเอกสาร</p>
                                                </div>
                                            ) : (
                                                uploadedPaperDocs.map((doc, idx) => (
                                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border-strong group shadow-sm bg-white">
                                                        {doc.endsWith('.pdf') ? (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 gap-1.5 p-2">
                                                                <FileText className="w-8 h-8" />
                                                                <span className="text-[8px] font-bold truncate w-full text-center">PDF Document</span>
                                                            </div>
                                                        ) : (
                                                            <img src={doc} alt={`paper-${idx}`} className="w-full h-full object-cover" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => { setLightboxIndex(idx); setUploadedDocs(uploadedPaperDocs); }}
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
                                                ))
                                            )}
                                        </div>
                                    </div>
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
                                                <input
                                                    type="checkbox"
                                                    id="landLocationNotFound"
                                                    checked={formData.landLocationNotFound === "yes" || false}
                                                    onChange={(e) => setFormData({ ...formData, landLocationNotFound: e.target.checked ? "yes" : "" })}
                                                    className="w-4 h-4 rounded border-gray-300 text-chaiyo-blue cursor-pointer"
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
                                        {formData.landDeedType !== "น.ส. 4" && (
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
                                        {formData.landDeedType !== "น.ส. 4" && (
                                            <>
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
                                            </>
                                        )}
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">หน้าสำรวจ</Label>
                                            <Input
                                                value={formData.landSurveyPage || ""}
                                                onChange={(e) => setFormData({ ...formData, landSurveyPage: e.target.value })}
                                                className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

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
                                        {formData.landDeedType !== "น.ส. 4" && (
                                            <div className="space-y-1">
                                                <Label className="text-[13px] text-muted-foreground ml-1">พื้นที่ห้องชุด (ตารางเมตร) <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.landUnitArea || ""}
                                                    onChange={(e) => setFormData({ ...formData, landUnitArea: e.target.value })}
                                                    className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                                />
                                            </div>
                                        )}
                                    </div>

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
                                                value={formData.landUseType || ""}
                                                onValueChange={(val) => setFormData({ ...formData, landUseType: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue placeholder="เลือกการใช้ประโยชน์" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LAND_USE_TYPES.map((type) => (
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
                                                    {OWNERSHIP_TYPES.map((type) => (
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

                                                <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">พิกัดสถานที่ที่ดิน</span>
                                                    </div>

                                                    {formData.landLat && formData.landLng ? (
                                                        <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100">
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
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full text-chaiyo-blue hover:bg-blue-100"
                                                                onClick={() => window.open(`https://www.google.com/maps?q=${formData.landLat},${formData.landLng}`, '_blank')}
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] text-muted-foreground">ยังไม่ได้ระบุตำแหน่ง</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
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
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">เลข รย. <span className="text-red-500">*</span></Label>
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
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ลักษณะสภาพรถ</Label>
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
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ลักษณะ</Label>
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
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ประเภทการใช้งาน</Label>
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
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">เชื้อเพลิง</Label>
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
                                            <Select
                                                value={formData.location || "สำนักงานเขต"}
                                                onValueChange={(val) => setFormData({ ...formData, location: val })}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {OFFICE_LOCATIONS.map((loc) => (
                                                        <SelectItem key={loc.value} value={loc.value}>
                                                            {loc.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                </>
                            )}

                            {COLLATERAL_QUESTIONS[formData.collateralType]?.length > 0 && !(formData.collateralType === 'land' && formData.landDeedType === 'อ.ช. 2') && (
                                <div className="pt-8 border-t border-border-subtle mt-8">
                                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        เงื่อนไขการประเมินสภาพ{formData.collateralType === 'land' ? 'ทรัพย์สิน' : 'รถ'}
                                    </h4>
                                    <div className="space-y-2">
                                        {COLLATERAL_QUESTIONS[formData.collateralType]?.map((q) => (
                                            <div key={q.id}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
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
                                                {q.id === 'car_q16' && (
                                                    <div className="flex items-center gap-2 p-4 bg-blue-50/50 border border-blue-100 rounded-xl mt-2">
                                                        <input
                                                            type="checkbox"
                                                            id="vehicleVerified"
                                                            checked={formData.vehicleVerified || false}
                                                            onChange={(e) => setFormData({ ...formData, vehicleVerified: e.target.checked })}
                                                            className="w-4 h-4 rounded border-gray-300 text-chaiyo-blue cursor-pointer"
                                                        />
                                                        <label htmlFor="vehicleVerified" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            ตรวจสอบหลักประกันรถแล้ว
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-chaiyo-gold" />
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

                            {/* Group: ข้อมูลเจ้าของเดิม */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Book className="w-4 h-4 text-blue-500" />
                                        ข้อมูลเจ้าของเดิม
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const currentOwnerName = `${formData.ownerTitle || 'นาย'} ${formData.ownerFirstName || ''} ${formData.ownerLastName || ''}`.trim();
                                            setFormData({ ...formData, previousOwnerName: currentOwnerName });
                                        }}
                                        className="text-xs gap-1"
                                    >
                                        คัดลอกจากผู้ถือครองปัจจุบัน
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ความสัมพันธ์กับผู้กู้</Label>
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

                            {/* Group: ข้อมูลผู้ถือครอง/กรรมสิทธิ์ */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-blue-600" />
                                        ข้อมูลผู้ถือครอง/กรรมสิทธิ์ <span className="text-red-500">*</span>
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

                                {(formData.landOwners || []).map((owner: any, oIdx: number) => (
                                    <div key={owner.id || oIdx} className="border border-gray-200 rounded-lg p-3 space-y-3 bg-white mb-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={owner.isBorrower || false}
                                                    onChange={(e) => {
                                                        const newOwners = [...(formData.landOwners || [])];
                                                        newOwners[oIdx] = { ...newOwners[oIdx], isBorrower: e.target.checked };
                                                        setFormData({ ...formData, landOwners: newOwners });
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-chaiyo-blue cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700">เป็นผู้กู้</span>
                                            </label>
                                            {(formData.landOwners || []).length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newOwners = (formData.landOwners || []).filter((_: any, i: number) => i !== oIdx);
                                                        setFormData({ ...formData, landOwners: newOwners });
                                                    }}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                                                >
                                                    <X className="w-3 h-3" /> ลบ
                                                </Button>
                                            )}
                                        </div>

                                        {owner.isBorrower ? (
                                            <div className="space-y-1">
                                                <Label className="text-[12px] text-gray-600 ml-1">ชื่อผู้กู้</Label>
                                                <Input
                                                    disabled
                                                    value={formData.borrowerFirstName && formData.borrowerLastName ? `${formData.borrowerFirstName} ${formData.borrowerLastName}` : ""}
                                                    className="h-9 rounded-lg text-sm bg-gray-100 disabled:opacity-100"
                                                />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-[12px] text-gray-600 ml-1">ชื่อ <span className="text-red-500">*</span></Label>
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
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[12px] text-gray-600 ml-1">นามสกุล <span className="text-red-500">*</span></Label>
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
                                                </div>
                                            </div>
                                        )}

                                        {!owner.isBorrower && (
                                            <div className="space-y-1">
                                                <Label className="text-[12px] text-gray-600 ml-1">ความสัมพันธ์กับผู้กู้ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={owner.relationship || ""}
                                                    onValueChange={(value) => {
                                                        const newOwners = [...(formData.landOwners || [])];
                                                        newOwners[oIdx] = { ...newOwners[oIdx], relationship: value };
                                                        setFormData({ ...formData, landOwners: newOwners });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg text-sm">
                                                        <SelectValue placeholder="เลือกความสัมพันธ์" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {OWNER_RELATIONSHIPS.map(rel => (
                                                            <SelectItem key={rel.value} value={rel.value}>
                                                                {rel.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                ))}
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {APPRAISAL_METHODS.map(m => {
                                            const selected = (formData.selectedAppraisalMethods || []).includes(m.value);
                                            return (
                                                <button
                                                    key={m.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const current: string[] = formData.selectedAppraisalMethods || [];
                                                        let updated: string[];
                                                        const newData = { ...(formData.appraisalMethodsData || {}) };
                                                        if (selected) {
                                                            if (current.length <= 1) return; // min 1
                                                            updated = current.filter((v: string) => v !== m.value);
                                                            delete newData[m.value];
                                                        } else {
                                                            if (current.length >= 3) return; // max 3
                                                            updated = [...current, m.value];
                                                            if (!newData[m.value]) {
                                                                newData[m.value] = createDefaultAppraisalMethod(m.value);
                                                            }
                                                        }
                                                        setFormData({ ...formData, selectedAppraisalMethods: updated, appraisalMethodsData: newData });
                                                    }}
                                                    className={cn(
                                                        "flex h-10 items-center justify-center px-4 rounded-xl border cursor-pointer transition-all font-medium text-sm gap-2",
                                                        selected ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-sm" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {selected && <Check className="w-4 h-4" />}
                                                    {m.label}
                                                </button>
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
                                        setFormData({ ...formData, appraisalMethodsData: newData });
                                    };
                                    const updateBuildings = (buildings: any[]) => {
                                        const newData = { ...(formData.appraisalMethodsData || {}) };
                                        newData[methodKey] = { ...methodData, buildings };
                                        setFormData({ ...formData, appraisalMethodsData: newData });
                                    };

                                    return (
                                        <div key={methodKey} className="pt-4 border-t-2 border-chaiyo-blue/20">
                                            <h4 className="text-sm font-bold text-chaiyo-blue mb-4 flex items-center gap-2">
                                                <Badge className="bg-chaiyo-blue text-white text-xs">{methodIdx + 1}</Badge>
                                                {methodKey}
                                            </h4>

                                            {/* ชื่อบริษัทประเมิน - only for ใบประเมินราคาจากบริษัทภายนอก */}
                                            {methodKey === "ใบประเมินราคาจากบริษัทภายนอก" && (
                                                <div className="mb-4">
                                                    <div className="space-y-1 max-w-md">
                                                        <Label className="text-[13px] text-muted-foreground ml-1">ชื่อบริษัทประเมิน <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={methodData.companyName || ""}
                                                            onChange={(e) => updateMethodData('companyName', e.target.value)}
                                                            className="h-10 rounded-xl bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                            placeholder="ระบุชื่อบริษัทประเมิน"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Common fields per method */}
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
                                            </div>

                                            {/* สิ่งปลูกสร้าง section (max 5 per method, optional - min 0) */}
                                            <div className="mt-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                        <Plus className="w-4 h-4 text-emerald-500" />
                                                        สิ่งปลูกสร้าง (ไม่จำเป็น)
                                                    </h5>
                                                    {(methodData.buildings || []).length < 5 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateBuildings([...(methodData.buildings || []), createDefaultBuilding()])}
                                                            className="text-xs gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" /> เพิ่มสิ่งปลูกสร้าง ({(methodData.buildings || []).length}/5)
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
                                                                        <X className="w-3 h-3 mr-1" /> ลบ
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="space-y-1 max-w-md">
                                                                <Label className="text-[13px] text-muted-foreground ml-1">ราคาประเมินสิ่งปลูกสร้างต่อ ตร.ม. #{bIdx + 1} <span className="text-red-500">*</span></Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        value={building.appraisalPrice ? Number(building.appraisalPrice).toLocaleString() : ""}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value.replace(/,/g, '');
                                                                            if (/^\d*$/.test(val)) updateBuilding('appraisalPrice', val);
                                                                        }}
                                                                        className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                </div>
                                                            </div>


                                                            {/* Additional building details section */}
                                                            <div className="space-y-4 border-t border-gray-200 pt-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {/* Price before depreciation - Auto calculated */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">รวมราคาประเมินสิ่งปลูกสร้าง (ก่อนหักค่าเสื่อม) <span className="text-red-500">*</span></Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                disabled
                                                                                value={(() => {
                                                                                    const buildingArea = (building.floors || []).reduce((sum: number, f: any) => {
                                                                                        const floorArea = (f.blocks || []).reduce((blockSum: number, b: any) => blockSum + (Number(b.area) || 0), 0);
                                                                                        return sum + floorArea;
                                                                                    }, 0);
                                                                                    const pricePerSqm = Number(building.appraisalPrice || 0);
                                                                                    const totalPrice = buildingArea * pricePerSqm;
                                                                                    return totalPrice > 0 ? Number(totalPrice).toLocaleString() : "0";
                                                                                })()}
                                                                                className="h-10 rounded-xl bg-gray-100 border-gray-200 pr-10 text-right font-bold disabled:opacity-100"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Depreciation amount */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">หักค่าเสื่อมราคา</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={building.depreciation ? Number(building.depreciation).toLocaleString() : ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value.replace(/,/g, '');
                                                                                    if (/^\d*$/.test(val)) updateBuilding('depreciation', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                placeholder="0"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Price after depreciation - Auto calculated */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">ราคาประเมินสิ่งปลูกสร้างหลังหักค่าเสื่อม</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                disabled
                                                                                value={(() => {
                                                                                    const buildingArea = (building.floors || []).reduce((sum: number, f: any) => {
                                                                                        const floorArea = (f.blocks || []).reduce((blockSum: number, b: any) => blockSum + (Number(b.area) || 0), 0);
                                                                                        return sum + floorArea;
                                                                                    }, 0);
                                                                                    const pricePerSqm = Number(building.appraisalPrice || 0);
                                                                                    const totalPrice = buildingArea * pricePerSqm;
                                                                                    const depreciation = Number(building.depreciation || 0);
                                                                                    const priceAfter = totalPrice - depreciation;
                                                                                    return priceAfter > 0 ? Number(priceAfter).toLocaleString() : "0";
                                                                                })()}
                                                                                className="h-10 rounded-xl bg-gray-100 border-gray-200 pr-10 text-right font-bold disabled:opacity-100"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Total including units */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">ราคาประเมินรวมทั้งห้องชุด</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={building.totalIncludingUnits ? Number(building.totalIncludingUnits).toLocaleString() : ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value.replace(/,/g, '');
                                                                                    if (/^\d*$/.test(val)) updateBuilding('totalIncludingUnits', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                placeholder="0"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">บาท</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Building age */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">อายุสิ่งปลูกสร้าง</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                value={building.age || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(val)) updateBuilding('age', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 pr-10 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                placeholder="0"
                                                                            />
                                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ปี</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Renovation yes/no */}
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[13px] text-gray-600 ml-1">การรีโนเวท</Label>
                                                                        <div className="flex items-center gap-2 h-10">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => updateBuilding('hasRenovation', true)}
                                                                                className={cn(
                                                                                    "flex-1 rounded-lg border text-sm font-medium transition-all",
                                                                                    building.hasRenovation ? "bg-chaiyo-blue text-white border-chaiyo-blue" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                                                                )}
                                                                            >
                                                                                มี
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => updateBuilding('hasRenovation', false)}
                                                                                className={cn(
                                                                                    "flex-1 rounded-lg border text-sm font-medium transition-all",
                                                                                    !building.hasRenovation ? "bg-chaiyo-blue text-white border-chaiyo-blue" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                                                                )}
                                                                            >
                                                                                ไม่มี
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Renovation year - conditional */}
                                                                    {building.hasRenovation && (
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[13px] text-gray-600 ml-1">ปีที่รีโนเวทล่าสุด</Label>
                                                                            <Input
                                                                                value={building.renovationYear || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (/^\d*$/.test(val) && val.length <= 4) updateBuilding('renovationYear', val);
                                                                                }}
                                                                                className="h-10 rounded-xl bg-white border-gray-200 text-right focus:border-chaiyo-blue focus:ring-chaiyo-blue/20"
                                                                                placeholder="พ.ศ."
                                                                                maxLength={4}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* ชั้น section (max 10, min 1) */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-semibold text-gray-600">ชั้น</span>
                                                                    {(building.floors || []).length < 10 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => updateFloors([...(building.floors || []), createDefaultFloor()])}
                                                                            className="text-xs gap-1 h-7"
                                                                        >
                                                                            <Plus className="w-3 h-3" /> เพิ่มชั้น ({(building.floors || []).length}/10)
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                {(building.floors || []).map((floor: any, fIdx: number) => {
                                                                    const updateBlocks = (blocks: any[]) => {
                                                                        const newFloors = [...(building.floors || [])];
                                                                        newFloors[fIdx] = { ...newFloors[fIdx], blocks };
                                                                        updateFloors(newFloors);
                                                                    };

                                                                    return (
                                                                        <div key={floor.id || fIdx} className="border border-gray-100 rounded-lg p-3 bg-white space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs font-medium text-gray-600">ชั้นที่ {fIdx + 1}</span>
                                                                                <div className="flex items-center gap-1">
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
                                                                                            <X className="w-3 h-3" />
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* บล็อก section (max 10) with width/length/area fields */}
                                                                            <div className="space-y-2">
                                                                                {(floor.blocks || []).map((_block: any, blkIdx: number) => {
                                                                                    const updateBlock = (field: string, value: any) => {
                                                                                        const newBlocks = [...(floor.blocks || [])];
                                                                                        newBlocks[blkIdx] = { ...newBlocks[blkIdx], [field]: value };
                                                                                        // Auto-calc area
                                                                                        if (field === 'width' || field === 'length') {
                                                                                            const width = field === 'width' ? Number(value) : Number(_block.width || 0);
                                                                                            const length = field === 'length' ? Number(value) : Number(_block.length || 0);
                                                                                            newBlocks[blkIdx].area = (width * length).toString();
                                                                                        }
                                                                                        // Calc floor total
                                                                                        const floorTotal = newBlocks.reduce((sum: number, b: any) => sum + (Number(b.area) || 0), 0);
                                                                                        const newFloors = [...(building.floors || [])];
                                                                                        newFloors[fIdx] = { ...newFloors[fIdx], blocks: newBlocks, totalArea: floorTotal.toString() };
                                                                                        updateFloors(newFloors);
                                                                                    };

                                                                                    return (
                                                                                        <div key={_block.id || blkIdx} className="border border-gray-200 rounded-lg p-2 bg-blue-50/30 space-y-2">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <span className="text-xs font-semibold text-gray-700">บล็อก {blkIdx + 1}</span>
                                                                                                {(floor.blocks || []).length > 0 && (
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        variant="ghost"
                                                                                                        size="sm"
                                                                                                        onClick={() => {
                                                                                                            const newBlocks = (floor.blocks || []).filter((_: any, i: number) => i !== blkIdx);
                                                                                                            const floorTotal = newBlocks.reduce((sum: number, b: any) => sum + (Number(b.area) || 0), 0);
                                                                                                            const newFloors = [...(building.floors || [])];
                                                                                                            newFloors[fIdx] = { ...newFloors[fIdx], blocks: newBlocks, totalArea: floorTotal.toString() };
                                                                                                            updateFloors(newFloors);
                                                                                                        }}
                                                                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-6 px-1.5 text-xs"
                                                                                                    >
                                                                                                        <X className="w-3 h-3" />
                                                                                                    </Button>
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="grid grid-cols-3 gap-1">
                                                                                                <div className="space-y-0.5">
                                                                                                    <label className="text-xs text-gray-600">Width (ม.)</label>
                                                                                                    <Input value={_block.width || ""} onChange={(e) => updateBlock('width', e.target.value)} className="h-7 text-xs" type="number" />
                                                                                                </div>
                                                                                                <div className="space-y-0.5">
                                                                                                    <label className="text-xs text-gray-600">Length (ม.)</label>
                                                                                                    <Input value={_block.length || ""} onChange={(e) => updateBlock('length', e.target.value)} className="h-7 text-xs" type="number" />
                                                                                                </div>
                                                                                                <div className="space-y-0.5">
                                                                                                    <label className="text-xs text-gray-600">Area (ตร.ม.)</label>
                                                                                                    <Input disabled value={_block.area || "0"} className="h-7 text-xs bg-gray-100" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                                <div className="flex items-center gap-2">
                                                                                    {(floor.blocks || []).length < 10 && (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => updateBlocks([...(floor.blocks || []), createDefaultBlock()])}
                                                                                            className="text-xs gap-1 h-7 flex-1"
                                                                                        >
                                                                                            <Plus className="w-3 h-3" /> เพิ่มบล็อก ({(floor.blocks || []).length}/10)
                                                                                        </Button>
                                                                                    )}
                                                                                    {(floor.blocks || []).length > 0 && (
                                                                                        <div className="text-xs font-semibold text-chaiyo-blue bg-blue-50 px-2 py-1 rounded-lg">
                                                                                            รวม: {floor.totalArea || "0"} ตร.ม.
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Building totals */}
                                                            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                                                                {(building.floors || []).length > 0 && (
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
                                                                )}
                                                                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                                                    <span className="text-sm font-semibold text-blue-900">รวมราคาประเมินสิ่งปลูกสร้าง</span>
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

                                                {/* Summary totals across all buildings in method */}
                                                {(methodData.buildings || []).length > 0 && (
                                                    <div className="mt-4 pt-4 border-t-2 border-chaiyo-blue/30 space-y-2">
                                                        {(() => {
                                                            const buildingSummaries = (methodData.buildings || []).map((b: any) => {
                                                                const buildingArea = (b.floors || []).reduce((sum: number, f: any) => {
                                                                    const floorArea = (f.blocks || []).reduce((blockSum: number, blk: any) => blockSum + (Number(blk.area) || 0), 0);
                                                                    return sum + floorArea;
                                                                }, 0);
                                                                const pricePerSqm = Number(b.appraisalPrice || 0);
                                                                const buildingTotal = buildingArea * pricePerSqm;
                                                                return { buildingArea, pricePerSqm, buildingTotal };
                                                            });
                                                            const totalArea = buildingSummaries.reduce((sum: number, s: any) => sum + s.buildingArea, 0);
                                                            const totalPrice = buildingSummaries.reduce((sum: number, s: any) => sum + s.buildingTotal, 0);
                                                            const avgPricePerSqm = totalArea > 0 ? totalPrice / totalArea : 0;

                                                            return (
                                                                <>
                                                                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-lg px-4 py-3">
                                                                        <span className="text-sm font-bold text-emerald-900">รวมพื้นที่สิ่งปลูกสร้างทั้งหมด</span>
                                                                        <span className="text-lg font-bold text-emerald-700">
                                                                            {totalArea.toLocaleString('en-US', { maximumFractionDigits: 2 })} ตร.ม.
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg px-4 py-3">
                                                                        <span className="text-sm font-bold text-blue-900">รวมราคาประเมินสิ่งปลูกสร้างทั้งหมด</span>
                                                                        <span className="text-lg font-bold text-blue-700">
                                                                            {totalPrice.toLocaleString()} บาท
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-300 rounded-lg px-4 py-3">
                                                                        <span className="text-sm font-bold text-purple-900">ราคาเฉลี่ยต่อ ตร.ม.</span>
                                                                        <span className="text-lg font-bold text-purple-700">
                                                                            {avgPricePerSqm.toLocaleString('en-US', { maximumFractionDigits: 0 })} บาท/ตร.ม.
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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
