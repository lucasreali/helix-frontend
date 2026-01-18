import type { GetProjectsResponse } from "@/client/types.gen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Clock, GitBranch, Pen, Trash } from "lucide-react";
import { useState } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "../ui/context-menu";
import { DeleteProjectAlert } from "./delete-project-alert";
import { StatusProjectBadge } from "./status-project-badge";
import { UpdateProjectDialog } from "./update-project-dialog";

type Project = GetProjectsResponse[number];

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const navigate = useNavigate();
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

	function toProjectPage() {
		navigate({ to: "/projects/$id", params: { id: project.id } });
	}

	function handleUpdate(e: React.MouseEvent) {
		e.stopPropagation();
		setUpdateDialogOpen(true);
	}

	function handleDelete(e: React.MouseEvent) {
		e.stopPropagation();
		setDeleteAlertOpen(true);
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Card
					key={project.id}
					onClick={toProjectPage}
					className="cursor-pointer h-full"
				>
					<div className="flex flex-col justify-between h-full">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl line-clamp-1">
									{project.name}
								</CardTitle>
								<StatusProjectBadge status={project.status} />
							</div>
							{project.description && (
								<p className="text-sm text-muted-foreground line-clamp-1">
									{project.description}
								</p>
							)}
						</CardHeader>
						<CardContent className="mt-5">
							<div className="flex items-center justify-between">
								<p className="text-xs text-muted-foreground flex items-center gap-1">
									<GitBranch className="h-3.5 w-3.5" />
									{project.githubRepositoryFullName ? (
										project.githubRepositoryFullName
									) : (
										<p className="italic">No repositorie</p>
									)}
								</p>
								<p className="text-xs text-muted-foreground flex items-center gap-1">
									<Clock className="h-3.5 w-3.5" />
									Updated{" "}
									{formatDistanceToNow(new Date(project.updatedAt), {
										addSuffix: true,
									})}
								</p>
							</div>
						</CardContent>
					</div>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onClick={handleUpdate}>
					<Pen /> Update
				</ContextMenuItem>
				<ContextMenuItem onClick={handleDelete} className="text-red-400">
					<Trash className="text-red" /> Delete
				</ContextMenuItem>
			</ContextMenuContent>

			<UpdateProjectDialog
				project={project}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
			/>
			<DeleteProjectAlert
				project={project}
				open={deleteAlertOpen}
				onOpenChange={setDeleteAlertOpen}
			/>
		</ContextMenu>
	);
}
