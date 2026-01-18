import type { GetSprintsProjectByProjectIdResponse } from '@/client/types.gen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, Search } from 'lucide-react';
import { StatusSprintBadge } from './status-sprint-badge';

interface SprintSelectorProps {
    sprints: GetSprintsProjectByProjectIdResponse;
    selectedSprintId: string | null;
    completedTasks: number;
    totalTasks: number;
    onSprintChange: (sprintId: string) => void;
    onSearchChange: (search: string) => void;
}

export function SprintSelector({
    sprints,
    selectedSprintId,
    completedTasks,
    totalTasks,
    onSprintChange,
    onSearchChange,
}: SprintSelectorProps) {
    const selectedSprint = sprints.find((s) => s.id === selectedSprintId);

    // Formatar data
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };
    return (
        <div className='flex items-center gap-4 flex-wrap'>
            <div className='flex items-center gap-3'>
                <Select
                    value={selectedSprintId || undefined}
                    onValueChange={onSprintChange}
                >
                    <SelectTrigger className='max-w-70'>
                        <Calendar />
                        <SelectValue className='line-clamp-1' />
                        {selectedSprint && (
                            <StatusSprintBadge status={selectedSprint.status} />
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedSprint && (
                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                    <Calendar className='size-4' />
                    <span>
                        {formatDate(selectedSprint.createdAt)} -{' '}
                        {formatDate(selectedSprint.deadline)}
                    </span>
                </div>
            )}

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <div className='w-2 h-2 rounded-full bg-primary' />
                <span>
                    {completedTasks} / {totalTasks} tasks completed
                </span>
            </div>

            <div className='ml-auto flex items-center gap-2'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                    <Input
                        placeholder='Search tasks...'
                        className='pl-9 w-60'
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Button size='sm'>New Task</Button>
            </div>
        </div>
    );
}
