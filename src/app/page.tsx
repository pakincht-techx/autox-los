import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function Home() {
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
        {/* Top Header - Logo with White Backdrop for contrast */}


        {/* Form / Main Action Container */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-12">
          <h2 className="text-[32px] md:text-[40px] font-bold mb-2 tracking-tight text-white">
            ยินดีต้อนรับ
          </h2>
          <p className="text-white/80 mb-10 text-[16px] leading-relaxed">
            กรุณาคลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบขอสินเชื่อ
          </p>

          <Link href="/dashboard/applications" className="w-full">
            <Button size="xl" variant="accent" className="w-full text-lg font-bold shadow-lg">
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
