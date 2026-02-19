import React, { useState, useEffect, useRef } from 'react';
import { Camera, UserRound, Trash2 } from 'lucide-react';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import { cn } from '../lib/utils';
import { userService } from '../services/userService';
import { initialFormState } from '../types';
import ConfirmModal from './common/ConfirmModal';
import { toast } from 'sonner';


interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any, userId?: string | null) => Promise<void>;
    userId: string | null;
    mode: 'add' | 'edit';
}

interface Responsibility {
    id: string;
    title: string;
}



const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, userId, mode }) => {
    const [formData, setFormData] = useState(initialFormState);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Added for UI preview
    const [availableResponsibilities, setAvailableResponsibilities] = useState<Responsibility[]>([]);
    const [availableRoles, setAvailableRoles] = useState<{ label: string, id: string }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [confirmDeleteImage, setConfirmDeleteImage] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState(false);



    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setPreviewUrl(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // 👈 THIS clears file input
            }
        }
    }, [isOpen]);






    // Fetch Meta Data
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [respData, rolesData] = await Promise.all([
                    userService.getResponsibilities(),
                    userService.getRoles()
                ]);
                setAvailableResponsibilities(respData);
                setAvailableRoles(rolesData);
            } catch (err) {
                console.error("Failed to load meta data", err);
            }
        };
        if (isOpen) fetchMeta();
    }, [isOpen]);

    // Fetch user data if editing
    useEffect(() => {
        const fetchUserData = async () => {
            if (mode === 'edit' && userId) {
                try {
                    const userData = await userService.getUserById(userId);
                    setFormData({
                        name: userData.first_name,
                        email: userData.email || '',
                        role: userData.role?.id || "",
                        title: userData.title || '',
                        phone: userData.phone || '',
                        responsibilities: userData.responsibilities || [],
                        user_picture: userData.profile_image_url || null, // Existing URL string
                        initials: userData.initials || ''
                    });
                    setPreviewUrl(userData.profile_image_url || null);
                } catch (err) {
                    console.error("Failed to load user data", err);
                }
            }
        };
        if (isOpen) fetchUserData();
    }, [userId, mode, isOpen]);



    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, phone: value });
        if (value && !/^\d+$/.test(value)) {
            setErrors(prev => ({ ...prev, phone: 'Phone number must contain only digits.' }));
        } else if (value && (value.length < 10 || value.length > 15)) {
            setErrors(prev => ({ ...prev, phone: 'Phone must be 10-15 digits.' }));
        } else {
            setErrors(prev => {
                const { phone, ...rest } = prev;
                return rest;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (formData.responsibilities.length === 0) newErrors.responsibilities = 'At least one designation is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && (formData.phone.length < 10 || formData.phone.length > 15)) {
            newErrors.phone = 'Phone must be 10-15 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleDeleteImage = async () => {
        if (!userId) return;
        setIsDeletingImage(true);
        try {
            await userService.deleteUserImage(userId);
            setFormData(prev => ({ ...prev, user_picture: null }));
            setPreviewUrl(null);
            setConfirmDeleteImage(false);
            toast.success('Image deleted successfully');
        } catch (err: any) {
            console.error('Failed to delete image', err);
            toast.error(err.response.data.message);
        } finally {
            setIsDeletingImage(false);
        }
    };

    const handleCheckboxChange = (respId: string) => {
        setFormData(prev => {
            const isSelected = prev.responsibilities.includes(respId);
            return {
                ...prev,
                responsibilities: isSelected
                    ? prev.responsibilities.filter(id => id !== respId)
                    : [...prev.responsibilities, respId]
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, user_picture: file }); // Store File object
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string); // Store string for preview
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('role', formData.role);
        data.append('title', formData.title);
        data.append('phone', formData.phone);
        data.append('initials', formData.initials);
        data.append('responsibilities', JSON.stringify(formData.responsibilities));
        data.append('overwrite_data', '0');

        if (mode === 'edit') {
            data.append('_method', 'PUT');
        }

        if (formData.user_picture && typeof formData.user_picture !== 'string') {
            data.append('user_picture', formData.user_picture as File);
        }

        try {
            if (mode === 'edit') {
                await onSave(data, userId);
            } else {
                await onSave(data);
            }

            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'add' ? 'Add New User' : 'Edit User'}
            footer={
                <div className="flex w-full px-2">
                    <Button className="flex-1 rounded-xl cursor-pointer h-12 bg-[#7C5DFA]" onClick={handleSubmit} isLoading={isLoading}>
                        {mode === "add" ? "Add New User" : "Save Changes"}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 px-2 max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center py-4">
                    <div className="relative group">
                        <div className="relative w-20 h-20 rounded-full bg-gray-50 shadow-sm border-2 border-[#7C5DFA] flex items-center justify-center overflow-hidden">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserRound className="text-gray-300" size={32} />
                            )}
                        </div>

                        {previewUrl && (
                            <button
                                onClick={() => setConfirmDeleteImage(true)}
                                className="absolute -top-1 -right-1 bg-white cursor-pointer text-red-500 rounded-full p-1 shadow-md border border-gray-100 hover:bg-red-50 z-10"
                            >
                                <Trash2 size={14} strokeWidth={2.5} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 cursor-pointer -right-1 bg-[#7C5DFA] text-white rounded-full p-1.5 shadow-lg border-2 border-white hover:bg-[#6c4de0]"
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Input
                            label="Full Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder='Enter name'
                            error={errors.name}
                        />
                        <Input
                            label="Email Address *"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder='Enter email'
                            error={errors.email}
                        />
                        <Input
                            label="Phone Number"
                            placeholder="Digits only"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            error={errors.phone}
                        />
                        <Input
                            label="Job Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder='e.g. Project Lead'
                        />
                        <Input
                            label="Initials"
                            value={formData.initials}
                            onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                            placeholder='e.g. JD'
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-[#3D3462] uppercase tracking-widest">Role *</label>
                            <select
                                className={cn(
                                    "h-12 px-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C5DFA]/20 text-sm transition-all",
                                    errors.role ? "border-red-500" : "border-gray-200"
                                )}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                {availableRoles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </select>
                            {errors.role && <span className="text-[10px] text-red-500 font-medium">{errors.role}</span>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-[11px] font-bold text-[#3D3462] uppercase tracking-widest block mb-4">Designations *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {availableResponsibilities.map((resp) => (
                                <label key={resp.id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:bg-[#7C5DFA] checked:border-[#7C5DFA] transition-all"
                                            checked={formData.responsibilities.includes(resp.id)}
                                            onChange={() => handleCheckboxChange(resp.id)}
                                        />
                                        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-[#7C5DFA] transition-colors">{resp.title}</span>
                                </label>
                            ))}
                        </div>
                        {errors.responsibilities && <span className="text-[10px] text-red-500 font-medium">{errors.responsibilities}</span>}
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={confirmDeleteImage}
                onClose={() => setConfirmDeleteImage(false)}
                onConfirm={handleDeleteImage}
                message="Are you sure you want to delete this profile image?"
                title="Delete Image"
                isLoading={isDeletingImage}
            />
        </Modal>


    );
};

export default UserFormModal;