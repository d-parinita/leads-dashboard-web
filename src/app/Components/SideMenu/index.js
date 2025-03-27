import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import React from "react"
import { items } from "@/app/utils/constVariables"
import Link from "next/link"

export default function SideMenu() {
  return (
    <Sidebar className={'z-11'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={'mt-3'}><img src="/images/logo.png" className="w-20 h-8"/></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={'mt-4'}>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
