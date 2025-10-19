"use client";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import * as React from "react";
import { IconViewer } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface GenericComboboxProps {
	data: { value: string; label: string; icon?: string }[];
	value: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
	renderItem?: (item: {
		value: string;
		label: string;
		icon?: string;
	}) => React.ReactNode;
}

export function GenericCombobox({
	data,
	value,
	onValueChange,
	placeholder = "Select item...",
	renderItem,
}: GenericComboboxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? data.find((item) => item.value === value)?.label
						: placeholder}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search item..." />
					<CommandList>
						<CommandEmpty>No item found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={(currentValue) => {
										onValueChange(
											currentValue === value
												? ""
												: data.find((i) => i.label === currentValue)?.value ||
														"",
										);
										setOpen(false);
									}}
								>
									{renderItem ? (
										renderItem(item)
									) : (
										<>
											{item.icon && (
												<IconViewer icon={item.icon} className="mr-2 h-4 w-4" />
											)}
											<CheckIcon
												className={cn(
													"mr-2 h-4 w-4",
													value === item.value ? "opacity-100" : "opacity-0",
												)}
											/>
											{item.label}
										</>
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
