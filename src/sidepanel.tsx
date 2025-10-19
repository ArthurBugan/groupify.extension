import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGroups } from "@/hooks/useQuery/useGroups";
import { useChannels } from "@/hooks/useQuery/useChannels";
import { useUser } from "@/hooks/useQuery/useUser";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
	type LoginCredentials,
	useLoginMutation,
} from "@/hooks/mutations/useAuthMutations";
import { IconViewer } from "@/components/icon-picker";
import { ExpandedGroup } from "@/components/expanded-group";

interface ApiGroup {
	id: string;
	name: string;
	channelCount: number;
	category: string;
	createdAt: string;
	icon: string;
	parentId: string | null;
	nestingLevel: number;
	displayOrder: number;
}

interface TableGroup extends ApiGroup {
	expanded: boolean;
}

let url = process.env.PLASMO_PUBLIC_GROUPIFY_URL;

const queryClient = new QueryClient();

import "@/style.css"

function getBrowserType() {
	if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
		return 'chrome';
	} else if (typeof (window as any).browser !== 'undefined' && typeof (window as any).browser.runtime !== 'undefined') {
		return 'firefox';
	} else if (typeof (window as any).safari !== 'undefined' && typeof (window as any).safari.extension !== 'undefined') {
		return 'safari';
	} else {
		return 'unknown';
	}
}

