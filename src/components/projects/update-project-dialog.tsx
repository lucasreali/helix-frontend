import {
    getProjectsOptions,
    putProjectsByProjectIdMutation,
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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    status: z.enum(['active', 'archived', 'draft']),
});

type UpdateProjectForm = z.infer<typeof updateProjectSchema>;

type Project = GetProjectsResponse[number];

interface UpdateProjectDialogProps {
    project: Project;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateProjectDialog({
    project,
    open,
    onOpenChange,
}: UpdateProjectDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<UpdateProjectForm>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: project.name,
            description: project.description || '',
            status: project.status,
        },
    });

    // Update form values when project changes
    useEffect(() => {
        form.reset({
            name: project.name,
            description: project.description || '',
            status: project.status,
        });
    }, [project, form.reset]);

    const updateProjectMutation = useMutation({
        ...putProjectsByProjectIdMutation(),
        onSuccess: (updatedProject) => {
            toast.success('Project updated successfully');

            queryClient.setQueryData<GetProjectsResponse>(
                getProjectsOptions().queryKey,
                (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map((p) =>
                        p.id === updatedProject.id ? updatedProject : p,
                    );
                },
            );

            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update project',
            );
        },
    });

    function onSubmit(data: UpdateProjectForm) {
        updateProjectMutation.mutate({
            path: {
                projectId: project.id,
            },
            body: {
                name: data.name,
                description: data.description,
                status: data.status,
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Project</DialogTitle>
                    <DialogDescription>
                        Make changes to your project. Click save when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-5 gap-2'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='col-span-4'>
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
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select status' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='active'>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value='draft'>
                                                    Draft
                                                </SelectItem>
                                                <SelectItem value='archived'>
                                                    Archived
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={updateProjectMutation.isPending}
                            >
                                {updateProjectMutation.isPending
                                    ? 'Saving...'
                                    : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
