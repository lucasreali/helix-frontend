import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import { Button } from '@/components/ui/button';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { CreateCardDialog } from './create-card-dialog';
import { KanbanCard } from './kanbam-card';
import { useActiveColumn } from './kanban';

type ColumnFromAPI = GetSprintsBySprintIdKanbanResponse['columns'][number];

interface KanbanColumnProps {
    column: ColumnFromAPI;
    sprintId: string;
    onCardCreated?: (
        card: GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number],
    ) => void;
}

export function KanbanColumn({
    column,
    sprintId,
    onCardCreated,
}: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
    });

    const activeColumnId = useActiveColumn();
    const isOver = activeColumnId === column.id;

    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                    <h3 className='text-sm font-medium text-muted-foreground uppercase'>
                        {column.name}
                    </h3>
                    <span className='text-sm text-muted-foreground'>
                        {column.cards.length}
                    </span>
                </div>
                <CreateCardDialog
                    columnId={column.id}
                    sprintId={sprintId}
                    onCardCreated={onCardCreated}
                >
                    <Button
                        variant='ghost'
                        type='button'
                        className='text-muted-foreground hover:text-foreground'
                    >
                        <Plus className='size-4' />
                    </Button>
                </CreateCardDialog>
            </div>
            <div
                ref={setNodeRef}
                className={`
                    flex flex-col gap-3 h-full p-3 rounded-lg 
                    transition-all duration-200 ease-in-out
                    ${
                        isOver
                            ? 'bg-accent/50 border-2 border-primary border-dashed ring-2 ring-primary/20 scale-[1.01]'
                            : 'bg-accent/40 border-2 border-transparent'
                    }
                `}
            >
                <SortableContext
                    items={column.cards.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {column.cards.map((card) => (
                        <KanbanCard
                            key={card.id}
                            card={card}
                            columnId={column.id}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
