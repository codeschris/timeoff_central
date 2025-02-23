import * as React from "react"
import Image from "next/image"
import {
  User2,
  // GalleryVerticalEnd,
  Settings2,
  BookA,
} from "lucide-react"
import { useRouter } from "next/router"
import { fetchUserProfile } from "@/pages/api/utils/endpoints"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const managementNav = [
  {
    title: "Dashboard",
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
        title: "Reset password (NaN)",
        url: "#",
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xs" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-inherit text-sidebar-primary-foreground">
                  <Image src="/solfruit-logo.png" height={40} width={40} alt="Solfruit Logo" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Solfruit Kenya Limited</span>
                  <span className="">We transparently deliver quality, wrapped in peace of mind.</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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