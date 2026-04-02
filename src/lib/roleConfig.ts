import type { DevRole } from '@/components/layout/SidebarContext';

export interface RoleInfo {
  displayName: string;
  position: string;
  initials: string;
  avatar?: string;
}

export const ROLE_CONFIG: Record<DevRole, RoleInfo> = {
  'branch-staff': {
    displayName: 'สมหญิง จริงใจ',
    position: 'เจ้าหน้าที่สินเชื่อสาขา',
    initials: 'SJ',
  },
  'legal-team': {
    displayName: 'ธีรวัฒน์ กฎหมาย',
    position: 'ทีมกฎหมาย',
    initials: 'TK',
  },
  'district-checker': {
    displayName: 'สนั่น ตรวจสอบเขต',
    position: 'ผู้ตรวจสอบเขต/ภาค',
    initials: 'ST',
  },
  'rcco-checker': {
    displayName: 'รจนา ตรวจสอบ',
    position: 'RCCO Checker',
    initials: 'RC',
  },
  'rcco-approver': {
    displayName: 'อนุมัติ อนุมัติการ',
    position: 'RCCO Approver',
    initials: 'AA',
  },
  'credit-committee': {
    displayName: 'คณะอนุมัติ สินเชื่อ',
    position: 'คณะอนุมัติสินเชื่อ',
    initials: 'KA',
  },
};

export function getRoleInfo(role: DevRole): RoleInfo {
  return ROLE_CONFIG[role] || ROLE_CONFIG['branch-staff'];
}

export function getRoleDisplayName(role: DevRole): string {
  const roleNames: Record<DevRole, string> = {
    'branch-staff': 'พนักงานสาขา',
    'legal-team': 'ทีม Legal',
    'district-checker': 'เขต/ภาค Checker',
    'rcco-checker': 'RCCO Checker',
    'rcco-approver': 'RCCO Approver',
    'credit-committee': 'คณะอนุมัติสินเชื่อ',
  };
  return roleNames[role] || 'พนักงาน';
}
