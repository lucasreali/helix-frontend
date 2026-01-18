import type { GetProjectsResponse } from "@/client/types.gen";
import { ProjectCard } from "./project-card";

interface ProjectsGridProps {
	projects: GetProjectsResponse;
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
	return (
		<div className="grid grid-cols-4 gap-4">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	);
}
