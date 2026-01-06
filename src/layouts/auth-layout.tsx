export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-screen grid grid-cols-2'>
            <div className='flex items-center justify-center'>
                <div className="w-96">{children}</div>
            </div>
            <img src='' alt='' />
        </div>
    );
}
