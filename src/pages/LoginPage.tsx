import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { loginService } from '../services/authService';
import bannerImage from '../assets/images/login-banner.gif';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    // 1. Validation Logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if format is valid for the error message
    const isEmailFormatValid = useMemo(() => {
        return email.length === 0 || emailRegex.test(email);
    }, [email]);

    // AC: Login button becomes active only when both fields are filled AND format is correct
    const isFormValid = useMemo(() => {
        return emailRegex.test(email) && password.trim().length > 0;
    }, [email, password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Extra guard for email format on submit
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await loginService.login(email, password);
            setAuth(data);
            navigate('/users');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat font-poppins"
            style={{ backgroundImage: `url(${bannerImage})` }}
        >
            <div className="absolute top-20 text-white font-bold text-5xl tracking-widest opacity-90">
                LOGO
            </div>

            <div className="w-full max-w-[440px] bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-12 border border-white/20">
                <div className="mb-10 text-left">
                    <h3 className="text-3xl font-semibold text-white">Sign in</h3>
                    <p className="text-white mt-1 text-xs">Log in to manage your account</p>
                </div>

                {/* AC: Show error message if credentials invalid OR email format is wrong */}
                {(error || !isEmailFormatValid) && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-[11px] font-medium text-center">
                        {!isEmailFormatValid && email.length > 0
                            ? "Invalid email format (e.g., name@example.com)"
                            : error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-white ml-1">Email</label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            // Ensure your Input component passes the event correctly
                            onChange={(e: any) => setEmail(e.target.value)}
                            required
                            className={`bg-transparent mt-2 border-white rounded-xl text-white placeholder:text-white h-12 transition-colors ${!isEmailFormatValid && email.length > 0 ? 'border-red-500' : 'border-white'}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-white ml-1">Password</label>
                        <Input
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            required
                            className="bg-transparent mt-2 border-white rounded-xl text-white placeholder:text-white focus:border-white/10 h-12"
                        />
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/30 cursor-pointer bg-transparent text-[#593CFF] focus:ring-0" />
                            <span className="text-[11px] text-white">Remember me</span>
                        </label>
                        <button type="button" className="text-[11px] text-white cursor-pointer hover:text-white transition-colors">
                            Forgot password ?
                        </button>
                    </div>

                    <Button
                        className={`w-full h-12 text-sm font-semibold rounded-xl transition-all cursor-pointer duration-300 ${isFormValid
                            ? 'bg-[#593CFF] hover:bg-[#4a2ee0] text-white shadow-[0_0_20px_rgba(89,60,255,0.4)]'
                            : 'bg-[#593CFF]/40 text-white/50 cursor-not-allowed border border-white/10'
                            }`}
                        type="submit"
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;