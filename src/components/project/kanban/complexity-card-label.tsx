import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import { Label } from '@/components/ui/label';

type CardFromAPI =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number];

interface ComplexityCardLabelProps {
    complexity: CardFromAPI['complexity'];
}

export function ComplexityCardLabel({ complexity }: ComplexityCardLabelProps) {
    const getComplexityConfig = () => {
        const numValue = Number.parseInt(complexity, 10);

        if (numValue <= 2) {
            return {
                color: 'bg-green-100 text-green-700 border-green-300',
                label: complexity,
            };
        }
        if (numValue <= 5) {
            return {
                color: 'bg-blue-100 text-blue-700 border-blue-300',
                label: complexity,
            };
        }
        if (numValue <= 8) {
            return {
                color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                label: complexity,
            };
        }
        return {
            color: 'bg-red-100 text-red-700 border-red-300',
            label: complexity,
        };
    };

    const config = getComplexityConfig();

    return (
        <Label
            className={` ring px-1 py-0.5 rounded  ${config.color}`}
        >
            {config.label}
        </Label>
    );
}
