import { Badge } from "../ui/badge";

interface StatusSprintBadgeProps {
	status: "active" | "completed" | "planned";
}

export function StatusSprintBadge({ status }: StatusSprintBadgeProps) {
	const variants = {
		active:
			"bg-green-100 text-green-800 ring hover:bg-green-100 dark:bg-green-900 dark:text-green-200",
		completed:
			"bg-yellow-100 text-yellow-800 ring hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200",
		planned:
			"bg-red-100 text-red-800 hover:bg-red-100 ring dark:bg-red-900 dark:text-red-200",
	};

	return <Badge className={variants[status]}>{status}</Badge>;
}
