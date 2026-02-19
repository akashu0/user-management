import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react'; // Optional: for a spinner icon

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger';
    isLoading?: boolean; // Add this line
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, disabled, children, ...props }, ref) => {

        // Define base and variant styles
        const variants = {
            primary: 'bg-[#7C5DFA] text-white hover:bg-[#6a4fdb]',
            outline: 'border border-gray-200 text-gray-600 hover:bg-gray-50',
            danger: 'bg-red-500 text-white hover:bg-red-600',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled} // Disable button while loading
                className={cn(
                    'flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant as keyof typeof variants],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;