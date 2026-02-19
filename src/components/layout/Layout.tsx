import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../lib/utils';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#FAFBFF] font-poppins">
            {/* Sidebar with state control */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area - Dynamic Margin */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    isCollapsed ? "ml-20" : "ml-72"
                )}
            >
                <Header />
                <main className="flex-1 p-6 lg:p-10 w-full animate-in fade-in duration-700">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;