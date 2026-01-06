import { postAuthLogin } from '@/api';
import { GitHub } from '@/components/auth/github';
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
import {
    createFileRoute,
    Link,
    redirect,
    useNavigate,
} from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { AuthLayout } from '../../layouts/auth-layout';

export const Route = createFileRoute('/_auth/login')({
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: (search as any)?.redirect || '/projects',
            });
        }
    },
    component: RouteComponent,
});

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function RouteComponent() {
    const navigate = useNavigate();
    const search = Route.useSearch();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        const [data, error] = await postAuthLogin(values);
        if (error) {
            toast.error(error.message);
            return;
        }

        navigate({ to: (search as any)?.redirect || '/projects' });
    };

    return (
        <AuthLayout>
            <div className='w-full max-w-md space-y-6'>
                <div className='space-y-2 text-center'>
                    <h1 className='text-3xl font-bold'>Sign In</h1>
                    <p className='text-muted-foreground'>
                        Enter your credentials to access your account
                    </p>
                </div>

                <GitHub />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex justify-between'>
                                        <FormLabel>Email</FormLabel>
                                        <FormMessage className='text-xs'/>
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
                                        <FormMessage className='text-xs'/>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='••••••••'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? 'Signing in...'
                                : 'Sign In'}
                        </Button>

                        <div className='text-center text-sm'>
                            <span className='text-muted-foreground'>
                                Don't have an account?{' '}
                            </span>
                            <Link
                                to='/register'
                                className='font-medium text-primary hover:underline'
                            >
                                Create account
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthLayout>
    );
}
