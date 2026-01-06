import { postUsers } from '@/api';
import { Button } from '@/components/ui/button';
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
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { AuthLayout } from '../../layouts/auth-layout';

export const Route = createFileRoute('/_auth/register')({
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: (search as any)?.redirect || '/projects',
            });
        }
    },
    component: RouteComponent,
});

const registerSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

function RouteComponent() {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        const { confirmPassword, ...registerData } = values;
        const [data, error] = await postUsers(registerData);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success('Account created successfully!');
        console.log('Registering user:', registerData);
    };

    return (
        <AuthLayout>
            <div className='w-full max-w-md space-y-6'>
                <div className='space-y-2 text-center'>
                    <h1 className='text-3xl font-bold'>Create Account</h1>
                    <p className='text-muted-foreground'>
                        Fill in the details below to create your account
                    </p>
                </div>

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
                                            placeholder='Your full name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Email</FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder='you@example.com'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Password</FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='••••••••'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormMessage className='text-xs' />
                                    </div>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='••••••••'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? 'Creating account...'
                                : 'Create Account'}
                        </Button>

                        <div className='text-center text-sm'>
                            <span className='text-muted-foreground'>
                                Already have an account?{' '}
                            </span>
                            <Link
                                to='/login'
                                className='font-medium text-primary hover:underline'
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthLayout>
    );
}
