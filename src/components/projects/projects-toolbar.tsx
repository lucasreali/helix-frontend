import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Table } from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";

interface ProjectsToolbarProps {
	viewMode: "grid" | "table";
	onViewModeChange: (mode: "grid" | "table") => void;
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

export function ProjectsToolbar({
	viewMode,
	onViewModeChange,
	searchTerm,
	onSearchChange,
}: ProjectsToolbarProps) {
	return (
		<div className="flex gap-3 items-center mb-6">
			<Input
				type="search"
				placeholder="Search projects..."
				className="max-w-sm"
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<ButtonGroup>
				<Button
					variant={viewMode === "grid" ? "default" : "outline"}
					size="icon"
					onClick={() => onViewModeChange("grid")}
				>
					<LayoutGrid />
				</Button>
				<Button
					variant={viewMode === "table" ? "default" : "outline"}
					size="icon"
					onClick={() => onViewModeChange("table")}
				>
					<Table />
				</Button>
			</ButtonGroup>
			<CreateProjectDialog>
				<Button className="ml-auto">New Project</Button>
			</CreateProjectDialog>
		</div>
	);
}
