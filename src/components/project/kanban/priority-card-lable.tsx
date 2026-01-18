import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';

type CardFromAPI =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number];

interface PriorityCardLabelProps {
    priority: CardFromAPI['priority'];
}

export function PriorityCardLabel({ priority }: PriorityCardLabelProps) {
    const getPriorityConfig = () => {
        switch (priority) {
            case 'critical':
                return {
                    label: 'Critical Priority',
                    color: 'bg-red-600',
                    textColor: 'text-red-600',
                };
            case 'high':
                return {
                    label: 'High Priority',
                    color: 'bg-red-500',
                    textColor: 'text-red-500',
                };
            case 'medium':
                return {
                    label: 'Medium Priority',
                    color: 'bg-yellow-500',
                    textColor: 'text-yellow-600',
                };
            case 'low':
                return {
                    label: 'Low Priority',
                    color: 'bg-green-500',
                    textColor: 'text-green-600',
                };
        }
    };

    const config = getPriorityConfig();

    return (
        <div className='flex items-center gap-2 text-xs'>
            <div className={`w-2 h-2 rounded-full ${config.color}`} />
            <span className={config.textColor}>{config.label}</span>
        </div>
    );
}
