"use client";

import {
  Activity,
  BarChart3,
  Flag,
  Home,
  MessageSquare,
  Users,
  Clock,
  CheckSquare,
  Star,
  Heart,
  AlertTriangle,
  BarChartHorizontalIcon,
  ShieldCheckIcon,
  GroupIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AppSidebar() {
  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: BarChart3,
    },
    {
      title: "Ingredients",
      url: "/dashboard/ingredients",
      icon: BarChartHorizontalIcon,
    },
    {
      title: "Category",
      url: "/dashboard/categories",
      icon: GroupIcon,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: MessageSquare,
    },
    {
      title: "Pros & Cons",
      url: "/dashboard/pros-cons",
      icon: CheckSquare,
    },
    {
      title: "Certifications",
      url: "/dashboard/certifications",
      icon: ShieldCheckIcon,
    },
    {
      title: "Price Comparison",
      url: "/dashboard/price-comparison",
      icon: BarChart3,
    },
    {
      title: "Shopping List",
      url: "/dashboard/shopping-list",
      icon: Activity,
    },
    {
      title: "Budget",
      url: "/dashboard/budget",
      icon: BarChart3,
    },
    {
      title: "Loyalty",
      url: "/dashboard/loyalty",
      icon: Star,
    },
    {
      title: "Favourites",
      url: "/dashboard/favourites",
      icon: Heart,
    },
    {
      title: "Allergens",
      url: "/dashboard/allergens",
      icon: AlertTriangle,
    },
    {
      title: "Family",
      url: "/dashboard/family",
      icon: Users,
    },
    {
      title: "Health Tracking",
      url: "/dashboard/health-tracking",
      icon: Activity,
    },
    {
      title: "Spend Analysis",
      url: "/dashboard/spend-analysis",
      icon: BarChart3,
    },
    {
      title: "Guarantee/Warranty",
      url: "/dashboard/guarantee",
      icon: Clock,
    },
  ];
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SocialApp Admin</span>
            <span className="truncate text-xs text-muted-foreground">
              Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span onClick={() => signOut()}>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
