import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComplexityCardLabel } from './complexity-card-label';
import { KanbanTag } from './kanban-tag';
import { PriorityCardLabel } from './priority-card-lable';

type CardFromAPI =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number];

interface KanbanCardProps {
    card: CardFromAPI;
    columnId: string;
}

export function KanbanCard({ card, columnId }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'card',
            card,
            columnId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition:
            transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className='cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-[1.02] transition-all duration-200'>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        {card.priority && (
                            <PriorityCardLabel priority={card.priority} />
                        )}
                        {card.complexity && (
                            <ComplexityCardLabel complexity={card.complexity} />
                        )}
                    </div>
                    <CardTitle className='line-clamp-1 leading-6 w-full'>
                        {card.name}
                    </CardTitle>
                </CardHeader>
                {(card.content || card.tags.length > 0) && (
                    <CardContent className='space-y-3'>
                        {card.tags.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {card.tags.map((tag) => (
                                    <KanbanTag key={tag.id} label={tag.name} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
