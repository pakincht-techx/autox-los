"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import type { DevRole } from '@/components/layout/SidebarContext';

export default function Home() {
  const [devRole, setDevRole] = useState<DevRole>('branch-staff');

  // Read initial value from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('devRole');
    if (stored === 'branch-staff' || stored === 'legal-team') {
      setDevRole(stored);
    }
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as DevRole;
    setDevRole(role);
    localStorage.setItem('devRole', role);
  };

  return (
    <div className="min-h-screen bg-chaiyo-blue flex flex-col md:flex-row p-4 md:p-5 gap-4 md:gap-0">
      {/* Left Panel - Full Image with Radius */}
      <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full rounded-[32px] overflow-hidden shadow-sm">
        <Image
          src="/images/farmer-2.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
        {/* Logo at top left of image */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/images/logo-chaiyo-horizontal.svg"
            alt="Chaiyo Logo"
            width={160}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Panel - Chaiyo Blue */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 relative bg-chaiyo-blue rounded-[32px] shadow-sm text-white">
        {/* Form / Main Action Container */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-12">
          <h2 className="text-[32px] md:text-[40px] font-bold mb-2 tracking-tight text-white">
            ยินดีต้อนรับ
          </h2>
          <p className="text-white/80 mb-10 text-[16px] leading-relaxed">
            กรุณาคลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบขอสินเชื่อ
          </p>

          {/* Dev Role Switcher */}
          <div className="mb-6">
            <label htmlFor="dev-role-select" className="block text-xs font-medium text-white/60 mb-1.5">
              สลับบทบาท (Dev)
            </label>
            <select
              id="dev-role-select"
              value={devRole}
              onChange={handleRoleChange}
              className="w-full rounded-lg border border-white/20 bg-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="branch-staff" className="text-gray-900">พนักงานสาขา</option>
              <option value="legal-team" className="text-gray-900">ทีม Legal</option>
            </select>
          </div>

          <Link href="/dashboard/applications" className="w-full">
            <Button size="xl" variant="accent" className="w-full text-lg shadow-lg">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>

        <div className="mt-auto pt-8 border-t border-white/10 flex justify-center">
          <p className="text-xs text-white/50">© {new Date().getFullYear() + 543} AutoX Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
