import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    // Dynamically set the title based on the route
    const getTitle = () => {
        if (location.pathname === '/users') return 'User Management';
        if (location.pathname === '/dashboard') return 'Dashboard';
        return 'Admin Panel';
    };

    return (
        <header className="h-20 bg-[#FAFBFF] flex items-center justify-between px-10 border-b border-gray-100/50 sticky top-0 z-30 font-poppins">
            {/* Left Side: Page Title */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-[#3D3462]">
                    {getTitle()}
                </h1>
            </div>

            {/* Right Side: Notifications & Profile */}
            <div className="flex items-center gap-6">
                <button className="relative p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-[#7C5DFA] transition-all shadow-sm">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#3D3462] leading-none">{user?.first_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7C5DFA]/20 shadow-sm">
                        <img
                            src={user?.profile_image_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;