function IndexSidePanel() {
	const [showPassword, setShowPassword] = useState(false);
	const [groups, setGroups] = useState<TableGroup[]>([]);
	const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
		limit: 100
	});

	const transformApiGroups = (apiGroups?: ApiGroup[]): TableGroup[] => {
		if (!apiGroups) return [];

		return apiGroups?.map((group, index) => ({
			id: group.id,
			name: group.name,
			channelCount: group.channelCount || 0,
			category: group.category || "General",
			createdAt: new Date(group.createdAt).toLocaleDateString(),
			icon: group.icon || "FolderKanban",
			parentId: group.parentId || null,
			expanded: false,
			nestingLevel: group.nestingLevel || 0,
			displayOrder: group.displayOrder || index,
		}));
	};

	useEffect(() => {
		if (groupsData?.data) {
			setGroups(transformApiGroups(groupsData.data as ApiGroup[]));
		}
	}, [groupsData?.data]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = () => {
			if (mediaQuery.matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			};
		}

		// Set initial theme
		handleChange();

		// Listen for changes
		mediaQuery.addEventListener('change', handleChange);

		// Cleanup
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	const { userData, loading: isLoadingUser, error: userError } = useUser();
	const toggleExpand = (id: string) => {
		setGroups(
			groups.map((group) =>
				group.id === id ? { ...group, expanded: !group.expanded } : group,
			),
		);
	};

	const getSortedGroups = () => {
		const result: TableGroup[] = [];
		const processedGroups = new Set<string>();

		const groupsWithoutParentsInDataset = groups.filter((group) => {
			if (group.parentId === null) return true;
			const parentExists = groups.some((g) => g.id === group.parentId);
			return !parentExists;
		});

		const sortedRootGroups = groupsWithoutParentsInDataset.sort(
			(a, b) => a.displayOrder - b.displayOrder,
		);

		const addGroupAndChildren = (group: TableGroup) => {
			if (processedGroups.has(group.id)) return;

			result.push(group);
			processedGroups.add(group.id);

			if (group.expanded) {
				const children = groups
					.filter((g) => g.parentId === group.id)
					.sort((a, b) => a.displayOrder - b.displayOrder);
				children.forEach(addGroupAndChildren);
			}
		};

		sortedRootGroups.forEach(addGroupAndChildren);
		return result;
	};

	const sortedGroups = getSortedGroups();

	const loginSchema = z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(1, chrome.i18n.getMessage("login_validation.password.required"))
			.min(6, chrome.i18n.getMessage("login_validation.password.min")),
	});

	type LoginFormData = z.infer<typeof loginSchema>;

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const loginMutation = useLoginMutation();

	const onSubmit = async (data: LoginFormData) => {
		try {
			await loginMutation.mutateAsync(data as LoginCredentials);
		} catch (error) {
			form.setError("root", {
				type: "manual",
				message: error ? error.message : "Login failed. Please try again.",
			});
		}
	};

	const handleDiscordAuth = (e) => {
		e.preventDefault();
		const browserType = getBrowserType();
		window.open(`${url}/auth/discord?origin=${browserType}`);
	};

	const handleGoogleAuth = (e) => {
		e.preventDefault();
		const browserType = getBrowserType();
		window.open(`${url}/auth/google?origin=${browserType}`);
	};

	if (userData?.email) {
		return (
			<div className="flex flex-col bg-background">
				<div className="flex flex-1 px-4 py-12 h-full w-screen">
					{isLoadingGroups || isLoadingUser ? (
						<div className="flex h-screen w-full items-center justify-center">
							<Card className="flex items-center justify-center flex-col p-10">
								<CardHeader>
									<CardTitle>
										Loading...
									</CardTitle>
								</CardHeader>
								<div className="h-10 w-10">
									<Loader2 className="animate-spin mr-2 h-10 w-10" />
								</div>
							</Card>
						</div>
					) : (
						<div className="space-y-2 w-screen">
							<h1 className="text-3xl font-bold">Your Groups</h1>
							{userData?.email && <p className="text-md text-gray-500">Logged in as: {userData.email}</p>}
							{sortedGroups.length === 0 ? (
								<p className="text-muted-foreground">No groups found.</p>
							) : (
								sortedGroups.map((group) => (
									<div>
										<div
											key={group.id}
											className={cn(
												"flex items-center gap-2 p-2 rounded-md hover:bg-accent",
												`pl-${group.nestingLevel * 8}`,
											)}
										>
											<Button
												variant="ghost"
												className="w-full flex justify-start"
												onClick={() => toggleExpand(group.id)}
											>
												<div>
													{group.expanded ? (
													<div>
														<ChevronDown className="h-20 w-20" />
													</div>
												) : (
													<ChevronRight className="h-20 w-20" />
												)}
												</div>
												<IconViewer
													icon={group.icon || "/placeholder.svg"}
												/>
												<span className="font-bold text-xl">{group.name}</span>
											</Button>

										</div>
										{group.expanded ? (
											<div className={cn("text-sm text-gray-500 py-1", `pl-${(group.nestingLevel + 1) * 8}`)}>
												<ExpandedGroup group={group} />
											</div>
										) : (
											<div className={cn("text-sm text-gray-500 py-1", `pl-${(group.nestingLevel + 1) * 8}`)}>
											</div>
										)}
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<div className="flex flex-1 justify-center items-center px-4 py-12 w-full h-full">
				<div className="space-y-8 w-full max-w-md">
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl font-bold text-center">
								{chrome.i18n.getMessage("login_title")}
							</CardTitle>
							<CardDescription className="text-center">
								{chrome.i18n.getMessage("login_subtitle")}
							</CardDescription>
						</CardHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<CardContent className="space-y-4">
									{form.formState.errors.root && (
										<Alert variant="destructive">
											<AlertDescription>
												{form.formState.errors.root.message}
											</AlertDescription>
										</Alert>
									)}
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{chrome.i18n.getMessage("login_email")}</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder={chrome.i18n.getMessage("login_email.placeholder")}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{chrome.i18n.getMessage("login_password")}</FormLabel>
												<FormControl>
													<div className="relative">
														<Input
															type={showPassword ? "text" : "password"}
															placeholder={chrome.i18n.getMessage("login_password.placeholder")}
															{...field}
														/>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="absolute top-0 right-0 px-3 py-2 h-full hover:bg-transparent"
															onClick={() => setShowPassword(!showPassword)}
														>
															{showPassword ? (
																<EyeOff className="w-4 h-4" />
															) : (
																<Eye className="w-4 h-4" />
															)}
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
								<CardFooter className="flex flex-col space-y-4">
									<Button
										type="submit"
										variant="secondary"
										className="w-full"
										disabled={loginMutation.isPending}
									>
										{loginMutation.isPending
											? chrome.i18n.getMessage("login_signing")
											: chrome.i18n.getMessage("login_signin")}
									</Button>
									<Button
										onClick={handleDiscordAuth}
										className="flex items-center px-6 py-2 w-full text-sm font-medium text-gray-800 bg-white rounded-lg border border-gray-300 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
									>
										<Icons.discord />
										<span>{chrome.i18n.getMessage("login_discord")}</span>
									</Button>
									<Button
										onClick={handleGoogleAuth}
										className="flex items-center px-6 py-2 w-full text-sm font-medium text-gray-800 bg-white rounded-lg border border-gray-300 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
									>
										<Icons.google />
										<span>{chrome.i18n.getMessage("login_google")}</span>
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</div>
			</div>
		</div>
	);
}

function SidePanelWithQueryClient() {
	return (
		<QueryClientProvider client={queryClient}>
			<IndexSidePanel />
		</QueryClientProvider>
	);
}

export default SidePanelWithQueryClient;