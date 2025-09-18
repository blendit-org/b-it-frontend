
import Footer from './Footer';
import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface IProps{
    children: ReactNode;
}

const CommonLayout = ({children}:IProps) => {
    return (
        <div className='bg-gradient-to-bl from-orange-50 to-orange-100 dark:from-orange-950 dark:to-neutral-950'>
            <Navbar />
            <div>{children}</div>
            <Footer/>
        </div>
    );
};

export default CommonLayout;