import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import { checkAuth } from './lib/check-auth';
import { routeTree } from './routeTree.gen';

const router = createRouter({
    routeTree,
    context: {
        auth: undefined!,
    },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

async function initApp() {
    const auth = await checkAuth();

    const domElementId = 'root';

    const rootElement = document.getElementById(domElementId);
    if (!rootElement) {
        throw new Error(`Element with id ${domElementId} not found`);
    }

    createRoot(rootElement).render(
        <StrictMode>
            <RouterProvider router={router} context={{ auth }} />
            <Toaster />
        </StrictMode>
    );
}

initApp();
