import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return <div className='h-screen flex items-center justify-center'>
        <div className='p-10 rounded-md border'>{children}</div>
    </div>
};

export default AuthLayout;