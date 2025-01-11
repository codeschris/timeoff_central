import * as React from "react"
import {
  User2,
  GalleryVerticalEnd,
  Settings2,
  BookA,
} from "lucide-react"
import { useRouter } from "next/router"
import { fetchUserProfile } from "@/pages/api/utils/endpoints"
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

const managementNav = [
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
        url: "/dashboard/profile",
      },
      {
        title: "Reset password",
        url: "/auth/reset-password",
      },
    ],
  },
]

const employeeNav = [
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Profile",
        url: "/employee/profile",
      },
      {
        title: "Reset password",
        url: "/auth/reset-password",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [navItems, setNavItems] = React.useState(employeeNav)
  const [user, setUser] = React.useState<{ name: string; email: string; avatar: string } | null>(null)

  React.useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile()
        setUser({
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`,
        })

        // Update navItems based on user_type
        if (profile.user_type === "Employee") {
          setNavItems(employeeNav)
        } else if (profile.user_type === "Management") {
          setNavItems(managementNav)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        router.push("/auth/login") // Redirect to login if the user is not authenticated
      }
    }

    loadUserProfile()
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[{ name: "SolFruit", logo: GalleryVerticalEnd, plan: "Timeoff (Enterprise)" }]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}