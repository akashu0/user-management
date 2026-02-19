import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Users2,
    Settings,
    LogOut,
    ChevronRight,
    Menu // Hamburger icon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../../store/useAuthStore';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (v: boolean) => void }) => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'User Management', icon: Users, path: '/users' },
        { name: 'Team', icon: Users2, path: '/team' },
    ];

    const settingItems = [
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ item }: { item: typeof menuItems[0] }) => (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative mb-1',
                    isActive
                        ? 'bg-linear-to-r from-[#7C5DFA] to-[#9277FF] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-[#4B4075] hover:text-white'
                )
            }
        >
            <item.icon size={22} className="min-w-[22px]" />

            {/* Label - Hidden when collapsed */}
            {!isCollapsed && <span className="font-medium whitespace-nowrap animate-in fade-in duration-500">{item.name}</span>}

            {/* Tooltip - Only shown when collapsed */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-[#3D3462] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 whitespace-nowrap border border-white/10">
                    {item.name}
                </div>
            )}

            {!isCollapsed && (
                <ChevronRight
                    size={16}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
            )}
        </NavLink>
    );

    return (
        <aside
            className={cn(
                "bg-[#3D3462] min-h-screen flex flex-col p-4 text-white fixed left-0 top-0 z-40 shadow-2xl transition-all duration-300 font-poppins ",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Toggle & Logo Section */}
            <div className={cn("flex items-center mb-10 transition-all", isCollapsed ? "justify-center" : "px-2 justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-left-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-[#3D3462] font-black text-xl italic">L</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">LOGO</h1>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#4B4075] rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 space-y-8 overflow-y-auto overflow-x-hidden no-scrollbar">
                <div>
                    {!isCollapsed && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
                    )}
                    <div className="space-y-1">
                        {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
                    </div>
                </div>

                <div>
                    {!isCollapsed && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Settings</p>
                    )}
                    <div className="space-y-1">
                        {settingItems.map((item) => <NavItem key={item.path} item={item} />)}
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="mt-auto border-t border-white/10 pt-4">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-200 group relative",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={22} />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;