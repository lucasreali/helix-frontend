import {
    getSprintsProjectByProjectIdOptions,
    postSprintsMutation,
} from '@/client/@tanstack/react-query.gen';
import type { GetSprintsProjectByProjectIdResponse } from '@/client/types.gen';
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

const createSprintSchema = z.object({
    title: z.string().min(1, 'Sprint title is required'),
    deadline: z.string().min(1, 'Deadline is required'),
    status: z.enum(['active', 'completed', 'planned']).optional(),
});

type CreateSprintForm = z.infer<typeof createSprintSchema>;

interface CreateSprintDialogProps {
    children?: ReactNode;
    projectId: string;
    onSprintCreated?: (
        sprint: GetSprintsProjectByProjectIdResponse[number],
    ) => void;
}

export function CreateSprintDialog({
    children,
    projectId,
    onSprintCreated,
}: CreateSprintDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<CreateSprintForm>({
        resolver: zodResolver(createSprintSchema),
        defaultValues: {
            title: '',
            deadline: '',
            status: 'planned',
        },
    });

    const createSprintMutation = useMutation({
        ...postSprintsMutation(),
        onSuccess: (newSprint) => {
            toast.success('Sprint created successfully');

            queryClient.setQueryData<GetSprintsProjectByProjectIdResponse>(
                getSprintsProjectByProjectIdOptions({
                    path: { projectId },
                }).queryKey,
                (oldData) => {
                    if (!oldData) return [newSprint];
                    return [...oldData, newSprint];
                },
            );

            if (onSprintCreated) {
                onSprintCreated(newSprint);
            }

            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create sprint',
            );
        },
    });

    function onSubmit(data: CreateSprintForm) {
        createSprintMutation.mutate({
            body: {
                title: data.title,
                deadline: data.deadline,
                projectId,
                status: data.status,
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Sprint</DialogTitle>
                    <DialogDescription>
                        Add a new sprint to your project. Fill in the details
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
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Title</FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder='Sprint 1'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-2'>
                            <FormField
                                control={form.control}
                                name='deadline'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>Deadline</FormLabel>
                                            <FormMessage className='text-xs' />
                                        </div>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>Status</FormLabel>
                                            <FormMessage className='text-xs' />
                                        </div>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select status' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='planned'>
                                                    Planned
                                                </SelectItem>
                                                <SelectItem value='active'>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value='completed'>
                                                    Completed
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
                                disabled={createSprintMutation.isPending}
                            >
                                {createSprintMutation.isPending
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
