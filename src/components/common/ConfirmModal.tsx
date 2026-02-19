import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    isLoading?: boolean;
    title: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    isLoading = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <div className="flex gap-3 bg-white w-full px-2">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-full cursor-pointer h-12 border-gray-200 font-semibold text-red-500 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        No, Cancel
                    </Button>
                    <Button
                        className="flex-1 rounded-full cursor-pointer h-12 bg-red-500 hover:bg-red-600 text-white font-bold transition-all active:scale-95 shadow-lg shadow-red-100"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        Yes, Delete
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle size={54} className="text-red-500" />
                </div>
                <p className="text-[#3D3462] font-semibold text-xl mb-1 ">Are you sure want to delete?</p>

            </div>
        </Modal>
    );
};

export default ConfirmModal;