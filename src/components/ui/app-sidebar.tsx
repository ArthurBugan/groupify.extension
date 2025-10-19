// biome-ignore assist/source/organizeImports: <explanation>
import {
	ChevronUp,
	FolderKanban,
	LayoutDashboard,
	Settings,
	User2,
	Video,
	Youtube,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useLogoutMutation } from "@/hooks/mutations/useUserMutations";

const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Groups",
		url: "/dashboard/groups",
		icon: FolderKanban,
	},
	{
		title: "Channels",
		url: "/dashboard/channels",
		icon: Youtube,
	},
	{
		title: "Animes",
		url: "/dashboard/animes",
		icon: Video,
	},
	{
		title: "Settings",
		url: "/dashboard/settings/account",
		icon: Settings,
	},
];

export function AppSidebar() {
	const logoutMutation = useLogoutMutation();

	const signOut =()  => {
		logoutMutation.mutateAsync();
	}

	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>Groupify</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-60">
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Billing</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => signOut()}>
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
