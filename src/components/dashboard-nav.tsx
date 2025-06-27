
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  MessageCircleQuestion,
  Contact,
  ClipboardCheck,
  Info,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/students", label: "Students", icon: Users },
  { href: "/teachers", label: "Teachers", icon: Contact },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/faq", label: "Smart FAQ", icon: MessageCircleQuestion },
  { href: "/about", label: "About", icon: Info },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="px-2">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              className="w-full justify-start"
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
