import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { KanbanCard } from './kanbam-card';

type Card =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number];

interface KanbanProps {
    children: ReactNode;
    onDragEnd: (event: DragEndEvent) => void;
}

interface DragContextValue {
    activeColumnId: string | null;
    overId: string | null;
    activeCardId: string | null;
}

const DragContext = createContext<DragContextValue>({
    activeColumnId: null,
    overId: null,
    activeCardId: null,
});

export const useDragContext = () => useContext(DragContext);
export const useActiveColumn = () => {
    const { activeColumnId } = useDragContext();
    return activeColumnId;
};

export function Kanban({ children, onDragEnd }: KanbanProps) {
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const [dragSourceColumnId, setDragSourceColumnId] = useState<string | null>(
        null,
    );
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveCard(active.data.current?.card ?? null);
        setDragSourceColumnId(active.data.current?.columnId ?? null);
    };

    const handleDragOver = ({ over }: DragOverEvent) => {
        if (!over) {
            setActiveColumnId(null);
            setOverId(null);
            return;
        }

        const overData = over.data.current;
        setOverId(over.id as string);

        if (overData?.type === 'column') {
            setActiveColumnId(over.id as string);
        } else if (overData?.columnId) {
            setActiveColumnId(overData.columnId as string);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        setActiveColumnId(null);
        setOverId(null);
        setDragSourceColumnId(null);
        onDragEnd(event);
    };

    const dragContextValue: DragContextValue = {
        activeColumnId,
        overId,
        activeCardId: activeCard?.id ?? null,
    };

    return (
        <DragContext.Provider value={dragContextValue}>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className='grid grid-cols-4 gap-6 h-full'>{children}</div>
                <DragOverlay
                    dropAnimation={{
                        duration: 300,
                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                    }}
                >
                    {activeCard && dragSourceColumnId && (
                        <div className='rotate-3 scale-105 opacity-90 shadow-2xl'>
                            <KanbanCard
                                card={activeCard}
                                columnId={dragSourceColumnId}
                            />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </DragContext.Provider>
    );
}
