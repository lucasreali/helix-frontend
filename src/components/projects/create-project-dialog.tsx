import {
    getProjectsOptions,
    postProjectsMutation,
} from '@/client/@tanstack/react-query.gen';
import type { GetProjectsResponse } from '@/client/types.gen';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
    children?: React.ReactNode;
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<CreateProjectForm>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const createProjectMutation = useMutation({
        ...postProjectsMutation(),
        onSuccess: (newProject) => {
            toast.success('Project created successfully');

            queryClient.setQueryData<GetProjectsResponse>(
                getProjectsOptions().queryKey,
                (oldData) => {
                    if (!oldData) return [newProject];
                    return [...oldData, newProject];
                },
            );

            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create project',
            );
        },
    });

    function onSubmit(data: CreateProjectForm) {
        createProjectMutation.mutate({
            body: {
                name: data.name,
                description: data.description,
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>New Project</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Add a new project to your workspace. Fill in the details
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
                                            placeholder='My Project'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>
                                            Description (Optional)
                                        </FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder='A brief description of your project'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
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
                                disabled={createProjectMutation.isPending}
                            >
                                {createProjectMutation.isPending
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
