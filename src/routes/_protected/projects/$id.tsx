import {
    getProjectsByProjectIdOptions,
    getSprintsBySprintIdKanbanOptions,
    getSprintsProjectByProjectIdOptions,
    putCardsByCardIdMoveMutation,
} from '@/client/@tanstack/react-query.gen';
import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import { CreateSprintDialog } from '@/components/project/create-sprint-dialog';
import { Kanban } from '@/components/project/kanban/kanban';
import { KanbanColumn } from '@/components/project/kanban/kanban-column';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectSidebar } from '@/components/project/project-sidebar';
import { SprintSelector } from '@/components/project/sprint-selector';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CalendarPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type KanbanCard =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number];

export const Route = createFileRoute('/_protected/projects/$id')({
    component: RouteComponent,
});

function RouteComponent() {
    const { id: projectId } = Route.useParams();

    const { data: project } = useSuspenseQuery(
        getProjectsByProjectIdOptions({
            path: { projectId },
        }),
    );

    const { data: sprints } = useSuspenseQuery(
        getSprintsProjectByProjectIdOptions({
            path: { projectId },
        }),
    );

    const [selectedSprintId, setSelectedSprintId] = useState(() => {
        const activeSprint = sprints.find((s) => s.status === 'active');
        return activeSprint?.id ?? sprints[0]?.id ?? null;
    });

    const [searchTerm, setSearchTerm] = useState('');

    const { data: kanbanData } = useQuery({
        ...getSprintsBySprintIdKanbanOptions({
            path: { sprintId: selectedSprintId || '' },
        }),
        enabled: !!selectedSprintId,
    });

    const [localKanbanData, setLocalKanbanData] = useState(kanbanData);

    const moveCardMutation = useMutation(putCardsByCardIdMoveMutation());

    useEffect(() => {
        setLocalKanbanData(kanbanData);
    }, [kanbanData]);

    const totalTasks =
        localKanbanData?.columns.reduce(
            (acc, col) => acc + col.cards.length,
            0,
        ) ?? 0;

    const completedTasks =
        localKanbanData?.columns
            .filter(
                (col) =>
                    col.name.toLowerCase().includes('done') ||
                    col.name.toLowerCase().includes('completed'),
            )
            .reduce((acc, col) => acc + col.cards.length, 0) ?? 0;

    const filteredKanbanData = useMemo(() => {
        if (!localKanbanData || !searchTerm) return localKanbanData;

        const search = searchTerm.toLowerCase();
        return {
            ...localKanbanData,
            columns: localKanbanData.columns.map((column) => ({
                ...column,
                cards: column.cards.filter(
                    (card) =>
                        card.name.toLowerCase().includes(search) ||
                        card.content.toLowerCase().includes(search) ||
                        card.tags.some((tag) =>
                            tag.name.toLowerCase().includes(search),
                        ),
                ),
            })),
        };
    }, [localKanbanData, searchTerm]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !localKanbanData) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeColumnId = active.data.current?.columnId as string;

        const overCard = over.data.current?.card as KanbanCard | undefined;
        const overColumnId = (over.data.current?.columnId ||
            over.data.current?.column?.id) as string;

        if (!overColumnId) return;

        let nextPosition: number | null = null;
        let nextColumnId: string | null = null;

        setLocalKanbanData((prev) => {
            if (!prev) return prev;

            const newColumns = prev.columns.map((col) => ({
                ...col,
                cards: [...col.cards],
            }));

            const sourceCol = newColumns.find(
                (col) => col.id === activeColumnId,
            );
            const targetCol = newColumns.find((col) => col.id === overColumnId);

            if (!sourceCol || !targetCol) return prev;

            const sourceIndex = sourceCol.cards.findIndex(
                (c) => c.id === activeId,
            );
            if (sourceIndex === -1) return prev;

            if (sourceCol.id === targetCol.id) {
                const targetIndex = overCard
                    ? targetCol.cards.findIndex((c) => c.id === overId)
                    : targetCol.cards.length;

                targetCol.cards = arrayMove(
                    targetCol.cards,
                    sourceIndex,
                    targetIndex,
                );

                nextPosition = targetCol.cards.findIndex(
                    (c) => c.id === activeId,
                );
                nextColumnId = targetCol.id;
            } else {
                const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);

                const targetIndex = overCard
                    ? targetCol.cards.findIndex((c) => c.id === overId)
                    : targetCol.cards.length;

                targetCol.cards.splice(targetIndex, 0, {
                    ...movedCard,
                    columnId: targetCol.id,
                });

                nextPosition = targetCol.cards.findIndex(
                    (c) => c.id === activeId,
                );
                nextColumnId = targetCol.id;
            }

            return { ...prev, columns: newColumns };
        });

        if (nextColumnId !== null && nextPosition !== null) {
            moveCardMutation.mutate({
                path: { cardId: activeId },
                body: {
                    targetColumnId: nextColumnId,
                    newPosition: nextPosition,
                },
            });
        }
    };

    return (
        <SidebarProvider>
            <ProjectSidebar />
            <SidebarInset className='flex flex-col p-6 gap-6 h-screen overflow-hidden'>
                <ProjectHeader projectName={project.name} />
                <Separator />

                <div className='flex flex-col gap-6 flex-1 min-h-0'>
                    {sprints.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant='icon'>
                                    <CalendarPlus />
                                </EmptyMedia>
                                <EmptyTitle>No sprints yet</EmptyTitle>
                                <EmptyDescription>
                                    Create your first sprint to start organizing
                                    your project tasks.
                                </EmptyDescription>
                            </EmptyHeader>
                            <CreateSprintDialog
                                projectId={projectId}
                                onSprintCreated={(sprint) =>
                                    setSelectedSprintId(sprint.id)
                                }
                            >
                                <Button>Create Sprint</Button>
                            </CreateSprintDialog>
                        </Empty>
                    ) : (
                        <>
                            <SprintSelector
                                sprints={sprints}
                                selectedSprintId={selectedSprintId}
                                completedTasks={completedTasks}
                                totalTasks={totalTasks}
                                onSprintChange={setSelectedSprintId}
                                onSearchChange={setSearchTerm}
                            />

                            <Kanban onDragEnd={handleDragEnd}>
                                {filteredKanbanData?.columns.map((column) => (
                                    <KanbanColumn
                                        key={column.id}
                                        column={column}
                                        sprintId={selectedSprintId || ''}
                                        onCardCreated={(newCard) => {
                                            setLocalKanbanData((prev) => {
                                                if (!prev) return prev;
                                                return {
                                                    ...prev,
                                                    columns: prev.columns.map(
                                                        (col) => {
                                                            if (
                                                                col.id !==
                                                                column.id
                                                            )
                                                                return col;
                                                            return {
                                                                ...col,
                                                                cards: [
                                                                    ...col.cards,
                                                                    newCard,
                                                                ],
                                                            };
                                                        },
                                                    ),
                                                };
                                            });
                                        }}
                                    />
                                ))}
                            </Kanban>
                        </>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
