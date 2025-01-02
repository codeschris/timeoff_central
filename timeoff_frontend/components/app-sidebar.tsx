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

const data = {
  teams: [
    {
      name: "SolFruit",
      logo: GalleryVerticalEnd,
      plan: "Timeoff Central (Enterprise)",
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
          url: "/dashboard",
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
          url: "/dashboard/employees",
        },
        {
          title: "Search Employee",
          url: "/dashboard/employees/search_employees",
        },
        {
          title: "Print approved leaves",
          url: "/dashboard/print-approved-leaves",
        },
        {
          title: "Register new employee",
          url: "/auth/register-employee",
        }
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
  
  // Specify user constant to deal with nulltype issue and the need for dummy data when actual data is being used
  const [user] = React.useState<{ name: string; email: string; avatar: string } | undefined>(undefined);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> {/* `user` is being called from NavUserProps (components/nav-user.tsx) */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
