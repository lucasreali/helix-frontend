import type { GetProjectsResponse } from "@/client/types.gen";
import { AvatarStack } from "@/components/avatar-stack";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteProjectAlert } from "./delete-project-alert";
import { StatusProjectBadge } from "./status-project-badge";
import { UpdateProjectDialog } from "./update-project-dialog";

type Project = GetProjectsResponse[number];

interface ProjectsTableProps {
	projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
	const navigate = useNavigate();
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

	function toProjectPage(projectId: string) {
		navigate({ to: "/projects/$id", params: { id: projectId } });
	}

	function handleUpdateProject(e: React.MouseEvent, project: Project) {
		e.stopPropagation();
		setSelectedProject(project);
		setIsUpdateDialogOpen(true);
	}

	function handleDeleteProject(e: React.MouseEvent, project: Project) {
		e.stopPropagation();
		setSelectedProject(project);
		setIsDeleteAlertOpen(true);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">#</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Repository</TableHead>
						<TableHead>Participants</TableHead>
						<TableHead>Updated</TableHead>
						<TableHead className="text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projects.map((project, index) => (
						<TableRow
							key={project.id}
							onClick={() => toProjectPage(project.id)}
							className="cursor-pointer"
						>
							<TableCell className="text-muted-foreground text-sm text-center">
								{index + 1}
							</TableCell>
							<TableCell className="font-medium">{project.name}</TableCell>
							<TableCell className="text-muted-foreground max-w-xs truncate">
								{project.description || "-"}
							</TableCell>
							<TableCell>
								<StatusProjectBadge status={project.status} />
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{project.githubRepositoryFullName || (
									<span className="italic">No repository</span>
								)}
							</TableCell>
							<TableCell>
								{project.participants.length > 0 && (
									<AvatarStack users={project.participants} size={32} />
								)}
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDistanceToNow(new Date(project.updatedAt), {
									addSuffix: true,
								})}
							</TableCell>
							<TableCell>
								<div className="flex items-center justify-center gap-2">
									<Button
										size="icon"
										variant="ghost"
										onClick={(e) => handleUpdateProject(e, project)}
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={(e) => handleDeleteProject(e, project)}
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{selectedProject && (
				<>
					<UpdateProjectDialog
						project={selectedProject}
						open={isUpdateDialogOpen}
						onOpenChange={setIsUpdateDialogOpen}
					/>
					<DeleteProjectAlert
						project={selectedProject}
						open={isDeleteAlertOpen}
						onOpenChange={setIsDeleteAlertOpen}
					/>
				</>
			)}
		</div>
	);
}
