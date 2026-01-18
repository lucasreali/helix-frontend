import {
    getSprintsBySprintIdKanbanOptions,
    postCardsMutation,
} from '@/client/@tanstack/react-query.gen';
import type { GetSprintsBySprintIdKanbanResponse } from '@/client/types.gen';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type KanbanTag =
    GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number]['tags'][number];

const createCardSchema = z.object({
    name: z.string().min(1, 'Card name is required'),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    complexity: z.enum(['1', '2', '3', '5', '8', '13']),
});

type CreateCardForm = z.infer<typeof createCardSchema>;

interface CreateCardDialogProps {
    children?: ReactNode;
    columnId: string;
    sprintId: string;
    onCardCreated?: (
        card: GetSprintsBySprintIdKanbanResponse['columns'][number]['cards'][number],
    ) => void;
}

export function CreateCardDialog({
    children,
    columnId,
    sprintId,
    onCardCreated,
}: CreateCardDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<CreateCardForm>({
        resolver: zodResolver(createCardSchema),
        defaultValues: {
            name: '',
        },
    });

    const createCardMutation = useMutation({
        ...postCardsMutation(),
        onSuccess: (newCard) => {
            toast.success('Card created successfully');

            const normalizedCard = {
                ...newCard,
                tags:
                    'tags' in newCard &&
                    Array.isArray((newCard as { tags: KanbanTag[] }).tags)
                        ? (newCard as { tags: KanbanTag[] }).tags
                        : [],
                position:
                    typeof newCard.position === 'number' ? newCard.position : 0,
            };

            if (onCardCreated) {
                onCardCreated(normalizedCard);
            }

            queryClient.invalidateQueries({
                queryKey: getSprintsBySprintIdKanbanOptions({
                    path: { sprintId },
                }).queryKey,
            });

            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create card',
            );
        },
    });

    function onSubmit(data: CreateCardForm) {
        createCardMutation.mutate({
            body: {
                name: data.name,
                columnId,
                priority: data.priority,
                complexity: data.complexity,
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Card</DialogTitle>
                    <DialogDescription>
                        Add a new card to this column. Fill in the details
                        below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Name</FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder='Card title'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-2'>
                            <FormField
                                control={form.control}
                                name='priority'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>
                                                Priority
                                            </FormLabel>
                                            <FormMessage className='text-xs' />
                                        </div>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select priority' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='low'>
                                                    Low
                                                </SelectItem>
                                                <SelectItem value='medium'>
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value='high'>
                                                    High
                                                </SelectItem>
                                                <SelectItem value='critical'>
                                                    Critical
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='complexity'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>
                                                Complexity
                                            </FormLabel>
                                            <FormMessage className='text-xs' />
                                        </div>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select complexity' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='1'>
                                                    1
                                                </SelectItem>
                                                <SelectItem value='2'>
                                                    2
                                                </SelectItem>
                                                <SelectItem value='3'>
                                                    3
                                                </SelectItem>
                                                <SelectItem value='5'>
                                                    5
                                                </SelectItem>
                                                <SelectItem value='8'>
                                                    8
                                                </SelectItem>
                                                <SelectItem value='13'>
                                                    13
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={createCardMutation.isPending}
                            >
                                {createCardMutation.isPending
                                    ? 'Creating...'
                                    : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
