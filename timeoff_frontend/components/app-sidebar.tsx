import * as React from "react"
import {
  User2,
  GalleryVerticalEnd,
  Settings2,
  BookA,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Mumbo Mercy",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SolFruit",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Sitima Packaging",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Pages",
      url: "#",
      icon: BookA,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/",
        },
      ],
    },
    {
      title: "Employees",
      url: "#",
      icon: User2,
      items: [
        {
          title: "List All",
          url: "/employees/all",
        },
        {
          title: "Search Employee",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Reset password",
          url: "/auth/reset-password",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
