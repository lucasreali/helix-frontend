import { Badge } from '@/components/ui/badge';

interface KanbanTagProps {
    label: string;
}

export function KanbanTag({ label }: KanbanTagProps) {
    return (
        <Badge variant='secondary' className='text-xs'>
            {label}
        </Badge>
    );
}
