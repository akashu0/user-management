import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
            >
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-[#3D3462]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && (
                    <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#FAFBFF] p-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
