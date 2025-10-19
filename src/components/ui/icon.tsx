import { Icon } from "@iconify-icon/react";

interface IDynamicIcon {
	icon: string;
	size?: number;
	className?: string;
}

export const DynamicIcon: React.FC<IDynamicIcon> = ({ icon, className }) => {
	return <Icon className={className} icon={icon} />;
};
