"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(
    () => import('@/components/ui/PdfViewer').then((mod) => mod.PdfViewer),
    { ssr: false }
);

import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, Camera, Check, Sparkles, Bike, Truck, Tractor, Map, Upload, Eye, EyeOff, X, ChevronRight, Plus, Minus, CreditCard, Gift, Shield, Percent, ArrowRight, Star, User, Banknote, ShieldCheck, AlertTriangle, CheckCircle, ChevronDown, Calculator, Wallet, Info } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { toast } from "sonner";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/Table";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Alert,
    AlertTitle,
    AlertDescription
} from "@/components/ui/alert";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const TENURE_OPTIONS: Record<string, number[]> = {
    moto: [12, 18, 24, 30, 36],
    car: [12, 18, 24, 30, 36, 42, 48, 54, 60],
    truck: [1, 2, 3, 4, 12, 18, 24, 30, 36, 42, 48, 54, 60],
    agri: [1, 2, 3, 4, 12, 18, 24, 30, 36, 42, 48, 54, 60, 72],
    land: [1, 2, 3, 4, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120]
};

const LAND_APPRAISAL_SOURCES = [
    { value: 'land_office', label: 'สำนักงานที่ดิน' },
    { value: 'external_appraisal', label: 'บริษัทประเมินภายนอก' }
];

const BUILDING_APPRAISAL_SOURCES = [
    { value: 'treasury_department', label: 'กรมธนารักษ์' },
    { value: 'external_appraisal', label: 'บริษัทประเมินภายนอก' }
];

const CONDO_APPRAISAL_SOURCES = [
    { value: 'land_office', label: 'สำนักงานที่ดิน' },
    { value: 'external_appraisal', label: 'บริษัทประเมินภายนอก' },
    { value: 'treasury_department', label: 'กรมธนารักษ์' }
];

