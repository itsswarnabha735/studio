"use client";

import { Icons } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarItems } from "@/components/sidebar-items"
import Link from "next/link"
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen antialiased">
        <Sidebar>
          <SidebarHeader>
            <div className="mx-2 flex items-center space-x-2">
              <Icons.home className="h-6 w-6" />
              <span className="font-bold">HomeHub Harmony</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {SidebarItems.map((item, index) => {
                const isActive = usePathname() === item.href;
                return (
                  <SidebarMenuItem key={index}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton isActive={isActive}>
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="m-2 flex items-center space-x-2">
              <span className="text-xs">
                © {new Date().getFullYear()} HomeHub Harmony
              </span>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
