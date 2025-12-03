import { Truck, Package, Users, BarChart2, CornerDownLeft, TrendingDown, GitFork, Boxes, Tag, Warehouse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface IMenuItem {
    name: string;
    path: string;
    icon: LucideIcon;
    title: string;
}

export const menuItems: IMenuItem[] = [
    { name: "대시보드", path: "/", icon: BarChart2, title: "시스템 요약 및 알림" },

    // --- 🚚 재고 변동 (Transaction Management) ---
    { name: "입고 관리", path: "/inbound", icon: CornerDownLeft, title: "재고 입고 처리" },
    { name: "출고 관리", path: "/outbound", icon: TrendingDown, title: "재고 출고 처리" },
    { name: "재고 이동", path: "/movement", icon: GitFork, title: "창고 간 재고 이동" },

    // --- 🔍 현황 및 이력 조회 ---
    { name: "재고 현황", path: "/inventory", icon: Boxes, title: "실시간 재고 조회" },
    { name: "거래 이력", path: "/transactions", icon: Truck, title: "모든 입출고 기록" },

    // --- ⚙️ 마스터 데이터 관리 ---
    { name: "품목 관리", path: "/items", icon: Package, title: "상품 등록 및 수정" },
    // **현재 구현된 카테고리 관리**
    { name: "카테고리 관리", path: "/categories", icon: Tag, title: "품목 분류 기준 관리" }, 
    { name: "위치 관리", path: "/locations", icon: Warehouse, title: "창고 및 보관 위치 관리" },
    { name: "직원 관리", path: "/users", icon: Users, title: "직원 계정 및 권한 관리" },
];