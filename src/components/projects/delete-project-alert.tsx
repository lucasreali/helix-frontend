import {
	deleteProjectsByProjectIdMutation,
	getProjectsOptions,
} from "@/client/@tanstack/react-query.gen";
import type { GetProjectsResponse } from "@/client/types.gen";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Project = GetProjectsResponse[number];

interface DeleteProjectAlertProps {
	project: Project;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteProjectAlert({
	project,
	open,
	onOpenChange,
}: DeleteProjectAlertProps) {
	const queryClient = useQueryClient();

	const deleteProjectMutation = useMutation({
		...deleteProjectsByProjectIdMutation(),
		onSuccess: () => {
			toast.success("Project deleted successfully");

			queryClient.setQueryData<GetProjectsResponse>(
				getProjectsOptions().queryKey,
				(oldData) => {
					if (!oldData) return [];
					return oldData.filter((p) => p.id !== project.id);
				},
			);

			onOpenChange(false);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete project",
			);
		},
	});

	function handleDelete() {
		deleteProjectMutation.mutate({
			path: {
				projectId: project.id,
			},
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						project "{project.name}" and remove all associated data.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteProjectMutation.isPending}
					>
						{deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
