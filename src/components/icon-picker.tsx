"use client";

import { Icon } from "@iconify-icon/react";
import { Check, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Timer for debouncing search
let timer: ReturnType<typeof setTimeout>;

interface IconPickerContextValue {
	value: string;
	onChange: (value: string) => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<string>>;
	categories: { name: string; key: string; icons: string[] }[];
	iconSet: string[];
	filteredIcons: string[];
	handleIconSelect: (iconName: string) => void;
	handleOpenChange: (newOpen: boolean) => void;
	handleFilter: (value: string) => void;
}

const IconPickerContext = React.createContext<
	IconPickerContextValue | undefined
>(undefined);

function useIconPicker() {
	const context = React.useContext(IconPickerContext);
	if (!context) {
		throw new Error("useIconPicker must be used within an IconPickerProvider");
	}
	return context;
}

interface IconPickerProps {
	value: string;
	onChange: (value: string) => void;
	children: React.ReactNode;
}

export function IconPicker({ value, onChange, children }: IconPickerProps) {
	const [open, setOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState("");
	const [activeTab, setActiveTab] = React.useState("Activities");
	const [categories, setCategories] = React.useState<
		{ name: string; key: string; icons: string[] }[]
	>([{ name: "", key: "", icons: [] }]);
	const [iconSet, setIconSet] = React.useState<string[]>([]);
	const [filteredIcons, setFilteredIcons] = React.useState<string[]>([]);

	React.useEffect(() => {
		(async () => {
			const resp = await (
				await fetch(
					`https://api.iconify.design/collection?prefix=twemoji&chars=true&aliases=true`,
				)
			).json();

			setIconSet(Object.values(resp.categories)?.flat() as string[]);
			setCategories(
				Object.keys(resp.categories).map((category) => ({
					name: category,
					key: category,
					icons: resp.categories[category],
				})),
			);
			setActiveTab("Activities");
		})();
	}, []);

	const handleIconSelect = (iconName: string) => {
		const formattedIconName = iconName.includes(":")
			? iconName
			: `twemoji:${iconName}`;
		onChange(formattedIconName);
		setOpen(false);
		setSearchTerm("");
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setSearchTerm("");
		}
	};

	const handleFilter = (value: string) => {
		setSearchTerm(value);
		clearTimeout(timer);

		timer = setTimeout(async () => {
			if (value.trim() === "") {
				setFilteredIcons([]);
				return;
			}

			const resp = await (
				await fetch(
					`https://api.iconify.design/search?query=${value}&limit=200`,
				)
			).json();

			setFilteredIcons(resp?.icons || []);
		}, 500);
	};

	return (
		<IconPickerContext.Provider
			value={{
				value,
				onChange,
				open,
				setOpen,
				searchTerm,
				setSearchTerm,
				activeTab,
				setActiveTab,
				categories,
				iconSet,
				filteredIcons,
				handleIconSelect,
				handleOpenChange,
				handleFilter,
			}}
		>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				{children}
			</Dialog>
		</IconPickerContext.Provider>
	);
}

// Sub-components
interface IconPickerTriggerProps {
	asChild?: boolean;
	children?: React.ReactNode;
}

export function IconPickerTrigger({
	asChild = false,
	children,
}: IconPickerTriggerProps) {
	const { open, handleOpenChange, value } = useIconPicker();

	if (asChild && children) {
		return <DialogTrigger asChild>{children}</DialogTrigger>;
	}

	return (
		<DialogTrigger asChild>
			<Button
				variant="outline"
				className="w-full justify-between h-10"
				type="button"
				onClick={() => handleOpenChange(!open)}
			>
				<div className="flex items-center gap-6">
					<Icon height={20} width={20} icon={value} className="h-4 w-4" />
					{!value && <span>Select icon</span>}
				</div>
				<Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</DialogTrigger>
	);
}

export function IconPickerContent() {
	const {
		searchTerm,
		handleFilter,
		filteredIcons,
		activeTab,
		setActiveTab,
		categories,
		handleIconSelect,
		value,
	} = useIconPicker();

	return (
		<DialogContent className="max-w-4xl max-h-[80vh]">
			<DialogHeader>
				<DialogTitle>Choose an Icon</DialogTitle>
			</DialogHeader>

			<div className="space-y-4">
				{/* Search Input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search icons..."
						value={searchTerm}
						onChange={(e) => handleFilter(e.target.value)}
						className="pl-10"
					/>
					{searchTerm && (
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
							onClick={() => handleFilter("")}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				{/* Content */}
				{searchTerm ? <IconPickerSearchResults /> : <IconPickerCategoryTabs />}
			</div>
		</DialogContent>
	);
}

function IconPickerSearchResults() {
	const { searchTerm, filteredIcons, handleIconSelect, value } =
		useIconPicker();

	return (
		<div className="space-y-4">
			<div className="text-sm text-muted-foreground">
				Found {filteredIcons.length} icons matching "{searchTerm}"
			</div>
			<ScrollArea className="h-[400px]">
				<div className="grid grid-cols-8 gap-2 p-2">
					{filteredIcons.map((iconName) => (
						<IconButton
							key={iconName}
							iconName={iconName}
							isSelected={value === iconName}
							onSelect={handleIconSelect}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

function IconPickerCategoryTabs() {
	const { activeTab, setActiveTab, categories, value, handleIconSelect } =
		useIconPicker();

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<ScrollArea className="w-full">
				<TabsList className="grid w-full h-full grid-cols-9">
					{categories.map((category) => (
						<TabsTrigger
							key={category.key}
							value={category.key}
							className="text-xs px-2"
						>
							{category.name.split(" ")[0]}
						</TabsTrigger>
					))}
				</TabsList>
			</ScrollArea>

			{categories.map((category) => (
				<TabsContent key={category.key} value={category.key} className="mt-4">
					<ScrollArea className="h-[400px]">
						<div className="space-y-4 p-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								{category.name} ({category.icons.length} icons)
							</h3>
							<div className="grid grid-cols-8 gap-2">
								{category.icons.map((iconName) => (
									<IconButton
										key={iconName}
										iconName={iconName}
										isSelected={value === iconName}
										onSelect={handleIconSelect}
									/>
								))}
							</div>
						</div>
					</ScrollArea>
				</TabsContent>
			))}
		</Tabs>
	);
}

interface IconButtonProps {
	iconName: string;
	isSelected: boolean;
	onSelect: (iconName: string) => void;
}

function IconButton({ iconName, isSelected, onSelect }: IconButtonProps) {
	return (
		<Button
			variant="ghost"
			className={cn(
				"relative h-14 w-14 p-0 hover:bg-accent flex flex-col items-center justify-center",
				isSelected && "bg-accent ring-2 ring-primary",
			)}
			onClick={() => onSelect(iconName)}
			type="button"
			title={iconName}
		>
			<Icon
				height={28}
				width={28}
				icon={iconName.includes(":") ? iconName : `twemoji:${iconName}`}
				className="h-8 w-8"
			/>
			{isSelected && (
				<Check className="absolute -right-1 -top-1 h-3 w-3 text-primary bg-background rounded-full" />
			)}
		</Button>
	);
}

// Icon Viewer component
interface IconViewerProps {
	icon: string;
	size?: number;
	className?: string;
}

export function IconViewer({ icon, size = 24, className }: IconViewerProps) {
	return (
		<Icon
			height={size}
			width={size}
			icon={icon}
			className={cn("inline-block", className)}
		/>
	);
}

// Legacy component for backward compatibility
interface LegacyIconPickerProps {
	value: string;
	onChange: (value: string) => void;
}

export function LegacyIconPicker({ value, onChange }: LegacyIconPickerProps) {
	return (
		<IconPicker value={value} onChange={onChange}>
			<IconPickerTrigger />
			<IconPickerContent />
		</IconPicker>
	);
}
