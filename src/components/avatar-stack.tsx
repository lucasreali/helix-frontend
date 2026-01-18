import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type User = {
	name: string;
	avatarUrl?: string | null;
};

export type AvatarStackProps = {
	users: User[];
	className?: string;
	animate?: boolean;
	size?: number;
};

function getInitials(name: string): string {
	const names = name.trim().split(" ").filter(Boolean);

	if (names.length === 1) {
		return names[0].slice(0, 2).toUpperCase();
	}

	return names
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export function AvatarStack({
	users,
	className,
	animate = false,
	size = 40,
	...props
}: AvatarStackProps) {
	return (
		<div
			className={cn(
				"-space-x-1 flex items-center",
				animate && "hover:space-x-0 *:transition-all",
				className,
			)}
			{...props}
		>
			{users.map((user, index) => (
				<Avatar
					key={`${user.name}-${index}`}
					className={cn("shrink-0", className)}
				>
					{user.avatarUrl && (
						<AvatarImage src={user.avatarUrl} alt={user.name} />
					)}
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
				</Avatar>
			))}
		</div>
	);
}
