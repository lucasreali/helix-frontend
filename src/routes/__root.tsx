import { checkAuth } from '@/lib/check-auth';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

interface RouterContext {
    auth: Awaited<ReturnType<typeof checkAuth>>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    beforeLoad: async () => {
        const auth = await checkAuth();
        return { auth };
    },
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
}