const MOTO_PRODUCTS = [
    {
        code: 'ULMB',
        name: 'รถมอไซค์ปลอดภาระ',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 25,
        maxAge: 69,
        collateralStatus: ['clear'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '23.99%',
    },
    {
        code: 'REUM',
        name: 'รถมอไซค์รีไฟแนนซ์จำนำ',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 25,
        maxAge: 69,
        collateralStatus: ['pledge'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '23.99%',
    },
    {
        code: 'ULMP',
        name: 'Payroll ปลอดภาระ รถมอไซค์',
        features: [
            'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
        ],
        specialProject: 'b2b_payroll',
        minAge: 25,
        maxAge: 59,
        collateralStatus: ['clear'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '19.00%',
    },
    {
        code: 'REPM',
        name: 'Payroll รีไฟแนนซ์จำนำรถมอไซค์',
        features: [
            'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
        ],
        specialProject: 'b2b_payroll',
        minAge: 25,
        maxAge: 59,
        collateralStatus: ['pledge'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '19.00%',
    },
    {
        code: 'REXX',
        name: 'รีไฟแนนซ์เช่าซื้อ มอไซค์',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 25,
        maxAge: 69,
        collateralStatus: ['hire_purchase'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '23.99%',
    },
    {
        code: 'TLNM',
        name: 'รถมอไซค์ ไม่ถือสัญชาติไทย ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'รองรับลูกค้าที่ไม่ได้มีสัญชาติไทย',
        ],
        nationality: ['non-thai'],
        minAge: 25,
        maxAge: 69,
        collateralStatus: ['clear'],
        collateral: 'moto',
        terms: '12 - 36',
        interestRate: '23.99%',
    },
];

const CAR_PRODUCTS = [
    {
        code: 'ULCR',
        name: 'จำนำรถ ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '12 - 60',
        interestRate: '23.99%',
    },
    {
        code: 'REUC',
        name: 'รีไฟแนนซ์จำนำรถยนต์ ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '12 - 60',
        interestRate: '23.99%',
    },
    {
        code: 'TLNC',
        name: 'จำนำรถยนต์-ไม่ต้องมีสัญชาติไทย ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'รองรับลูกค้าที่ไม่ได้มีสัญชาติไทย',
        ],
        nationality: ['non-thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '12 - 60',
        interestRate: '23.99%',
    },
    {
        code: 'ULCP',
        name: 'Payroll รถยนต์ ปลอดภาระ',
        features: [
            'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
        ],
        specialProject: 'b2b_payroll',
        minAge: 20,
        maxAge: 59,
        collateralStatus: ['clear'],
        terms: '12 - 60',
        interestRate: '19.00%',
    },
    {
        code: 'REPC',
        name: 'Payroll รีไฟแนนซ์รถยนต์',
        features: [
            'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
            'ฟรี บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
        ],
        specialProject: 'b2b_payroll',
        minAge: 20,
        maxAge: 59,
        collateralStatus: ['pledge'],
        terms: '12 - 60',
        interestRate: '19.00%',
    },
    {
        code: 'REXX',
        name: 'รีไฟแนนซ์เช่าซื้อ รถยนต์',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['hire_purchase'],
        terms: '12 - 60',
        interestRate: '23.99%',
    },
];

const TRUCK_PRODUCTS = [
    {
        code: 'TLTK',
        name: 'จำนำรถบรรทุก ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLT1',
        name: 'จำนำรถบรรทุก ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RETK',
        name: 'รีไฟแนนซ์ จำนำรถบรรทุก ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RET1',
        name: 'รีไฟแนนซ์ จำนำรถบรรทุก One time',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'REXX',
        name: 'รีไฟแนนซ์เช่าซื้อ รถบรรทุก',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['hire_purchase'],
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
];

const AGRI_PRODUCTS = [
    {
        code: 'TLIA',
        name: 'จำนำรถเกษตรเก่า ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        occupation: 'all',
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLA1',
        name: 'จำนำรถเกษตรเก่า ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        occupation: 'all',
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLSA',
        name: 'จำนำรถเกษตรเก่า ผ่อนรายฤดูกาล',
        features: [
            'ชำระค่างวดรายฤดูกาล สามารถเลือกความถี่ชำระค่างวดให้สอดคล้องกับช่วงการเก็บเกี่ยวผลิตผล เช่น รายไตรมาส, รายปี',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        occupation: 'farmer',
        terms: '12 - 72',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'REAI',
        name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        occupation: 'all',
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'REA1',
        name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ฟรี บริการชำระปิดบัญชีไฟแนนซ์เดิม',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        occupation: 'all',
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'REAS',
        name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ผ่อนรายฤดูกาล',
        features: [
            'ชำระค่างวดรายฤดูกาล สามารถเลือกความถี่ชำระค่างวดให้สอดคล้องกับช่วงการเก็บเกี่ยวผลิตผล เช่น รายไตรมาส, รายปี',
            'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        occupation: 'farmer',
        terms: '12 - 72',
        interestRate: '23.99%',
        specialProject: undefined,
    },
];

const LAND_PRODUCTS = [
    {
        code: 'TLLD',
        name: 'ที่ดิน (จำนำ) ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ไม่ต้องจดจำนองที่ดิน',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        deedTypeExclude: ['tra_chong'],
        maxAmount: 200000,
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLP1',
        name: 'ที่ดิน (จำนำ) ผ่อน ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ไม่ต้องจดจำนองที่ดิน',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        deedTypeExclude: ['tra_chong'],
        maxAmount: 200000,
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RELD',
        name: 'รีไฟแนนซ์ที่ดิน (จำนำ) ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ไม่ต้องจดจำนองที่ดิน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        deedTypeExclude: ['tra_chong'],
        maxAmount: 200000,
        terms: '12 - 60',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'REP1',
        name: 'รีไฟแนนซ์ที่ดิน (จำนำ) ผ่อน ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ไม่ต้องจดจำนองที่ดิน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        deedTypeExclude: ['tra_chong'],
        maxAmount: 200000,
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLTD',
        name: 'จำนองที่ดิน ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ผ่อนยาวสูงสุด 120 งวด',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '12 - 120',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLTI',
        name: 'จำนองที่ดิน สัญญารายปี',
        features: [
            'งวดที่ 1 - 11 จ่ายค่างวดน้อยเพียง 15% ของค่างวดรายเดือน แต่งวดที่ 12 จ่ายคืนเงินต้นพร้อมดอกเบี้ยที่เหลือทั้งหมด',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินระยะสั้นไม่เกิน 1 ปี',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '12',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'TLL1',
        name: 'จำนองที่ดิน ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['clear'],
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RETD',
        name: 'รีไฟแนนซ์จำนองที่ดิน ผ่อนรายเดือน',
        features: [
            'ชำระค่างวดรายเดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '12 - 120',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RETI',
        name: 'รีไฟแนนซ์จำนองที่ดิน สัญญารายปี',
        features: [
            'งวดที่ 1 - 11 จ่ายค่างวดน้อยเพียง 15% ของค่างวดรายเดือน แต่งวดที่ 12 จ่ายคืนเงินต้นพร้อมดอกเบี้ยที่เหลือทั้งหมด',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินระยะสั้นไม่เกิน 1 ปี',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '12',
        interestRate: '23.99%',
        specialProject: undefined,
    },
    {
        code: 'RED1',
        name: 'รีไฟแนนซ์จำนองที่ดิน ONE TIME',
        features: [
            'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
            'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
            'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
            'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
        ],
        nationality: ['thai'],
        minAge: 20,
        maxAge: 69,
        collateralStatus: ['pledge'],
        terms: '1 - 4',
        interestRate: '23.99%',
        specialProject: undefined,
    },
];

function PreQuestionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'balloon'>('monthly');
    // Local state for "Sales Talk"
    const [formData, setFormData] = useState<any>({
        collateralType: 'car',
        appraisalPrice: 0,
        income: 0,
        // New Preliminary Fields
        loanPurpose: '',
        requestedAmount: '',
        collateralStatus: '',
        occupationGroup: '',
        jobTitle: '',
        salary: '',
        otherIncome: '',
        monthlyDebt: '',
        specialProject: '',
        borrowerAge: '',
        collateralCondition: '',
        brand: '',
        model: '',
        subModel: '',
        year: '',
        aiPrice: 0,
        redbookPrice: 0,
        aiDetectedData: null,

        nationality: '',
        customerGroup: '',
        applicationOwner: '',
        branchRegion: '',
        // Defaults for CalculatorStep
        requestedDuration: '',

        // Collateral Questions
        collateralQuestions: {},
        isSalesheetRead: false,
        landProvince: '',
        landCollateralPurpose: '',

        // Land Appraisals
        landAppraisals: [{ source: 'land_office', label: 'สำนักงานที่ดิน', price: '', hidden: false }],
        buildingAppraisals: [{ source: 'treasury_department', label: 'กรมธนารักษ์', price: '', hidden: false }],
        condoUnitAppraisals: [{ source: 'land_office', label: 'สำนักงานที่ดิน', price: '', hidden: false }],
        condoBalconyAppraisals: [{ source: 'land_office', label: 'สำนักงานที่ดิน', price: '', hidden: false }],
        appraisalSource: '',
        appraisedLandPrice: '',
        appraisedBuildingPrice: '',
        incomeBreakdown: [
            { label: 'รายได้หลัก', price: '', source: 'main' },
            { label: 'รายได้เสริม (ถ้ามี)', price: '', source: 'extra' },
            { label: 'รายได้รวม', price: '', source: 'total' },
        ],
        debtBreakdown: [
            { label: 'ผ่อนบ้าน/ค่าเช่าบ้าน', price: '', source: 'housing' },
            { label: 'ผ่อนรถ', price: '', source: 'car' },
            { label: 'ผ่อนบัตรเครดิต/บัตรกดเงินสด', price: '', source: 'card' },
            { label: 'ผ่อนสินเชื่ออื่นๆ (ไม่รวมสินเชื่อเงินไชโย)', price: '', source: 'other_loan' },
            { label: 'ผ่อนเงินกู้สหกรณ์', price: '', source: 'coop' },
            { label: 'ผ่อนเงินกู้นอกระบบ', price: '', source: 'informal' },
        ],
    });

    // Step 1: Preliminary Questionnaire (Inc. Collateral Type)
    // Step 2: Upload / Analyze
    // Step 3: Info
    // Step 4: Calculate (Result)
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [showStaffBanner, setShowStaffBanner] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [isFetchingRedbook, setIsFetchingRedbook] = useState(false);
    const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
    const [isBorrowerInfoExpanded, setIsBorrowerInfoExpanded] = useState(false);
    const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
    const [isIncomeDebtExpanded, setIsIncomeDebtExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showProducts, setShowProducts] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- REFINED LAND APPRAISAL CALCULATION ---
    const calculatedLandResult = useMemo(() => {
        if (formData.collateralType !== 'land') return null;

        const deedType = formData.landDeedType;
        const isTrajong = deedType === 'trajong_deed';

        // 1. Check if it's "Land Only" (no building)
        let buildingOfficePrice = 0;
        let buildingExtPrice = 0;
        if (deedType !== 'orchor2') {
            const bldgTreasury = (formData.buildingAppraisals || []).find((a: any) => a.source === 'treasury_department' && !a.hidden);
            buildingOfficePrice = Number(bldgTreasury?.price) || 0;

            const bldgExt = (formData.buildingAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            buildingExtPrice = Number(bldgExt?.price) || 0;
        }
        const isLandOnly = buildingOfficePrice === 0 && buildingExtPrice === 0;

        // 2. Calculate Land limit
        let landOfficePrice = 0;
        if (deedType === 'orchor2') {
            const unitOffice = (formData.condoUnitAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            const balcOffice = (formData.condoBalconyAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            landOfficePrice = (Number(unitOffice?.price) || 0) + (Number(balcOffice?.price) || 0);
        } else {
            const landOffice = (formData.landAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            landOfficePrice = Number(landOffice?.price) || 0;
        }

        let extAppraisalPrice = 0;
        if (deedType === 'orchor2') {
            const unitExt = (formData.condoUnitAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            const balcExt = (formData.condoBalconyAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            extAppraisalPrice = (Number(unitExt?.price) || 0) + (Number(balcExt?.price) || 0);
        } else {
            const landExt = (formData.landAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            extAppraisalPrice = Number(landExt?.price) || 0;
        }

        // Base values for Step 2
        const ltvPenalty = (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') ? 0.05 : 0;

        // Rules 1.1 & 1.2 or Land Only Rule
        let landOfficeLtv = isLandOnly ? 0.50 : (isTrajong ? 0.50 : 0.60);
        let extAppraisalLtv = isLandOnly ? 0.50 : (isTrajong ? 0.40 : 0.50);

        // Apply penalty to Land Only case base LTV
        if (isLandOnly && ltvPenalty > 0) {
            landOfficeLtv -= ltvPenalty;
            extAppraisalLtv -= ltvPenalty;
        }

        let landOfficeLimitResult = landOfficePrice > 0 ? (landOfficePrice * landOfficeLtv) : Infinity;
        let extAppraisalLimitResult = extAppraisalPrice > 0 ? (extAppraisalPrice * extAppraisalLtv) : Infinity;

        // Constraint: Ext limit <= 2 * Dept of Lands Price
        if (extAppraisalLimitResult !== Infinity && landOfficePrice > 0) {
            extAppraisalLimitResult = Math.min(extAppraisalLimitResult, landOfficePrice * 2);
        }

        const landOptions = [];
        if (landOfficePrice > 0) landOptions.push({ price: landOfficePrice, limit: landOfficeLimitResult, label: 'กรมที่ดิน', ltv: landOfficeLtv });
        if (extAppraisalPrice > 0) landOptions.push({ price: extAppraisalPrice, limit: extAppraisalLimitResult, label: 'ราคาประเมินนอก', ltv: extAppraisalLtv });

        let chosenLand = { price: 0, limit: 0, label: '-', ltv: 0 };
        if (landOptions.length > 0) {
            // "We will select the lowest appraisal price to calculate in final appraisal price"
            chosenLand = landOptions.reduce((min, cur) => cur.limit < min.limit ? cur : min, landOptions[0]);
        }

        // 3. Calculate Building limit
        let chosenBuilding = { price: 0, limit: 0, label: '-', ltv: 0 };
        if (!isLandOnly) {
            const buildingAge = Number(formData.buildingAge) || 0;
            let bldgExtMultiplier = 0.20;
            if (buildingAge >= 1 && buildingAge <= 10) bldgExtMultiplier = 0.30;
            else if (buildingAge >= 11 && buildingAge <= 20) bldgExtMultiplier = 0.25;

            let bldgOfficeLtv = 0.20;
            let bldgOfficeLimitResult = buildingOfficePrice > 0 ? (buildingOfficePrice * bldgOfficeLtv) : Infinity;
            let bldgExtLimitResult = buildingExtPrice > 0 ? (buildingExtPrice * bldgExtMultiplier) : Infinity;

            const bldgOptions = [];
            if (buildingOfficePrice > 0) bldgOptions.push({ price: buildingOfficePrice, limit: bldgOfficeLimitResult, label: 'กรมธนารักษ์', ltv: bldgOfficeLtv });
            if (buildingExtPrice > 0) bldgOptions.push({ price: buildingExtPrice, limit: bldgExtLimitResult, label: 'ราคาประเมินนอก', ltv: bldgExtMultiplier });

            if (bldgOptions.length > 0) {
                chosenBuilding = bldgOptions.reduce((min, cur) => cur.limit < min.limit ? cur : min, bldgOptions[0]);
            }
        }

        // Final Appraisal Price for Step 1 display
        const finalAppraisalPrice = chosenLand.limit + chosenBuilding.limit;

        // Base values for Step 2
        const basePriceTotal = chosenLand.price + chosenBuilding.price;
        let capLtv = 0.50;
        if (ltvPenalty > 0) capLtv -= ltvPenalty;

        const maxOverallLimitByCap = basePriceTotal * capLtv;
        const absoluteCap = isLandOnly ? 220000 : 5000000;
        const finalCalculatedLimit = Math.min(finalAppraisalPrice, maxOverallLimitByCap, absoluteCap);

        return {
            chosenLand,
            chosenBuilding,
            finalAppraisalPrice,
            basePriceTotal,
            ltvPenalty,
            capLtv,
            finalCalculatedLimit,
            isLandOnly
        };
    }, [formData]);

    const finalSummaryLimit = useMemo(() => {
        let limit = 0;
        let appraisalPrice = Number(formData.appraisalPrice) || 0;

        if (formData.collateralType === 'land' && calculatedLandResult) {
            limit = calculatedLandResult.finalCalculatedLimit;
        } else {
            let baseLTV = 0.80;
            if (formData.specialProject === 'b2b_payroll') baseLTV += 0.10;
            if (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') baseLTV -= 0.05;
            const maxLtvCap = 1.20;
            const finalLTV = Math.min(baseLTV, maxLtvCap);
            limit = Math.floor(appraisalPrice * finalLTV);
        }
        return limit;
    }, [formData, calculatedLandResult]);

    // Ensure requested amount does not exceed final summary limit, and prefill with maxLoan when entering Step 2
    useEffect(() => {
        // Prefill when entering Step 2 if not already set
        if (currentStep === 2 && (!formData.requestedAmount || Number(formData.requestedAmount) === 0) && finalSummaryLimit > 0) {
            setFormData((prev: any) => ({ ...prev, requestedAmount: String(finalSummaryLimit) }));
        }
    }, [currentStep, finalSummaryLimit]);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('preQuestionState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.formData) setFormData(parsed.formData);
                // If URL param step exists, use it has priority (for the back navigation scenario)
                // Otherwise use saved step if available, or default to 1.
                // Wait, if initialStep is from URL, currentStep is already initialized with it.
                // If no URL param, initialStep is 1.
                // We should only overwrite currentStep from storage if URL param is NOT present.
                if (!searchParams.get('step') && parsed.currentStep) {
                    setCurrentStep(parsed.currentStep);
                }
            } catch (e) {
                console.error("Failed to load pre-question state", e);
            }
        }
    }, [searchParams]);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem('preQuestionState', JSON.stringify({
            formData,
            currentStep
        }));
    }, [formData, currentStep]);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

    // Form state extensions for Step 2
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newPhotos: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            newPhotos.push(url);
        }

        setUploadedDocs(prev => {
            const newList = [...prev, ...newPhotos];
            handleAnalyzeImage(newList.length);
            return newList;
        });

        // Reset input value so same file can be selected again
        e.target.value = '';
    };

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleOpenCamera = () => {
        cameraInputRef.current?.click();
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== idx));
    };

    // Enhanced Product List for UI Design
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
            color: "bg-green-100 text-green-100" // Use a very pale green for the bg
        },
        {
            id: "land",
            label: "ที่ดิน",
            desc: "โฉนดที่ดิน",
            icon: Map,
            color: "bg-yellow-100 text-yellow-600 hover:text-yellow-700"
        },
    ];

    const STAFF_MEMBERS = [
        { value: "สมหญิง จริงใจ", label: "สมหญิง จริงใจ (Maker)", region: 'other' },
        { value: "สมหมาย มุ่งมั่น", label: "นายสมหมาย มุ่งมั่น (Maker)", region: 'isan' },
        { value: "ไชโย รักชาติ", label: "นายไชโย รักชาติ (Checker)", region: 'other' },
        { value: "กนกวรรณ ปลอดปลอดภัย", label: "นางกนกวรรณ ปลอดปลอดภัย (Maker)", region: 'isan' },
        { value: "ทดสอบ อีสาน", label: "พนักงาน ทดสอบ (ภาคอีสาน)", region: 'isan' },
    ];

    // Document requirements per collateral type (matches CollateralStepNew.tsx)
    const DOCUMENT_REQUIREMENTS: Record<string, { name: string; description: string }> = {
        car: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        moto: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        truck: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        agri: { name: 'เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย', description: 'เอกสารแสดงกรรมสิทธิ์' },
        land: { name: 'โฉนดที่ดิน', description: 'หน้าแรก - ครุฑ' },
    };

    // Mock Questions for Collateral Assessment
    const COLLATERAL_QUESTIONS: Record<string, { id: string; text: string }[]> = {
        car: [
            { id: 'car_q1', text: 'เป็นรถจากเต้นท์' },
            { id: 'car_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
            { id: 'car_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
            { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่ รถรับส่งผู้โดยสาร/รถกะป๊อ/รถอาสามูลนิธิ' },
            { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
            { id: 'car_q6', text: 'เป็นรถที่ตัดแต่งคัสซี / ตัดเว้าคัสซี' },
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
            { id: 'land_q1', text: 'เป็นที่ดินตาบอด / ภาระจำยอมของบุคคลอื่น / มีรั้วปิดทางเข้าออก / ที่ดินติดคลอง /ติดลำธารทีไม่ติดถนนสาธารณะ / ที่ดินสาธารณะประโยชน์ที่รถยนต์ไม่สามารถเข้าออกได้' },
            { id: 'land_q2', text: 'เป็นที่ดินติดโรงเรียน / วัด / ศาลเจ้า / สถานที่ศักดิ์อื่น ๆ /สุสาน / ป่าช้า / บ่อขยะ / ติดเขตการรถไฟ' },
            { id: 'land_q3', text: 'ที่ดินรกร้างไม่ได้ทำประโยชน์ / เป็นที่ดินเชิงเขาและอยู่ในเขตป่าสงวน / ป่าไม้แห่งชาติ / มีบ่อน้ำในที่ดินเกิน 40%' },
            { id: 'land_q4', text: 'เป็นที่ดินที่มีสัญญาเช่าระยะยาว เช่น ให้เช่าตั้งสัญญาณโทรศัพท์, มินิมาร์ท' },
        ],
    };

    const handlePrint = () => {
        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
        if (formData.collateralType === 'land') {
            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
        }
        window.open(pdfPath, '_blank');
    };

    const handleCreateApplication = () => {
        // Save current sales talk data to localStorage for prefilling the application form
        localStorage.setItem('salesTalkData', JSON.stringify(formData));
        router.push("/dashboard/new-application/privacy-notice");
    };

    const isStep1Valid = () => {
        // Essential fields for all types
        if (!formData.collateralType) return false;

        // Vehicle (Car, Moto, Truck, Agri)
        if (['car', 'moto', 'truck', 'agri'].includes(formData.collateralType)) {
            // Mandatory: Brand, Model, Year, Collateral Status
            if (!formData.brand || !formData.model || !formData.year || !formData.collateralStatus) return false;

            // Sub-model is mandatory ONLY if there are sub-models available for that model
            const subModelOptions = SUB_MODELS_BY_MODEL[formData.model] || [];
            if (subModelOptions.length > 0 && !formData.subModel) return false;
        }

        // Land / Condo
        if (formData.collateralType === 'land') {
            if (!formData.landDeedType || !formData.landCollateralPurpose) return false;

            // Specialized Mandatory check for Trajong Deed: Province must be selected
            if (formData.landDeedType === 'trajong_deed' && !formData.landProvince) return false;
        }

        return true;
    };

    const nextStep = () => {
        if (currentStep === 1) {
            let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];
            if (formData.collateralType === 'land' && formData.landDeedType === 'orchor2') {
                questions = [];
            }

            if (formData.collateralType === 'land' && formData.landDeedType === 'trajong_deed' && formData.landProvince === 'other') {
                setIsConditionDialogOpen(true);
                return;
            }

            const hasYesAnswer = questions.some(q => formData.collateralQuestions?.[q.id] === 'yes');

            if (hasYesAnswer) {
                setIsConditionDialogOpen(true);
                return;
            }

            // Mock calculating appraisal price on step change
            if (['car', 'moto', 'truck', 'agri'].includes(formData.collateralType)) {
                if (!formData.appraisalPrice || formData.appraisalPrice === 0) {
                    setFormData((prev: any) => ({
                        ...prev,
                        redbookPrice: 475000,
                        appraisalPrice: 475000
                    }));
                }
            }
        }
        setCurrentStep(prev => prev + 1);
    };
    const prevStep = () => setCurrentStep(prev => prev - 1);

    // Mock AI Analysis from Photo Step
    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // Mock Data Filling based on type
            let mockData: any = {
                appraisalPrice: 450000
            };

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', mileage: 85000, subModel: 'HEV Premium' };
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'land') {
                mockData = { ...mockData, landRai: 1, landNgan: 2, landWah: 50, province: 'กรุงเทพมหานคร', appraisalPrice: 2500000 };
            }

            setFormData((prev: any) => ({
                ...prev,
                ...mockData,
                aiDetectedData: mockData,
                aiPrice: mockData.appraisalPrice
            }));
            setAiDetectedFields(Object.keys(mockData));
            setIsAnalyzing(false);
            toast.success("วิเคราะห์รูปภาพสำเร็จ!");
        }, 1500);
    };

    // Appraisal dynamic table helpers
    const updateOverallAppraisal = (updatedLand: any[], updatedBuilding: any[]) => {
        const totalLand = updatedLand.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        const totalBuilding = updatedBuilding.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        setFormData((prev: any) => ({
            ...prev,
            landAppraisals: updatedLand,
            buildingAppraisals: updatedBuilding,
            appraisedLandPrice: totalLand,
            appraisedBuildingPrice: totalBuilding,
            appraisalPrice: totalLand + totalBuilding
        }));
    };

    const handleUpdateLandAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.landAppraisals || [])];
        if (updated[index]) {
            if (field === 'source') {
                const label = LAND_APPRAISAL_SOURCES.find(s => s.value === value)?.label || '';
                updated[index] = { ...updated[index], source: value, label };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            updateOverallAppraisal(updated, formData.buildingAppraisals || []);
        }
    };

    const handleAddLandAppraisal = () => {
        const updated = [...(formData.landAppraisals || []), { source: '', label: '', price: '', hidden: false }];
        updateOverallAppraisal(updated, formData.buildingAppraisals || []);
    };

    const handleRemoveLandAppraisal = (index: number) => {
        const updated = [...(formData.landAppraisals || [])];
        if (updated.length <= 1) return;
        updated.splice(index, 1);
        updateOverallAppraisal(updated, formData.buildingAppraisals || []);
    };

    const handleUpdateBuildingAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.buildingAppraisals || [])];
        if (updated[index]) {
            if (field === 'source') {
                const label = BUILDING_APPRAISAL_SOURCES.find(s => s.value === value)?.label || '';
                updated[index] = { ...updated[index], source: value, label };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            updateOverallAppraisal(formData.landAppraisals || [], updated);
        }
    };

    const handleAddBuildingAppraisal = () => {
        const updated = [...(formData.buildingAppraisals || []), { source: '', label: '', price: '', hidden: false }];
        updateOverallAppraisal(formData.landAppraisals || [], updated);
    };

    const handleRemoveBuildingAppraisal = (index: number) => {
        const updated = [...(formData.buildingAppraisals || [])];
        if (updated.length <= 1) return;
        updated.splice(index, 1);
        updateOverallAppraisal(formData.landAppraisals || [], updated);
    };

    const updateCondoAppraisal = (updatedUnit: any[], updatedBalcony: any[]) => {
        const totalUnit = updatedUnit.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        const totalBalcony = updatedBalcony.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);

        setFormData((prev: any) => ({
            ...prev,
            condoUnitAppraisals: updatedUnit,
            condoBalconyAppraisals: updatedBalcony,
            appraisalPrice: totalUnit + totalBalcony
        }));
    };

    const handleUpdateCondoUnitAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.condoUnitAppraisals || [])];
        if (updated[index]) {
            if (field === 'source') {
                const label = CONDO_APPRAISAL_SOURCES.find(s => s.value === value)?.label || '';
                updated[index] = { ...updated[index], source: value, label };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            updateCondoAppraisal(updated, formData.condoBalconyAppraisals || []);
        }
    };

    const handleAddCondoUnitAppraisal = () => {
        const updated = [...(formData.condoUnitAppraisals || []), { source: '', label: '', price: '', hidden: false }];
        updateCondoAppraisal(updated, formData.condoBalconyAppraisals || []);
    };

    const handleRemoveCondoUnitAppraisal = (index: number) => {
        const updated = [...(formData.condoUnitAppraisals || [])];
        if (updated.length <= 1) return;
        updated.splice(index, 1);
        updateCondoAppraisal(updated, formData.condoBalconyAppraisals || []);
    };

    const handleUpdateCondoBalconyAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.condoBalconyAppraisals || [])];
        if (updated[index]) {
            if (field === 'source') {
                const label = CONDO_APPRAISAL_SOURCES.find(s => s.value === value)?.label || '';
                updated[index] = { ...updated[index], source: value, label };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            updateCondoAppraisal(formData.condoUnitAppraisals || [], updated);
        }
    };

    const handleAddCondoBalconyAppraisal = () => {
        const updated = [...(formData.condoBalconyAppraisals || []), { source: '', label: '', price: '', hidden: false }];
        updateCondoAppraisal(formData.condoUnitAppraisals || [], updated);
    };

    const handleRemoveCondoBalconyAppraisal = (index: number) => {
        const updated = [...(formData.condoBalconyAppraisals || [])];
        if (updated.length <= 1) return;
        updated.splice(index, 1);
        updateCondoAppraisal(formData.condoUnitAppraisals || [], updated);
    };

    const handleUpdateIncomeBreakdown = (index: number, value: any) => {
        const newBreakdown = [...formData.incomeBreakdown];
        newBreakdown[index].price = value;

        // Calculate total from main and extra (first two items)
        const main = Number(newBreakdown[0]?.price) || 0;
        const extra = Number(newBreakdown[1]?.price) || 0;
        const total = main + extra;

        // Update the total item if it exists
        if (newBreakdown[2]) {
            newBreakdown[2].price = total.toString();
        }

        setFormData({
            ...formData,
            incomeBreakdown: newBreakdown,
            salary: total.toString() // Sync with salary field
        });
    };

    const handleUpdateDebtBreakdown = (index: number, value: any) => {
        const newBreakdown = [...formData.debtBreakdown];
        newBreakdown[index].price = value;

        // Calculate total
        const totalDebtValue = newBreakdown.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

        setFormData({
            ...formData,
            debtBreakdown: newBreakdown,
            monthlyDebt: totalDebtValue.toString() // Sync with monthlyDebt field
        });
    };
    const handleFetchRedbook = () => {
        setIsFetchingRedbook(true);
        // Mock API Call
        setTimeout(() => {
            setIsFetchingRedbook(false);
            setFormData((prev: any) => ({
                ...prev,
                redbookPrice: 475000,
                appraisalPrice: 475000
            }));
            toast.success("ดึงข้อมูลจาก Redbook สำเร็จ");
        }, 1000);
    };

    const handleAnalyzeImage = (count?: number) => {
        const imageCount = count ?? uploadedDocs.length;
        if (imageCount === 0) return;

        setIsAnalyzing(true);
        setAnalysisError(false);
        setAiDetectedFields([]);
        toast.info("กำลังวิเคราะห์รูปถ่าย...", { duration: 1500 });

        setTimeout(() => {
            // Error case: Only 1 photo
            if (imageCount === 1) {
                setIsAnalyzing(false);
                setAnalysisError(true);
                return;
            }

            setAnalysisError(false);

            let mockData: any = { appraisalPrice: 450000 };
            const fields = ['appraisalPrice', 'brand', 'model', 'year'];

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', subModel: 'HEV Premium' };
                fields.push('subModel');
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'truck') {
                mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2020', appraisalPrice: 500000 };
            } else if (formData.collateralType === 'agri') {
                mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2022', appraisalPrice: 600000 };
            }

            setFormData((prev: any) => ({
                ...prev,
                ...mockData,
                aiDetectedData: mockData,
                aiPrice: mockData.appraisalPrice,
                redbookPrice: 0 // Will be set when user selects from redbook
            }));
            setAiDetectedFields(fields);
            setIsAnalyzing(false);
            toast.success("วิเคราะห์รูปถ่ายสำเร็จ!", {
                icon: <Sparkles className="w-4 h-4 text-purple-500" />
            });

            // Automatically fetch redbook data after AI analysis
            setTimeout(() => {
                handleFetchRedbook();
            }, 500);
        }, 1500);
    };

    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([
            { label: "รายการใบสมัคร", href: "/dashboard/applications" },
            { label: "สร้างใบสมัครใหม่", isActive: true }
        ]);
        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [setBreadcrumbs, setRightContent]);

    const finalLimit = finalSummaryLimit;
    const maxLoan = finalLimit;

    // --- Product Filtering Logic (Shared between Step 1 and Step 2) ---
    const borrowerAgeNum = Number(formData.borrowerAge) || 0;
    const currentStatus = formData.collateralStatus || 'clear';
    const currentNationality = formData.nationality || 'thai';

    const eligibleMotoProducts = MOTO_PRODUCTS.filter(p => {
        if (formData.collateralType !== 'moto') return false;
        if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
        if (!p.collateralStatus.includes(currentStatus)) return false;

        if (p.specialProject === 'b2b_payroll') {
            if (formData.specialProject !== 'b2b_payroll') return false;
        } else {
            if (p.nationality && !p.nationality.includes(currentNationality)) return false;
        }
        return true;
    });

    const eligibleCarProducts = CAR_PRODUCTS.filter(p => {
        if (formData.collateralType !== 'car') return false;
        if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
        if (!p.collateralStatus.includes(currentStatus)) return false;

        if (p.specialProject === 'b2b_payroll') {
            if (formData.specialProject !== 'b2b_payroll') return false;
        } else {
            if (p.nationality && !p.nationality.includes(currentNationality)) return false;
        }
        return true;
    });

    const eligibleTruckProducts = TRUCK_PRODUCTS.filter(p => {
        if (formData.collateralType !== 'truck') return false;
        if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
        if (!p.collateralStatus.includes(currentStatus)) return false;

        if (p.specialProject === 'b2b_payroll') {
            if (formData.specialProject !== 'b2b_payroll') return false;
        } else {
            if (p.nationality && !p.nationality.includes(currentNationality)) return false;
        }
        return true;
    });

    const eligibleAgriProducts = AGRI_PRODUCTS.filter(p => {
        if (formData.collateralType !== 'agri') return false;
        if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
        if (!p.collateralStatus.includes(currentStatus)) return false;

        if (p.occupation === 'farmer' && formData.occupationGroup !== 'farmer') return false;

        if (p.specialProject === 'b2b_payroll') {
            if (formData.specialProject !== 'b2b_payroll') return false;
        } else {
            if (p.nationality && !p.nationality.includes(currentNationality)) return false;
        }
        return true;
    });

    const eligibleLandProducts = LAND_PRODUCTS.filter(p => {
        if (formData.collateralType !== 'land') return false;
        if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;

        // Deed type filtering
        if (p.deedTypeExclude && p.deedTypeExclude.includes(formData.landDeedType)) return false;

        // Collateral status filtering (land uses 'clear' and 'pledge')
        if (!p.collateralStatus.includes(currentStatus)) return false;

        if (p.specialProject === 'b2b_payroll') {
            if (formData.specialProject !== 'b2b_payroll') return false;
        } else {
            if (p.nationality && !p.nationality.includes(currentNationality)) return false;
        }
        return true;
    });

    const hasBalloonOpt = ['truck', 'agri', 'land'].includes(formData.collateralType);

    // Select which list of products to show based on collateral AND selected plan
    let productsToShow = formData.collateralType === 'moto' ? eligibleMotoProducts :
        formData.collateralType === 'car' ? eligibleCarProducts :
            formData.collateralType === 'truck' ? eligibleTruckProducts :
                formData.collateralType === 'agri' ? eligibleAgriProducts :
                    eligibleLandProducts;

    // Filter products to match selected plan (monthly vs one-time/balloon)
    // For land, show all possibilities as requested
    if (formData.collateralType !== 'land') {
        productsToShow = productsToShow.filter(p => {
            const isOneTimeProduct = p.name.toUpperCase().includes('ONE TIME') || p.name.toUpperCase().includes('ONE-TIME') || p.name.includes('สัญญารายปี');
            return selectedPlan === 'balloon' ? isOneTimeProduct : !isOneTimeProduct;
        });
    }

    const topProduct = productsToShow[0];

    // Unified interest rate and calculation helpers
    const annualRate = parseFloat(topProduct?.interestRate || '23.99') / 100;
    const monthlyRate = annualRate / 12;

    const calcMonthly = (principal: number, months: number) => {
        if (principal <= 0 || months <= 0) return 0;
        return Math.ceil(principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    };

    const calcBalloonMonthly = (principal: number) => {
        return Math.ceil(principal * monthlyRate);
    };

    if (!isMounted) return null;

    return (
        <div className="h-full">
            <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 pt-6">


                {/* STEP 1: Preliminary Questionnaire (New) */}
                {/* STEP 1: Preliminary Questionnaire (New Github Layout) */}
                {currentStep === 1 && (
                    <div className="max-w-4xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20 pt-4">
                        <div className="space-y-1 mb-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">คำนวนวงเงินเบื้องต้น</h2>
                        </div>

                        {/* Section 1: Collateral Info */}
                        <div className="relative pb-4">

                            <div className="space-y-6 mt-4">

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {PRODUCTS.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    const tenureOpts = TENURE_OPTIONS[p.id] || [];
                                                    const maxTenure = tenureOpts.length > 0 ? Math.max(...tenureOpts) : 0;
                                                    setFormData({
                                                        ...formData,
                                                        collateralType: p.id,
                                                        brand: '',
                                                        model: '',
                                                        year: '',
                                                        appraisalPrice: 0,
                                                        requestedDuration: maxTenure,
                                                        collateralStatus: 'clear',
                                                        // Automatically default to 'ns4' when land is selected
                                                        ...(p.id === 'land' ? { landDeedType: 'ns4' } : {})
                                                    });
                                                    setAiDetectedFields([]);
                                                }}
                                                className={cn(
                                                    "flex-1 min-w-[120px] py-3 px-4 rounded-xl border text-sm font-bold transition-all text-center group flex flex-col items-center justify-center gap-2",
                                                    formData.collateralType === p.id
                                                        ? "border-chaiyo-blue bg-blue-50 text-chaiyo-blue"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                )}
                                            >
                                                <p.icon className={cn("w-6 h-6", formData.collateralType === p.id ? "text-chaiyo-blue" : "text-gray-400 group-hover:text-gray-600")} />
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-gray-900">รายละเอียดหลักประกัน</h3>
                                    <div className="border border-border-strong rounded-xl bg-white overflow-hidden divide-y divide-border-subtle">
                                        {/* Photo Upload Area (Card 1) */}
                                        {formData.collateralType === 'car' && (
                                            <div className="bg-white">
                                                <div className="p-6 bg-blue-50/30">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">
                                                                อัพโหลดรูปถ่ายหลักประกัน (ถ้ามี)
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {/* Hidden Inputs */}
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleFileChange}
                                                            />
                                                            <input
                                                                type="file"
                                                                ref={cameraInputRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                capture="environment"
                                                                onChange={handleFileChange}
                                                            />

                                                            <Button
                                                                variant="outline"
                                                                onClick={handleAddPhoto}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                อัพโหลดรูปภาพ
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={handleOpenCamera}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                เปิดกล้อง
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {analysisError && (
                                                        <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200 text-red-900 animate-in fade-in slide-in-from-top-2">
                                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                                            <AlertTitle className="font-bold">วิเคราะห์รูปถ่ายไม่สำเร็จ!</AlertTitle>
                                                            <AlertDescription>
                                                                ข้อมูลไม่เพียงพอ กรุณาส่งรูปถ่ายเพิ่มเติมเพื่อเริ่มการวิเคราะห์อัตโนมัติ
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}

                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        {uploadedDocs.map((doc, idx) => (
                                                            <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-border-strong group bg-white">
                                                                <img src={doc} alt={`doc-${idx}`} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => setLightboxIndex(idx)}
                                                                        className="absolute inset-0 flex items-center justify-center text-white hover:text-blue-200 transition-colors"
                                                                    >
                                                                        <Eye className="w-6 h-6" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                                                                        className="absolute top-1.5 right-1.5 text-white hover:text-red-300 transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1.5 border border-white/20 backdrop-blur-sm shadow-sm"
                                                                    >
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                                {isAnalyzing && (
                                                                    <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center">
                                                                        <div className="w-full h-0.5 bg-blue-400 absolute top-0 animate-[scan_2s_infinite]" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                    </div>



                                                </div>
                                            </div>
                                        )}

                                        {/* Form and Pricing Summary Card (Card 2) */}
                                        <div className="bg-white divide-y divide-gray-200">
                                            {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') ? (
                                                <div className="flex flex-col">


                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 pt-7">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>ยี่ห้อ <span className="text-red-500">*</span></Label>
                                                            </div>
                                                            <Combobox
                                                                options={
                                                                    formData.collateralType === 'moto' ? MOTO_BRANDS :
                                                                        formData.collateralType === 'truck' ? TRUCK_BRANDS :
                                                                            formData.collateralType === 'agri' ? AGRI_BRANDS :
                                                                                CAR_BRANDS
                                                                }
                                                                value={formData.brand}
                                                                onValueChange={(val) => {
                                                                    setFormData({ ...formData, brand: val, model: '', subModel: '' });
                                                                    setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'brand' && f !== 'model'));
                                                                }}
                                                                placeholder="เลือกยี่ห้อ..."
                                                                searchPlaceholder="ค้นหายี่ห้อ..."
                                                                emptyText="ไม่พบยี่ห้อที่ค้นหา"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>รุ่น <span className="text-red-500">*</span></Label>
                                                            </div>
                                                            <Combobox
                                                                options={MODELS_BY_BRAND[formData.brand] || []}
                                                                value={formData.model}
                                                                onValueChange={(val) => {
                                                                    setFormData({ ...formData, model: val });
                                                                    setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'model'));
                                                                }}
                                                                placeholder="เลือกรุ่น..."
                                                                searchPlaceholder="ค้นหารุ่น..."
                                                                emptyText="ไม่พบรุ่นที่ค้นหา"
                                                                className={!formData.brand ? "opacity-50 pointer-events-none" : ""}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>รุ่นปี (ค.ศ.) <span className="text-red-500">*</span></Label>
                                                            </div>
                                                            <Combobox
                                                                options={YEARS_AD}
                                                                value={formData.year}
                                                                onValueChange={(val) => {
                                                                    setFormData({ ...formData, year: val });
                                                                    setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'year'));
                                                                }}
                                                                placeholder="เลือกปี..."
                                                                searchPlaceholder="ค้นหาปี..."
                                                                emptyText="ไม่พบปีที่ค้นหา"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>รุ่นย่อย <span className="text-red-500">*</span></Label>
                                                            </div>
                                                            <Combobox
                                                                options={SUB_MODELS_BY_MODEL[formData.model] || []}
                                                                value={formData.subModel}
                                                                onValueChange={(val) => {
                                                                    setFormData({ ...formData, subModel: val });
                                                                    setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'subModel'));
                                                                }}
                                                                placeholder="เลือกรุ่นย่อย"
                                                                searchPlaceholder="ค้นหารุ่นย่อย"
                                                                emptyText="ไม่พบรุ่นที่ค้นหา"
                                                                className={!formData.model ? "opacity-50 pointer-events-none" : ""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                    {/* 1. ประเภท โฉนดที่ดิน */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-gray-700">ประเภทโฉนดที่ดิน <span className="text-red-500">*</span></Label>
                                                        <Select value={formData.landDeedType || ''} onValueChange={(val) => {
                                                            setFormData({ ...formData, landDeedType: val });
                                                        }}>
                                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                <SelectValue placeholder="เลือกประเภทโฉนด" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ns4">น.ส.4</SelectItem>
                                                                <SelectItem value="ns3k">น.ส.3ก</SelectItem>
                                                                <SelectItem value="orchor2">อ.ช.2</SelectItem>
                                                                <SelectItem value="trajong_deed">โฉนดตราจอง</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {formData.landDeedType === 'trajong_deed' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-700">
                                                                จังหวัดที่ระบุในโฉนดตราจอง <span className="text-red-500">*</span>
                                                            </Label>
                                                            <Select
                                                                value={formData.landProvince || ''}
                                                                onValueChange={(val) => setFormData({ ...formData, landProvince: val })}
                                                            >
                                                                <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                    <SelectValue placeholder="เลือกจังหวัด..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="phitsanulok">พิษณุโลก</SelectItem>
                                                                    <SelectItem value="sukhothai">สุโขทัย</SelectItem>
                                                                    <SelectItem value="phichit">พิจิตร</SelectItem>
                                                                    <SelectItem value="uttaradit">อุตรดิตถ์</SelectItem>
                                                                    <SelectItem value="nakhon_sawan">นครสวรรค์</SelectItem>
                                                                    <SelectItem value="other">จังหวัดอื่นๆ (ไม่อยู่ในเงื่อนไข)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}

                                                    {/* 6. ราคาประเมิน */}
                                                    {formData.landDeedType === 'orchor2' ? (
                                                        <div className="space-y-6 md:col-span-2">
                                                            {/* ราคาประเมินพื้นที่ห้องชุด Table */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-sm font-bold text-gray-700">ราคาประเมินพื้นที่ห้องชุด <span className="text-red-500">*</span></Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={(formData.condoUnitAppraisals || []).length >= CONDO_APPRAISAL_SOURCES.length}
                                                                        onClick={handleAddCondoUnitAppraisal}
                                                                        className="h-8 gap-1"
                                                                    >
                                                                        <Plus className="w-3 h-3" /> เพิ่มแหล่งข้อมูล
                                                                    </Button>
                                                                </div>
                                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                                    <Table className="table-fixed">
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="w-[45%] font-bold text-gray-600">แหล่งที่มา</TableHead>
                                                                                <TableHead className="w-auto text-right font-bold text-gray-600">ราคา (บาท)</TableHead>
                                                                                <TableHead className="w-12 text-center"></TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {(formData.condoUnitAppraisals || []).map((item: any, idx: number) => (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell className="font-medium text-gray-700">
                                                                                        <Select
                                                                                            value={item.source}
                                                                                            onValueChange={(val) => handleUpdateCondoUnitAppraisal(idx, 'source', val)}
                                                                                        >
                                                                                            <SelectTrigger className="h-10 bg-white">
                                                                                                <SelectValue placeholder="เลือกแหล่งที่มา" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {CONDO_APPRAISAL_SOURCES.map(source => {
                                                                                                    const isUsed = (formData.condoUnitAppraisals || []).some((a: any, i: number) => a.source === source.value && i !== idx);
                                                                                                    return (
                                                                                                        <SelectItem key={source.value} value={source.value} disabled={isUsed}>
                                                                                                            {source.label}
                                                                                                        </SelectItem>
                                                                                                    );
                                                                                                })}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Input
                                                                                            type="text"
                                                                                            className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                            value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                            onChange={(e) => handleUpdateCondoUnitAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                            placeholder="0"
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => handleRemoveCondoUnitAppraisal(idx)}
                                                                                            disabled={(formData.condoUnitAppraisals || []).length <= 1}
                                                                                            className={cn(
                                                                                                "h-8 w-8 p-0",
                                                                                                (formData.condoUnitAppraisals || []).length <= 1
                                                                                                    ? "text-gray-300 cursor-not-allowed"
                                                                                                    : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                                            )}
                                                                                        >
                                                                                            <X className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>

                                                            {/* ราคาประเมินพื้นที่ระเบียง Table */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-sm font-bold text-gray-700">ราคาประเมินพื้นที่ระเบียง</Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={handleAddCondoBalconyAppraisal}
                                                                        className="h-8 gap-1"
                                                                        disabled={(formData.condoBalconyAppraisals || []).length >= CONDO_APPRAISAL_SOURCES.length}
                                                                    >
                                                                        <Plus className="w-3 h-3" /> เพิ่มแหล่งข้อมูล
                                                                    </Button>
                                                                </div>
                                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                                    <Table className="table-fixed">
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="w-[45%] font-bold text-gray-600">แหล่งที่มา</TableHead>
                                                                                <TableHead className="w-auto text-right font-bold text-gray-600">ราคา (บาท)</TableHead>
                                                                                <TableHead className="w-12 text-center"></TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {(formData.condoBalconyAppraisals || []).map((item: any, idx: number) => (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell className="font-medium text-gray-700">
                                                                                        <Select
                                                                                            value={item.source}
                                                                                            onValueChange={(val) => handleUpdateCondoBalconyAppraisal(idx, 'source', val)}
                                                                                        >
                                                                                            <SelectTrigger className="h-10 bg-white">
                                                                                                <SelectValue placeholder="เลือกแหล่งที่มา" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {CONDO_APPRAISAL_SOURCES.map(source => {
                                                                                                    const isUsed = (formData.condoBalconyAppraisals || []).some((a: any, i: number) => a.source === source.value && i !== idx);
                                                                                                    return (
                                                                                                        <SelectItem key={source.value} value={source.value} disabled={isUsed}>
                                                                                                            {source.label}
                                                                                                        </SelectItem>
                                                                                                    );
                                                                                                })}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Input
                                                                                            type="text"
                                                                                            className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                            value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                            onChange={(e) => handleUpdateCondoBalconyAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                            placeholder="0"
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => handleRemoveCondoBalconyAppraisal(idx)}
                                                                                            disabled={(formData.condoBalconyAppraisals || []).length <= 1}
                                                                                            className={cn(
                                                                                                "h-8 w-8 p-0",
                                                                                                (formData.condoBalconyAppraisals || []).length <= 1
                                                                                                    ? "text-gray-300 cursor-not-allowed"
                                                                                                    : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                                            )}
                                                                                        >
                                                                                            <X className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center px-4 py-4 bg-chaiyo-blue/[0.03] border border-border-strong rounded-xl mt-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-chaiyo-blue/10 flex items-center justify-center">
                                                                        <Calculator className="w-4 h-4 text-chaiyo-blue" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-bold text-chaiyo-blue/60 uppercase tracking-widest leading-none mb-1">Grand Total</span>
                                                                        <span className="text-sm font-bold text-gray-700">รวมราคาประเมินห้องชุด</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-xl font-mono font-black text-chaiyo-blue leading-none">
                                                                        {Number(formData.appraisalPrice || 0).toLocaleString()}
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 inline-block">บาท (Baht)</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : ['ns4', 'ns3k', 'trajong_deed'].includes(formData.landDeedType) ? (
                                                        <div className="space-y-6 md:col-span-2">
                                                            {/* ราคาประเมินที่ดิน Table */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-sm font-bold text-gray-700">ราคาประเมินที่ดิน <span className="text-red-500">*</span></Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={handleAddLandAppraisal}
                                                                        className="h-8 gap-1"
                                                                        disabled={(formData.landAppraisals || []).length >= LAND_APPRAISAL_SOURCES.length}
                                                                    >
                                                                        <Plus className="w-3 h-3" /> เพิ่มแหล่งข้อมูล
                                                                    </Button>
                                                                </div>
                                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                                    <Table className="table-fixed">
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="w-[45%] font-bold text-gray-600">แหล่งที่มา</TableHead>
                                                                                <TableHead className="w-auto text-right font-bold text-gray-600">ราคา (บาท)</TableHead>
                                                                                <TableHead className="w-12 text-center"></TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {(formData.landAppraisals || []).map((item: any, idx: number) => (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell className="font-medium text-gray-700">
                                                                                        <Select
                                                                                            value={item.source}
                                                                                            onValueChange={(val) => handleUpdateLandAppraisal(idx, 'source', val)}
                                                                                        >
                                                                                            <SelectTrigger className="h-10 bg-white">
                                                                                                <SelectValue placeholder="เลือกแหล่งที่มา" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {LAND_APPRAISAL_SOURCES.map(source => {
                                                                                                    const isUsed = (formData.landAppraisals || []).some((a: any, i: number) => a.source === source.value && i !== idx);
                                                                                                    return (
                                                                                                        <SelectItem key={source.value} value={source.value} disabled={isUsed}>
                                                                                                            {source.label}
                                                                                                        </SelectItem>
                                                                                                    );
                                                                                                })}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Input
                                                                                            type="text"
                                                                                            className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                            value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                            onChange={(e) => handleUpdateLandAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                            placeholder="0"
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => handleRemoveLandAppraisal(idx)}
                                                                                            disabled={(formData.landAppraisals || []).length <= 1}
                                                                                            className={cn(
                                                                                                "h-8 w-8 p-0",
                                                                                                (formData.landAppraisals || []).length <= 1
                                                                                                    ? "text-gray-300 cursor-not-allowed"
                                                                                                    : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                                            )}
                                                                                        >
                                                                                            <X className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>

                                                            {/* ราคาประเมินสิ่งปลูกสร้าง Table */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-sm font-bold text-gray-700">ราคาประเมินสิ่งปลูกสร้าง</Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={handleAddBuildingAppraisal}
                                                                        className="h-8 gap-1"
                                                                        disabled={(formData.buildingAppraisals || []).length >= BUILDING_APPRAISAL_SOURCES.length}
                                                                    >
                                                                        <Plus className="w-3 h-3" /> เพิ่มแหล่งข้อมูล
                                                                    </Button>
                                                                </div>
                                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                                    <Table className="table-fixed">
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="w-[45%] font-bold text-gray-600">แหล่งที่มา</TableHead>
                                                                                <TableHead className="w-auto text-right font-bold text-gray-600">ราคา (บาท)</TableHead>
                                                                                <TableHead className="w-12 text-center"></TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {(formData.buildingAppraisals || []).map((item: any, idx: number) => (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell className="font-medium text-gray-700">
                                                                                        <Select
                                                                                            value={item.source}
                                                                                            onValueChange={(val) => handleUpdateBuildingAppraisal(idx, 'source', val)}
                                                                                        >
                                                                                            <SelectTrigger className="h-10 bg-white">
                                                                                                <SelectValue placeholder="เลือกแหล่งที่มา" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {BUILDING_APPRAISAL_SOURCES.map(source => {
                                                                                                    const isUsed = (formData.buildingAppraisals || []).some((a: any, i: number) => a.source === source.value && i !== idx);
                                                                                                    return (
                                                                                                        <SelectItem key={source.value} value={source.value} disabled={isUsed}>
                                                                                                            {source.label}
                                                                                                        </SelectItem>
                                                                                                    );
                                                                                                })}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Input
                                                                                            type="text"
                                                                                            className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                            value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                            onChange={(e) => handleUpdateBuildingAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                            placeholder="0"
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => handleRemoveBuildingAppraisal(idx)}
                                                                                            disabled={(formData.buildingAppraisals || []).length <= 1}
                                                                                            className={cn(
                                                                                                "h-8 w-8 p-0",
                                                                                                (formData.buildingAppraisals || []).length <= 1
                                                                                                    ? "text-gray-300 cursor-not-allowed"
                                                                                                    : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                                            )}
                                                                                        >
                                                                                            <X className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                                <div className="flex justify-between items-center px-4 py-4 bg-chaiyo-blue/[0.03] border border-border-strong rounded-xl mt-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-chaiyo-blue/10 flex items-center justify-center">
                                                                            <Calculator className="w-4 h-4 text-chaiyo-blue" />
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] font-bold text-chaiyo-blue/60 uppercase tracking-widest leading-none mb-1">Grand Total</span>
                                                                            <span className="text-sm font-bold text-gray-700">รวมราคาประเมินสุทธิ</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xl font-mono font-black text-chaiyo-blue leading-none">
                                                                            {Number(formData.appraisalPrice || 0).toLocaleString()}
                                                                        </div>
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 inline-block">บาท (Baht)</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 3. อายุสิ่งปลูกสร้าง (Visible only when building appraisals exist) */}
                                                            {formData.landDeedType !== 'orchor2' && (formData.buildingAppraisals || []).length > 0 && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm text-gray-700">อายุสิ่งปลูกสร้าง (ปี)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={formData.buildingAge || ''}
                                                                        onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                                                                        className="h-12 text-base rounded-xl"
                                                                        placeholder="กรอกอายุสิ่งปลูกสร้าง"
                                                                    />
                                                                </div>
                                                            )}


                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4 md:col-span-2 p-4 bg-gray-50 border border-border-strong rounded-xl">
                                                            <Label className="text-sm text-gray-700">ราคาประเมิน กรอก เบื้องต้น</Label>

                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-gray-500">แหล่งอ้างอิงราคาประเมิน</Label>
                                                                <Select value={formData.appraisalSource || ''} onValueChange={(val) => setFormData({ ...formData, appraisalSource: val })}>
                                                                    <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                        <SelectValue placeholder="เลือกแหล่งอ้างอิง" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="department_of_lands">กรมที่ดิน</SelectItem>
                                                                        <SelectItem value="external_appraisal">บ.ประเมินนอก</SelectItem>
                                                                        <SelectItem value="treasury_department">กรมธนารักษ์ (ที่ดินพร้อมสิ่งปลูกสร้าง, ห้องชุด)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-gray-500">ราคาที่ดิน (บาท)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        value={formData.appraisedLandPrice ? Number(formData.appraisedLandPrice).toLocaleString() : ''}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value.replace(/,/g, '');
                                                                            if (!isNaN(Number(value))) {
                                                                                const landPrice = Number(value) || 0;
                                                                                const buildingPrice = Number(formData.appraisedBuildingPrice) || 0;
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    appraisedLandPrice: value,
                                                                                    appraisalPrice: landPrice + buildingPrice
                                                                                });
                                                                            }
                                                                        }}
                                                                        className="h-12 text-base rounded-xl font-mono text-right"
                                                                        placeholder="0"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-gray-500">ราคาสิ่งปลูกสร้าง (บาท)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        value={formData.appraisedBuildingPrice ? Number(formData.appraisedBuildingPrice).toLocaleString() : ''}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value.replace(/,/g, '');
                                                                            if (!isNaN(Number(value))) {
                                                                                const buildingPrice = Number(value) || 0;
                                                                                const landPrice = Number(formData.appraisedLandPrice) || 0;
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    appraisedBuildingPrice: value,
                                                                                    appraisalPrice: landPrice + buildingPrice
                                                                                });
                                                                            }
                                                                        }}
                                                                        className="h-12 text-base rounded-xl font-mono text-right"
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 7. แสดง Sum รวม */}
                                                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                                <Label className="text-sm text-gray-700">ราคารวม (ที่ดิน + สิ่งปลูกสร้าง)</Label>
                                                                <span className="text-xl font-bold text-chaiyo-blue">
                                                                    {((Number(formData.appraisedLandPrice) || 0) + (Number(formData.appraisedBuildingPrice) || 0)).toLocaleString()} บาท
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                            {/* End of Form and Pricing Summary Card (Card 2) */}
                                        </div>

                                        {/* Dynamic Collateral Questions Card (Card 3) - Moved here from Section 2 */}
                                        {(() => {
                                            let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];

                                            // Special logic for Land: Filter by Deed Type per screenshot requirements
                                            if (formData.collateralType === 'land') {
                                                if (formData.landDeedType === 'orchor2') {
                                                    questions = []; // Hide all questions for OrChor 2
                                                }
                                            }

                                            if (questions.length === 0) return null;

                                            return (
                                                <div className="bg-white overflow-hidden">
                                                    {/* Accordion Header */}
                                                    <button
                                                        onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                                                        className={cn(
                                                            "w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50",
                                                            isQuestionsExpanded ? "bg-gray-50/50" : "bg-white"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-gray-900">ประเมินสภาพหลักประกัน</h4>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300",
                                                            isQuestionsExpanded ? "rotate-180" : ""
                                                        )}>
                                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                                        </div>
                                                    </button>

                                                    {/* Accordion Content */}
                                                    <div className={cn(
                                                        "divide-y divide-gray-100 transition-all duration-300 ease-in-out",
                                                        isQuestionsExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                                    )}>
                                                        {questions.map((q) => (
                                                            <div key={q.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
                                                                <div>
                                                                    <Label className=" font-bold">{q.text}</Label>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1.5 rounded-xl shrink-0">
                                                                    <button
                                                                        onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' } })}
                                                                        className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'yes' ? "bg-chaiyo-blue text-white" : "text-gray-500 hover:bg-gray-100")}
                                                                    >
                                                                        ใช่
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' } })}
                                                                        className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'no' ? "bg-chaiyo-blue text-white" : "text-gray-500 hover:bg-gray-100")}
                                                                    >
                                                                        ไม่ใช่
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Section 2: Borrower Info */}
                        <div className="relative pb-4">

                            <div className="space-y-3 mt-4">
                                <h3 className="text-xl font-bold text-gray-900">ข้อมูลลูกค้า</h3>
                                <div className="border border-border-strong rounded-xl bg-white overflow-hidden divide-y divide-border-subtle">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>กลุ่มลูกค้า <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={formData.customerGroup || 'thai'}
                                                    onValueChange={(val) => {
                                                        let nationality = 'thai';
                                                        let specialProject = 'none';

                                                        if (val === 'ethnic') {
                                                            nationality = 'ethnic';
                                                        } else if (val === 'b2b_payroll') {
                                                            specialProject = 'b2b_payroll';
                                                        }

                                                        setFormData({
                                                            ...formData,
                                                            customerGroup: val,
                                                            nationality,
                                                            specialProject
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger className="bg-white">
                                                        <SelectValue placeholder="เลือกกลุ่มลูกค้า" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="thai">คนไทย</SelectItem>
                                                        <SelectItem value="ethnic">กลุ่มชาติพันธุ์</SelectItem>
                                                        <SelectItem value="b2b_payroll">พนักงานบริษัทพันธมิตร (B2B Payroll)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>กลุ่มอาชีพ <span className="text-red-500">*</span></Label>
                                                <Select value={formData.occupationGroup} onValueChange={(val) => setFormData({ ...formData, occupationGroup: val })}>
                                                    <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกกลุ่มอาชีพ" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="employee">พนักงานประจำ/ข้าราชการ/ลูกจ้าง</SelectItem>
                                                        <SelectItem value="business_owner">เจ้าของกิจการ/ธุรกิจส่วนตัว/รับจ้าง</SelectItem>
                                                        <SelectItem value="farmer">เกษตรกร</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>อายุผู้กู้ (ปี) <span className="text-red-500">*</span></Label>
                                                <Input
                                                    type="number"
                                                    placeholder="เช่น 35"
                                                    value={formData.borrowerAge || ''}
                                                    onChange={(e) => setFormData({ ...formData, borrowerAge: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Income and Debt Breakdown */}
                                    <div className="bg-white">
                                        {/* Accordion Header */}
                                        <button
                                            onClick={() => setIsIncomeDebtExpanded(!isIncomeDebtExpanded)}
                                            className={cn(
                                                "w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50",
                                                isIncomeDebtExpanded ? "bg-gray-50/50" : "bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">ข้อมูลรายได้และภาระหนี้</h4>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300",
                                                isIncomeDebtExpanded ? "rotate-180" : ""
                                            )}>
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            </div>
                                        </button>

                                        {/* Accordion Content */}
                                        <div className={cn(
                                            "transition-all duration-300 ease-in-out overflow-hidden",
                                            isIncomeDebtExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                        )}>
                                            <div className="p-6 pt-0 space-y-8">
                                                <div className="space-y-4 pt-6">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-bold text-gray-700">รายได้รวม</Label>
                                                    </div>
                                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="font-bold text-gray-600">ประเภทรายได้</TableHead>
                                                                    <TableHead className="text-right font-bold text-gray-600 w-[300px]">จำนวนเงิน (บาท) / ต่อเดือน</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(formData.incomeBreakdown || []).filter((i: any) => i.source !== 'total').map((item: any, idx: number) => (
                                                                    <TableRow key={idx}>
                                                                        <TableCell className="font-medium text-gray-700">
                                                                            {item.label}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input
                                                                                type="text"
                                                                                className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                onChange={(e) => handleUpdateIncomeBreakdown(idx, e.target.value.replace(/,/g, ''))}
                                                                                placeholder="0"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                <TableRow className="bg-blue-50/30 hover:bg-blue-50/30">
                                                                    <TableCell className="font-bold text-gray-900 text-right">รวมรายได้ทั้งหมด</TableCell>
                                                                    <TableCell className="text-right border-l border-border-subtle pr-6">
                                                                        <span className="text-lg font-bold font-mono">
                                                                            {Number(formData.salary || 0).toLocaleString()}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-bold text-gray-700">ภาระหนี้สินรวม</Label>
                                                    </div>
                                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="font-bold text-gray-600">รายการภาระหนี้</TableHead>
                                                                    <TableHead className="text-right font-bold text-gray-600 w-[300px]">จำนวนเงิน (บาท) / ต่อเดือน</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(formData.debtBreakdown || []).map((item: any, idx: number) => (
                                                                    <TableRow key={idx}>
                                                                        <TableCell className="font-medium text-gray-700">
                                                                            {item.label}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input
                                                                                type="text"
                                                                                className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                                value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                                onChange={(e) => handleUpdateDebtBreakdown(idx, e.target.value.replace(/,/g, ''))}
                                                                                placeholder="0"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                                                    <TableCell className="font-bold text-gray-900 text-right">รวมภาระหนี้ทั้งหมด</TableCell>
                                                                    <TableCell className="text-right border-l border-border-subtle pr-6">
                                                                        <span className="text-lg font-bold font-mono">
                                                                            {Number(formData.monthlyDebt || 0).toLocaleString()}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Section 3: Loan Suggestion */}
                            <div className="relative pt-4">
                                <div className="space-y-3 mt-4">
                                    <h3 className="text-xl font-bold text-gray-900">ข้อมูลวงเงินที่ต้องการ</h3>
                                    <div className="border border-border-strong rounded-xl bg-white overflow-hidden divide-y divide-border-subtle">
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

                                                <div className="space-y-2">
                                                    <Label>ประเภทสินเชื่อ <span className="text-red-500">*</span></Label>
                                                    <Select value={formData.collateralStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, collateralStatus: val })}>
                                                        <SelectTrigger className="h-12 bg-white"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                            {formData.collateralType === 'land' ? (
                                                                <SelectItem value="pledge">Refinance</SelectItem>
                                                            ) : (
                                                                <>
                                                                    <SelectItem value="pledge">Refinance จากจำนำ</SelectItem>
                                                                    <SelectItem value="hire_purchase">Refinance จากเช่าซื้อ</SelectItem>
                                                                </>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>วงเงินที่ต้องการกู้ (บาท) <span className="text-red-500">*</span></Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="text"
                                                            className="h-12 pl-4 pr-12 text-xl font-mono border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                            value={formData.requestedAmount ? Number(formData.requestedAmount).toLocaleString() : ''}
                                                            onChange={(e) => {
                                                                const raw = e.target.value.replace(/,/g, '');
                                                                if (raw === '') {
                                                                    setFormData({ ...formData, requestedAmount: '' });
                                                                    return;
                                                                }
                                                                let val = Number(raw);
                                                                if (isNaN(val)) return;
                                                                setFormData({ ...formData, requestedAmount: String(val) });
                                                                setShowProducts(false);
                                                            }}
                                                            placeholder="0"
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                            บาท
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>จำนวนงวด (เดือน) <span className="text-red-500">*</span></Label>
                                                    <Select
                                                        value={String(formData.requestedDuration || 60)}
                                                        onValueChange={(val) => setFormData({ ...formData, requestedDuration: Number(val) })}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white">
                                                            <SelectValue placeholder="เลือกจำนวนงวด" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(TENURE_OPTIONS[formData.collateralType] || [12, 24, 36, 48, 60]).map(m => (
                                                                <SelectItem key={m} value={String(m)}>{m} งวด</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-end">
                                                    <Button
                                                        onClick={() => setShowProducts(true)}
                                                        className="h-12 w-full bg-chaiyo-blue text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        ค้นหาผลิตภัณฑ์
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {showProducts && (
                                            <div className="p-6 bg-gray-50/10 space-y-4">
                                                <div className="flex items-center gap-2 mb-2 text-chaiyo-blue">
                                                    <span className="font-bold">ข้อเสนอที่เหมาะสมสำหรับคุณ</span>
                                                </div>

                                                {productsToShow.length === 0 ? (
                                                    <div className="text-center py-10 px-4 bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center">
                                                        <p className="text-gray-500 text-sm">ไม่พบผลิตภัณฑ์ที่เหมาะสมกับเงื่อนไขปัจจุบัน</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {productsToShow.slice(0, 3).map((product, idx) => {
                                                            const actualReqAmount = Number(formData.requestedAmount || 0);
                                                            const maxAmount = Number(maxLoan || 0);
                                                            const requestedAmount = actualReqAmount > maxAmount ? maxAmount : actualReqAmount;
                                                            const hasDifferentMax = actualReqAmount < maxAmount && maxAmount > 0;

                                                            return (
                                                                <div key={product.code} className="bg-white rounded-2xl overflow-hidden border border-border-strong relative group w-full flex flex-col hover:shadow-md transition-all duration-300">
                                                                    {/* Header Section (Blue) */}
                                                                    <div className="p-6 text-white relative overflow-hidden transition-colors bg-chaiyo-blue">
                                                                        {(() => {
                                                                            const CollateralIcon = PRODUCTS.find(p => p.id === formData.collateralType)?.icon || Sparkles;
                                                                            return (
                                                                                <>
                                                                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                                                                    <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none rotate-12">
                                                                                        <CollateralIcon className="w-24 h-24" />
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        })()}
                                                                        <div className="flex justify-between items-start relative z-10">
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                                                    <div className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold backdrop-blur-sm tracking-widest uppercase">
                                                                                        {product.code}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={handlePrint}
                                                                                className=" bg-white rounded-full h-6 px-3 text-[11px] backdrop-blur-sm transition-all flex items-center gap-1.5 font-bold"
                                                                            >
                                                                                <span>ดูเอกสารประกอบ</span>
                                                                            </Button>
                                                                        </div>
                                                                        <h3 className="text-xl font-bold pr-4 mt-2">{product.name}</h3>


                                                                        {/* Loan Amount Blocks */}
                                                                        <div className={cn("mt-5 gap-2.5", hasDifferentMax ? "grid grid-cols-2" : "")}>
                                                                            {/* Requested Amount Block */}
                                                                            <div className="backdrop-blur-md rounded-2xl p-4 border bg-gradient-to-br from-white/20 to-white/5 border-white/20 shadow-inner group/amount transition-all duration-300">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-blue-200/90">
                                                                                        {actualReqAmount > maxAmount ? "วงเงินสูงสุดที่แนะนำ" : "วงเงินที่ต้องการ"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex items-baseline gap-1.5">
                                                                                    <span className="text-2xl font-black leading-none tracking-tighter">
                                                                                        {requestedAmount.toLocaleString()}
                                                                                    </span>
                                                                                    <span className="text-xs font-bold text-white/60">บาท</span>
                                                                                </div>
                                                                                <div className="border-t border-white/10 pt-2.5 mt-2.5">
                                                                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">ค่างวดประมาณ</p>
                                                                                    <div className="flex items-baseline gap-1">
                                                                                        <p className="font-black text-lg leading-tight text-white">
                                                                                            {(() => {
                                                                                                const duration = Number(formData.requestedDuration) || 12;
                                                                                                if (selectedPlan === 'balloon') {
                                                                                                    return calcBalloonMonthly(requestedAmount).toLocaleString();
                                                                                                }
                                                                                                return calcMonthly(requestedAmount, duration).toLocaleString();
                                                                                            })()}
                                                                                        </p>
                                                                                        <span className="text-[10px] font-bold text-white/50">บาท/งวด</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Max Amount Block (Only if different) */}
                                                                            {hasDifferentMax && (
                                                                                <div className="backdrop-blur-md rounded-2xl p-4 border bg-gradient-to-br from-chaiyo-gold/25 to-chaiyo-gold/10 border-chaiyo-gold/30 shadow-lg shadow-black/5 group/max transition-all duration-300">
                                                                                    <div className="flex items-center justify-between mb-2">
                                                                                        <div className="flex items-center gap-2">

                                                                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-chaiyo-gold">วงเงินสูงสุดที่แนะนำ</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-baseline gap-1.5">
                                                                                        <span className="text-2xl font-black leading-none tracking-tighter text-chaiyo-gold">
                                                                                            {maxAmount.toLocaleString()}
                                                                                        </span>
                                                                                        <span className="text-xs font-bold text-chaiyo-gold/60">บาท</span>
                                                                                    </div>
                                                                                    <div className="border-t border-chaiyo-gold/10 pt-2.5 mt-2.5">
                                                                                        <p className="text-chaiyo-gold/60 text-[10px] font-bold uppercase tracking-wider">ค่างวดประมาณ</p>
                                                                                        <div className="flex items-baseline gap-1">
                                                                                            <p className="font-black text-lg leading-tight text-chaiyo-gold">
                                                                                                {(() => {
                                                                                                    const duration = Number(formData.requestedDuration) || 12;
                                                                                                    if (selectedPlan === 'balloon') {
                                                                                                        return calcBalloonMonthly(maxAmount).toLocaleString();
                                                                                                    }
                                                                                                    return calcMonthly(maxAmount, duration).toLocaleString();
                                                                                                })()}
                                                                                            </p>
                                                                                            <span className="text-[10px] font-bold text-chaiyo-gold/50">บาท/งวด</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {/* Duration & Interest Row */}
                                                                        <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">ระยะเวลาผ่อน</p>
                                                                                <div className="flex items-baseline gap-1">
                                                                                    <span className="text-xl font-black text-white">{formData.requestedDuration}</span>
                                                                                    <span className="text-[10px] font-bold text-white/70">งวด</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-0.5 ">
                                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">อัตราดอกเบี้ย</p>
                                                                                <div className="flex items-baseline gap-1">
                                                                                    <span className="text-xl font-black text-white">{product.interestRate}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                    {/* Benefits Section */}
                                                                    <div className="p-6 bg-white flex-1 flex flex-col">
                                                                        <ul className="space-y-3 flex-1">
                                                                            {[...product.features]
                                                                                .filter(feature => feature.includes('บัตรเงินไชโย') || feature.includes('ประกันคุ้มครองวงเงินสินเชื่อ'))
                                                                                .map((feature, i) => {
                                                                                    const isCard = feature.includes('บัตรเงินไชโย');
                                                                                    const isInsurance = feature.includes('ประกันคุ้มครองวงเงินสินเชื่อ');
                                                                                    return (
                                                                                        <li key={i} className={cn(
                                                                                            "text-sm flex items-start gap-3 p-3 rounded-xl transition-all border",
                                                                                            isCard ? "bg-amber-50/50 border-amber-100" :
                                                                                                isInsurance ? "bg-blue-50/50 border-blue-100" :
                                                                                                    "bg-emerald-50/50 border-emerald-100"
                                                                                        )}>
                                                                                            <div className={cn(
                                                                                                "mt-0.5 rounded-full p-1 shrink-0",
                                                                                                isCard ? "bg-amber-100" :
                                                                                                    isInsurance ? "bg-blue-100" :
                                                                                                        "bg-emerald-100"
                                                                                            )}>
                                                                                                {isCard ? (
                                                                                                    <Gift className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                                                                                                ) : isInsurance ? (
                                                                                                    <ShieldCheck className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                                                                                                ) : (
                                                                                                    <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="flex-1">
                                                                                                <span className={cn(
                                                                                                    "leading-snug font-bold text-sm",
                                                                                                    isCard ? "text-amber-900" :
                                                                                                        isInsurance ? "text-blue-900" :
                                                                                                            "text-emerald-900"
                                                                                                )}>
                                                                                                    {feature.includes('บัตรเงินไชโย') ? 'ฟรี! บัตรเงินไชโย' : 'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ'}
                                                                                                </span>
                                                                                                <p className="text-xs text-gray-500 mt-0.5 font-normal leading-relaxed">
                                                                                                    {feature.includes('บัตรเงินไชโย')
                                                                                                        ? 'วงเงินหมุนเวียนพร้อมใช้ จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น ไม่มีค่าธรรมเนียม'
                                                                                                        : 'รับความคุ้มครองทันที คุ้มครองวงเงินสินเชื่อ อุ่นใจตลอดสัญญา ไม่มีค่าใช้จ่ายเพิ่มเติม'
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                            {isCard && (
                                                                                                <div className="shrink-0 ml-2">
                                                                                                    <img
                                                                                                        src="/images/chaiyo-card.svg"
                                                                                                        alt="Chaiyo Card"
                                                                                                        className="w-16 h-auto drop-shadow-sm rounded"
                                                                                                    />
                                                                                                </div>
                                                                                            )}
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                        </ul>

                                                                        {/* Footer (Actions) */}
                                                                        <div className="mt-4 flex pt-4 border-t border-gray-100">
                                                                            <Button size="lg" onClick={handleCreateApplication} className="w-full font-bold bg-chaiyo-blue text-white hover:bg-blue-800 rounded-xl h-12 shadow-sm transition-all">เลือก</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Recommended Products Step */}
                {
                    currentStep === 2 && false && (() => {
                        // Determined loan product name
                        const loanProduct = (() => {
                            switch (formData.collateralType) {
                                case 'land': return { name: 'สินเชื่อโฉนดที่ดิน', tagline: 'สินเชื่อโฉนดที่ดินไชโย' };
                                case 'moto': return { name: 'สินเชื่อรถจักรยานยนต์', tagline: 'สินเชื่อรถจักรยานยนต์ไชโย' };
                                case 'truck': return { name: 'สินเชื่อรถบรรทุก', tagline: 'สินเชื่อรถบรรทุกไชโย' };
                                case 'agri': return { name: 'สินเชื่อรถเก่าเพื่อการเกษตร', tagline: 'สินเชื่อรถเก่าเพื่อการเกษตรไชโย' };
                                default: return { name: 'สินเชื่อรถยนต์', tagline: 'สินเชื่อรถยนต์ไชโย' };
                            }
                        })();

                        const exampleMonths = [12, 24, 36, 48, 60];

                        // Document checklist per collateral type & plan
                        type SectionGroup = { title: string; items: string[] };
                        const documentChecklist: { label: string; items: (string | SectionGroup)[] } = (() => {
                            const common = [
                                'บัตรประชาชนตัวจริง (ผู้กู้)',
                                'ทะเบียนบ้าน (สำเนา)',
                                'รูปถ่ายหน้าตรงคู่บัตรประชาชน',
                            ];

                            const isVehicle = ['car', 'moto', 'truck'].includes(formData.collateralType || '');

                            if (isVehicle) {
                                return {
                                    label: `เอกสารสำหรับ${loanProduct.name} (${selectedPlan === 'monthly' ? 'ผ่อนรายเดือน' : 'One-Time'})`,
                                    items: [
                                        {
                                            title: "ยืนยันตัวตน",
                                            items: [
                                                "สำเนาบัตรประชาชน ผู้กู้",
                                                "สำเนาบัตรประชาชน ผู้ค้ำประกัน (ถ้ามี)",
                                                "ใบเปลี่ยนชื่อ-นามสกุล ผู้กู้ (ถ้ามี)"
                                            ]
                                        },
                                        {
                                            title: "ตรวจสอบหลักประกัน / รูปถ่ายหลักประกัน (Time Stamp)",
                                            items: [
                                                "รูปหลังรถเห็นป้ายทะเบียน พร้อม เซลฟี่-ถือบัตรพนักงาน",
                                                "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์",
                                                "รูปหน้ารถ - เฉียงซ้าย45องศา",
                                                "รูปหน้ารถ - เฉียงขวา45องศา",
                                                "รูปหลังรถ - เฉียงซ้าย45องศา",
                                                "รูปหลังรถ - เฉียงขวา45องศา",
                                                "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ",
                                                "รูปเลขตัวถัง/คัสซี",
                                                formData.collateralType === 'truck' ? "รูปเกียร์ 4x4 / 4WD (ถ้ามี)_สำหรับรถกระบะที่ขับเคลื่อน 4ล้อ" : null
                                            ].filter(Boolean) as string[]
                                        },
                                        {
                                            title: "หลักประกัน / เล่มทะเบียน เอกสารตรวจหลักประกัน (Time Stamp)",
                                            items: [
                                                "รูปถ่ายเล่มทะเบียน หน้าปก",
                                                "รูปถ่ายเล่มทะเบียน หน้ารายการจดทะเบียน",
                                                "รูปถ่ายเล่มทะเบียน หน้ากลางเล่ม",
                                                "รูปถ่ายเล่มทะเบียน หน้ารายการภาษี",
                                                "รูปถ่ายเล่มทะเบียน หน้าบันทึกเจ้าหน้าที่",
                                                "ผลเช็คต้น (ตามเงื่อนไข)",
                                                "หน้าตรวจสอบการชำระภาษีจากเว็ปกรมการขนส่งทางบก"
                                            ]
                                        },
                                        {
                                            title: "พิจารณาอนุมัติสินเชื่อ",
                                            items: [
                                                "สำเนาสมุดคู่ฝากธนาคารเพื่อใช้ในการโอนเงิน (บัญชีของลูกค้าเท่านั้น)",
                                                "ใบประเมินความสามารถลูกค้า (ผ่าน Branch App)",
                                                "แบบฟอร์มตรวจที่พักอาศัย (ถ้ามี)",
                                                "อีเมลผล ABC (ถ้ามี)"
                                            ]
                                        },
                                        {
                                            title: "รายได้",
                                            items: [
                                                "แบบฟอร์มประเมินรายได้ ผู้กู้",
                                                "แบบฟอร์มประเมินรายได้ ผู้ค้ำ (ถ้ามี)",
                                                "เอกสารรายได้ ของผู้กู้ (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                                "เอกสารรายได้ ของผู้ค้ำ (ถ้ามี) (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                                "แบบฟอร์มตรวจสอบภาคสนาม และข้อมูลบุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)"
                                            ]
                                        },
                                        {
                                            title: "เอกสารยืนยันการประกอบอาชีพ",
                                            items: [
                                                "รูปถ่ายกิจการ ของผู้กู้ (Time Stamp)",
                                                "รูปถ่ายกิจการ ของผู้ค้ำ (ถ้ามี) (Time Stamp)"
                                            ]
                                        },
                                        {
                                            title: "เอกสารอนุโลม",
                                            items: [
                                                "อนุโลม ผู้กู้ทำหรือไม่ทำประกัน ( PA Safty Loan) / ประกันภัยรถยนต์"
                                            ]
                                        }
                                    ]
                                };
                            }

                            switch (formData.collateralType) {
                                case 'agri':
                                    return {
                                        label: 'เอกสารสำหรับสินเชื่อเครื่องจักรเกษตร',
                                        items: [
                                            ...common,
                                            'เล่มทะเบียนเครื่องจักร หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย',
                                            'รูปถ่ายเครื่องจักร (4 ด้าน)',
                                            'หลักฐานการครอบครอง',
                                        ]
                                    };
                                case 'land':
                                    return {
                                        label: 'เอกสารสำหรับสินเชื่อโฉนดที่ดิน',
                                        items: [
                                            ...common,
                                            'โฉนดที่ดิน (ตัวจริง)',
                                            'รูปถ่ายที่ดิน (ภาพรวม + 4 ด้าน)',
                                            'แผนที่ที่ตั้งที่ดิน / Google Maps Pin',
                                            'หนังสือยินยอมคู่สมรส (ถ้ามี)',
                                        ]
                                    };
                                default:
                                    return { label: 'เอกสารที่ต้องใช้', items: common };
                            }
                        })();

                        const hasBalloonOpt = ['truck', 'agri', 'land'].includes(formData.collateralType);

                        return (
                            <div className="max-w-7xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
                                {/* Header */}
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-bold text-gray-800">คำนวณสินเชื่อ / แนะนำสินค้า</h2>
                                    <p className="text-gray-500">คำนวณค่างวดและเลือกผลิตภัณฑ์ที่เหมาะสม</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    {/* Left Container: Calculator */}
                                    <div className="bg-white rounded-2xl border border-border-strong p-8 space-y-8 h-fit">


                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-base font-bold text-gray-700">สินเชื่อที่ต้องการ <span className="text-red-500">*</span></Label>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</div>
                                                <Input
                                                    type="text"
                                                    placeholder="ระบุวงเงินที่ต้องการ"
                                                    value={formData.requestedAmount ? Number(formData.requestedAmount).toLocaleString() : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/,/g, '');
                                                        if (value === '') {
                                                            setFormData({ ...formData, requestedAmount: '' });
                                                            return;
                                                        }
                                                        if (!isNaN(Number(value))) {
                                                            setFormData({ ...formData, requestedAmount: value });
                                                        }
                                                    }}
                                                    className="pl-10 text-right text-lg font-mono border focus:border-chaiyo-blue transition-all h-14 rounded-xl"
                                                />
                                            </div>
                                            <div className="pt-4 px-2">
                                                <Slider
                                                    value={[Number(formData.requestedAmount) || Math.min(maxLoan, 100000)]}
                                                    max={maxLoan}
                                                    min={10000}
                                                    step={1000}
                                                    onValueChange={(vals) => setFormData({ ...formData, requestedAmount: vals[0] })}
                                                    className="[&_[role=slider]]:bg-chaiyo-blue [&_[role=slider]]:border-chaiyo-blue [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
                                                />
                                                <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
                                                    <span>10,000</span>
                                                    <div className="flex items-center gap-1.5 text-chaiyo-blue">
                                                        <span>วงเงินสูงสุด: {maxLoan.toLocaleString()}</span>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <button className="p-1 hover:bg-blue-50 rounded-full transition-colors">
                                                                    <Info className="w-3.5 h-3.5" />
                                                                </button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80 p-0 overflow-hidden border-none shadow-xl" align="end">
                                                                <div className="bg-chaiyo-blue p-3 text-white">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calculator className="w-4 h-4" />
                                                                        <span className="font-bold text-sm">รายละเอียดการคำนวณวงเงิน</span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 bg-white space-y-4">
                                                                    {formData.collateralType === 'land' && calculatedLandResult ? (
                                                                        <div className="space-y-3">
                                                                            <div className="space-y-2">
                                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ส่วนประกอบหลักประกัน</p>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-500">ที่ดิน ({calculatedLandResult!.chosenLand.label})</span>
                                                                                    <span className="font-mono font-bold text-gray-900">{calculatedLandResult!.chosenLand.limit.toLocaleString()}</span>
                                                                                </div>
                                                                                {!calculatedLandResult!.isLandOnly && (
                                                                                    <div className="flex justify-between text-sm">
                                                                                        <span className="text-gray-500">สิ่งปลูกสร้าง ({calculatedLandResult!.chosenBuilding.label})</span>
                                                                                        <span className="font-mono font-bold text-gray-900">{calculatedLandResult!.chosenBuilding.limit.toLocaleString()}</span>
                                                                                    </div>
                                                                                )}
                                                                                <div className="pt-2 border-t border-dashed flex justify-between text-sm font-bold">
                                                                                    <span className="text-gray-900">รวมวงเงินประเมิน</span>
                                                                                    <span className="font-mono text-blue-600">{calculatedLandResult!.finalAppraisalPrice.toLocaleString()}</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">เงื่อนไขและข้อจำกัด</p>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-500">LTV Cap ({(calculatedLandResult!.capLtv * 100).toFixed(0)}%)</span>
                                                                                    <span className="font-mono text-gray-600">{(calculatedLandResult!.basePriceTotal * calculatedLandResult!.capLtv).toLocaleString()}</span>
                                                                                </div>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-500">Absolute Cap</span>
                                                                                    <span className="font-mono text-gray-600">{calculatedLandResult!.isLandOnly ? "220,000" : "5,000,000"}</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                                                                                <span className="text-xs font-bold text-chaiyo-blue">สรุปวงเงินสูงสุด</span>
                                                                                <span className="font-mono font-black text-chaiyo-blue">{maxLoan.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-3">
                                                                            <div className="flex justify-between text-sm">
                                                                                <span className="text-gray-500">ราคาประเมินกลาง</span>
                                                                                <span className="font-mono font-bold text-gray-900">{Number(formData.appraisalPrice || 0).toLocaleString()}</span>
                                                                            </div>

                                                                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ตัวคูณ LTV</p>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-500">ฐาน LTV ปกติ</span>
                                                                                    <span className="font-mono text-gray-600">80%</span>
                                                                                </div>
                                                                                {formData.specialProject === 'b2b_payroll' && (
                                                                                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                                                                        <span>โบนัส B2B Payroll</span>
                                                                                        <span className="font-mono">+10%</span>
                                                                                    </div>
                                                                                )}
                                                                                {formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner' && (
                                                                                    <div className="flex justify-between text-sm text-red-500 font-medium">
                                                                                        <span>กลุ่มเสี่ยง Isan Business Owner</span>
                                                                                        <span className="font-mono">-5%</span>
                                                                                    </div>
                                                                                )}
                                                                                <div className="pt-2 border-t border-dashed flex justify-between text-sm font-bold">
                                                                                    <span className="text-gray-900">LTV สุทธิ</span>
                                                                                    <span className="font-mono text-blue-600">
                                                                                        {(() => {
                                                                                            let baseLTV = 0.80;
                                                                                            if (formData.specialProject === 'b2b_payroll') baseLTV += 0.10;
                                                                                            if (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') baseLTV -= 0.05;
                                                                                            return (Math.min(baseLTV, 1.20) * 100).toFixed(0);
                                                                                        })()}%
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                                                                                <span className="text-xs font-bold text-chaiyo-blue">สรุปวงเงินสูงสุด</span>
                                                                                <span className="font-mono font-black text-chaiyo-blue">{maxLoan.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-[10px] text-gray-400 leading-relaxed italic">* อ้างอิงตามเกณฑ์การพิจารณาสินเชื่อเบื้องต้นของบริษัทฯ วงเงินอนุมัติจริงอาจเปลี่ยนแปลงตามเงื่อนไขอื่นๆ</p>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {hasBalloonOpt && (
                                            <div className="space-y-4">
                                                <Label className="text-base font-bold text-gray-700">รูปแบบการผ่อนชำระ <span className="text-red-500">*</span></Label>
                                                <RadioGroup
                                                    value={selectedPlan}
                                                    onValueChange={(val) => {
                                                        setSelectedPlan(val as 'monthly' | 'balloon');
                                                        let newDuration = 12;
                                                        if (val === 'balloon') {
                                                            newDuration = 1;
                                                        } else {
                                                            const opts = TENURE_OPTIONS[formData.collateralType]?.filter(d => d >= 12) || [12];
                                                            newDuration = opts[0] || 12;
                                                        }
                                                        setFormData({ ...formData, requestedDuration: newDuration });
                                                    }}
                                                    className="grid grid-cols-2 gap-3 pt-2"
                                                >
                                                    <div>
                                                        <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="monthly"
                                                            className="flex flex-col items-center justify-between rounded-xl border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-chaiyo-blue peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-chaiyo-blue cursor-pointer transition-all"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                                                    selectedPlan === 'monthly' ? "border-chaiyo-blue border-[5px]" : ""
                                                                )} />
                                                                <span className={cn(
                                                                    "font-bold text-sm",
                                                                    selectedPlan === 'monthly' ? "text-chaiyo-blue" : "text-gray-500"
                                                                )}>ผ่อนรายเดือน</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-600 text-center font-normal">ชำระค่างวดเท่ากันทุกเดือน</p>
                                                        </Label>
                                                    </div>

                                                    <div>
                                                        <RadioGroupItem value="balloon" id="balloon" className="peer sr-only" />
                                                        <Label
                                                            htmlFor="balloon"
                                                            className="flex flex-col items-center justify-between rounded-xl border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-chaiyo-blue peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-chaiyo-blue cursor-pointer transition-all"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                                                    selectedPlan === 'balloon' ? "border-chaiyo-blue border-[5px]" : ""
                                                                )} />
                                                                <span className={cn(
                                                                    "font-bold text-sm",
                                                                    selectedPlan === 'balloon' ? "text-chaiyo-blue" : "text-gray-500"
                                                                )}>โปะงวดสุดท้าย</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-600 text-center font-normal">ผ่อนสบาย จ่ายปิดงวดสุดท้าย</p>
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <Label className="text-base font-bold text-gray-700">ระยะเวลาผ่อนชำระ (เดือน) <span className="text-red-500">*</span></Label>
                                            <div className="grid grid-cols-4 gap-2 pt-2">
                                                {(() => {
                                                    let durations = TENURE_OPTIONS[formData.collateralType] || [];
                                                    if (hasBalloonOpt && selectedPlan === 'balloon') {
                                                        durations = [1, 2, 3, 4];
                                                    } else {
                                                        durations = (TENURE_OPTIONS[formData.collateralType] || []).filter(d => d >= 12);
                                                    }
                                                    return durations.map((months) => {
                                                        const amount = Number(formData.requestedAmount) || 0;
                                                        const installment = selectedPlan === 'balloon' ? calcBalloonMonthly(amount) : calcMonthly(amount, months);

                                                        return (
                                                            <button
                                                                key={months}
                                                                onClick={() => setFormData({ ...formData, requestedDuration: months })}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all h-fit min-h-[64px]",
                                                                    formData.requestedDuration === months
                                                                        ? "border-chaiyo-blue bg-blue-50 text-chaiyo-blue shadow-sm"
                                                                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <span className="text-base font-bold leading-tight">{months} <span className="text-[10px] font-normal">ด.</span></span>
                                                                <span className={cn(
                                                                    "text-[10px] font-bold mt-1",
                                                                    formData.requestedDuration === months ? "text-chaiyo-blue" : "text-gray-400"
                                                                )}>
                                                                    {installment.toLocaleString()} บาท
                                                                </span>
                                                            </button>
                                                        );
                                                    });
                                                })()}
                                            </div>



                                        </div>
                                    </div>

                                    {/* Right Container: Product Suggestions */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-6">
                                            {productsToShow.length === 0 ? (
                                                <div className="text-center py-16 px-4 bg-gray-50 border border-border-strong rounded-2xl flex flex-col items-center justify-center col-span-full">
                                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                                        <FileText className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2">ไม่พบผลิตภัณฑ์ที่เหมาะสม</h3>
                                                    <p className="text-gray-500 text-sm">กรุณาปรับเปลี่ยนเงื่อนไขเช่น อายุ สัญชาติ รูปแบบผ่อน หรือวงเงินกู้ เพื่อดูผลิตภัณฑ์อื่น ๆ</p>
                                                </div>
                                            ) : (
                                                productsToShow.map(product => {
                                                    const actualReqAmount = Number(formData.requestedAmount || 0);
                                                    const maxLoanAmount = Number(maxLoan || 0);
                                                    const displayAmount = actualReqAmount > maxLoanAmount ? maxLoanAmount : actualReqAmount;

                                                    return (
                                                        <div key={product.code} className="bg-white rounded-2xl overflow-hidden border border-border-strong relative group w-full flex flex-col hover:shadow-md transition-all duration-300">
                                                            <div className="p-6 text-white relative overflow-hidden bg-chaiyo-blue transition-colors">
                                                                {(() => {
                                                                    const CollateralIcon = PRODUCTS.find(p => p.id === formData.collateralType)?.icon || Sparkles;
                                                                    return (
                                                                        <>
                                                                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                                                            <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none rotate-12">
                                                                                <CollateralIcon className="w-24 h-24" />
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                                <div className="flex justify-between items-start relative z-10">
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                                            <div className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm border border-white/10 tracking-widest uppercase">
                                                                                {product.code}
                                                                            </div>
                                                                            <div className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold backdrop-blur-sm border border-white/5">
                                                                                {formData.requestedDuration} งวด
                                                                            </div>
                                                                            <div className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold backdrop-blur-sm border border-white/5">
                                                                                {product.interestRate}
                                                                            </div>
                                                                            {parseFloat(product.interestRate) < 23.99 && (
                                                                                <div className="px-2.5 py-0.5 rounded-full bg-chaiyo-gold text-chaiyo-blue text-[10px] font-bold shadow-sm flex items-center gap-1 animate-pulse">
                                                                                    <Star className="w-3 h-3 fill-chaiyo-blue" />
                                                                                    ดอกเบี้ยพิเศษ
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <h3 className="text-xl font-bold pr-4">{product.name}</h3>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={handlePrint}
                                                                        className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full h-8 px-3 text-[11px] backdrop-blur-sm transition-all flex items-center gap-1.5 font-bold"
                                                                    >
                                                                        <FileText className="w-3.5 h-3.5" />
                                                                        <span>อ่าน Salesheet</span>
                                                                    </Button>
                                                                </div>

                                                                {/* วงเงิน Hero Strip */}
                                                                <div className="mt-5 bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                                                                            {actualReqAmount > maxLoanAmount ? "วงเงินสูงสุดที่แนะนำ" : "วงเงินที่ต้องการ"}
                                                                        </p>
                                                                        <div className="flex items-baseline gap-1.5">
                                                                            <span className="text-3xl font-black text-white leading-none tracking-tight">
                                                                                {displayAmount.toLocaleString()}
                                                                            </span>
                                                                            <span className="text-sm font-bold text-white/70">บาท</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                                                                        <p className="text-white/70 text-[10px] uppercase tracking-wider">ค่างวดประมาณ</p>
                                                                        <p className="font-bold text-md leading-tight text-white">
                                                                            {(() => {
                                                                                const duration = Number(formData.requestedDuration) || 12;
                                                                                if (selectedPlan === 'balloon') {
                                                                                    return calcBalloonMonthly(displayAmount).toLocaleString();
                                                                                }
                                                                                return calcMonthly(displayAmount, duration).toLocaleString();
                                                                            })()}
                                                                            <span className="text-[10px] font-normal opacity-80 ml-1">บาท/งวด</span>
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="p-6 bg-white flex-1 flex flex-col">
                                                                {selectedPlan === 'balloon' && (
                                                                    <div className="bg-blue-50/50 py-3 px-4 rounded-xl border border-blue-100/50 flex flex-col items-center mb-6">
                                                                        <div className="text-[10px] font-bold text-chaiyo-blue mb-0.5 uppercase tracking-wider">เงินต้นคงเหลือชำระงวดสุดท้าย</div>
                                                                        <div className="text-2xl font-black text-chaiyo-blue tracking-tight leading-none">
                                                                            {displayAmount.toLocaleString()}
                                                                            <span className="text-[10px] font-bold text-gray-400 ml-1.5 uppercase">บาท</span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <ul className="space-y-3 flex-1">
                                                                    {[...product.features]
                                                                        .filter(feature => feature.includes('บัตรเงินไชโย') || feature.includes('ประกันคุ้มครองวงเงินสินเชื่อ')) // Only show these
                                                                        .map((feature, i) => {
                                                                            const isCard = feature.includes('บัตรเงินไชโย');
                                                                            const isInsurance = feature.includes('ประกันคุ้มครองวงเงินสินเชื่อ');
                                                                            return (
                                                                                <li key={i} className={cn(
                                                                                    "text-sm flex items-start gap-3 p-3 rounded-xl transition-all border",
                                                                                    isCard ? "bg-amber-50/50 border-amber-100" :
                                                                                        isInsurance ? "bg-blue-50/50 border-blue-100" :
                                                                                            "bg-emerald-50/50 border-emerald-100"
                                                                                )}>
                                                                                    <div className={cn(
                                                                                        "mt-0.5 rounded-full p-1 shrink-0",
                                                                                        isCard ? "bg-amber-100" :
                                                                                            isInsurance ? "bg-blue-100" :
                                                                                                "bg-emerald-100"
                                                                                    )}>
                                                                                        {isCard ? (
                                                                                            <Gift className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                                                                                        ) : isInsurance ? (
                                                                                            <ShieldCheck className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                                                                                        ) : (
                                                                                            <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <span className={cn(
                                                                                            "leading-snug font-bold text-sm",
                                                                                            isCard ? "text-amber-900" :
                                                                                                isInsurance ? "text-blue-900" :
                                                                                                    "text-emerald-900"
                                                                                        )}>
                                                                                            {feature.includes('บัตรเงินไชโย') ? 'ฟรี! บัตรเงินไชโย' : 'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ'}
                                                                                        </span>
                                                                                        <p className="text-xs text-gray-500 mt-0.5 font-normal leading-relaxed">
                                                                                            {feature.includes('บัตรเงินไชโย')
                                                                                                ? 'วงเงินหมุนเวียนพร้อมใช้ จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น ไม่มีค่าธรรมเนียม'
                                                                                                : 'รับความคุ้มครองทันที คุ้มครองวงเงินสินเชื่อ อุ่นใจตลอดสัญญา ไม่มีค่าใช้จ่ายเพิ่มเติม'
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    {isCard && (
                                                                                        <div className="shrink-0 ml-2">
                                                                                            <img
                                                                                                src="/images/chaiyo-card.svg"
                                                                                                alt="Chaiyo Card"
                                                                                                className="w-16 h-auto drop-shadow-sm rounded"
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                </ul>
                                                                <div className="mt-4 flex pt-4 border-t border-gray-100">
                                                                    <Button size="lg" onClick={handleCreateApplication} className="w-full font-bold bg-chaiyo-blue text-white hover:bg-blue-800 rounded-xl h-12 shadow-sm transition-all">เลือก</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="bg-white p-6 rounded-2xl border border-border-strong flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        onClick={prevStep}
                                        className="w-full md:w-auto px-8 font-bold rounded-xl border"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        ย้อนกลับ
                                    </Button>
                                </div>
                            </div>
                        );
                    })()
                }



                {/* Hidden Print Component */}
                <QuotationPrint
                    data={{
                        collateralType: formData.collateralType,
                        estimatedValue: formData.appraisalPrice,
                        loanAmount: formData.requestedAmount,
                        duration: formData.requestedDuration,
                        monthlyPayment: formData.estimatedMonthlyPayment || 0,
                        interestRate: formData.interestRate || 0.2399,
                        totalInterest: formData.totalInterest || 0,
                        // Vehicle
                        brand: formData.brand,
                        model: formData.model,
                        year: formData.year,
                        // Land
                        landRai: formData.landRai,
                        landNgan: formData.landNgan,
                        landWah: formData.landWah,
                        province: formData.province,
                        // Finance
                        paymentMethod: formData.paymentMethod,
                        income: formData.income,
                        monthlyDebt: formData.monthlyDebt,
                        occupation: formData.occupation
                    }}
                />
                {/* Lightbox / Gallery View */}
                {
                    lightboxIndex !== null && (
                        <div
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            {/* Navigation */}
                            {uploadedDocs.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(prev => prev !== null ? (prev - 1 + uploadedDocs.length) % uploadedDocs.length : 0);
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <ChevronLeft className="w-10 h-10" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(prev => prev !== null ? (prev + 1) % uploadedDocs.length : 0);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <ChevronRight className="w-10 h-10" />
                                    </button>
                                </>
                            )}

                            {/* Main Image */}
                            <img
                                src={uploadedDocs[lightboxIndex]}
                                alt={`Document ${lightboxIndex + 1}`}
                                className="max-h-[80vh] max-w-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                                {uploadedDocs.map((doc, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        className={cn(
                                            "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                            idx === lightboxIndex ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                        )}
                                    >
                                        <img src={doc} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                                {lightboxIndex + 1} / {uploadedDocs.length}
                            </div>
                        </div>
                    )
                }
                {/* Condition Warning Dialog */}
                <AlertDialog open={isConditionDialogOpen} onOpenChange={setIsConditionDialogOpen}>
                    <AlertDialogContent className="max-w-[400px]">
                        <AlertDialogHeader className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900 leading-tight">คุณสมบัติไม่เป็นไปตามเงื่อนไข</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mt-2">
                                ข้อมูลของผู้กู้หรือข้อมูลหลักประกัน <span className="font-bold text-red-600">ไม่ตรงตามเงื่อนไขเบื้องต้น</span> ของบริษัทฯ
                                <br /><br />
                                กรุณาตรวจสอบความถูกต้องของข้อมูลอีกครั้ง หรือติดต่อผู้จัดการอาวุโสเพื่อขอคำแนะนำเพิ่มเติม
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center mt-2">
                            <AlertDialogAction
                                onClick={() => setIsConditionDialogOpen(false)}
                                className="bg-chaiyo-blue hover:bg-blue-800 text-white font-bold px-8 py-2 rounded-xl h-11 min-w-[120px]"
                            >
                                รับทราบ
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

export default function PreQuestionPage() {
    return (
        <Suspense fallback={<div className="flex justify-center flex-col items-center h-full min-h-[50vh]"><p className="text-gray-500">กำลังโหลด...</p></div>}>
            <PreQuestionPageContent />
        </Suspense>
    );
}
