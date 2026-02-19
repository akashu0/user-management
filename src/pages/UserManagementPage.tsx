import { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type ColumnDef
} from '@tanstack/react-table';
import {
    Search, Plus, Edit2, Trash2,
    ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import { userService } from '../services/userService';
import type { User } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import UserFormModal from '../components/UserFormModal';

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState("all");

    const [userForm, setUserForm] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: string | null }>({
        isOpen: false,
        mode: 'add',
        data: null
    });

    // States for Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers(statusFilter);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchUsers();
    }, [statusFilter]);

    const handleSaveUser = async (formData: any, userId?: string | null) => {
        try {
            if (userForm.mode === 'add') {
                await userService.createUser(formData);
                fetchUsers();
                toast.success("User created successfully");
            } else {
                if (!userId) {
                    toast.error("User ID is required for update");
                    return;
                }
                await userService.updateUser(
                    formData,
                    userId
                );
                fetchUsers();
                toast.success("User updated successfully");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };



    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const statusLabel = newStatus ? 'Active' : 'Inactive';
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        try {
            await userService.updateUserStatus(id, newStatus);
            toast.success(`User status updated to ${statusLabel}`);
        } catch (error) {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus } : u));
            toast.error('Failed to update user status. Please try again.');
        }
    };

    // Open the confirmation modal instead of using window.confirm
    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Actual API call when confirmed in modal
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        const userObj = users.find(u => u.id === userToDelete);

        try {
            await userService.deleteUser(userToDelete);
            setUsers(prev => prev.filter(u => u.id !== userToDelete));
            toast.success(`${userObj?.name || 'User'} deleted successfully`);
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    const columns = useMemo<ColumnDef<User>[]>(() => [
        { accessorKey: 'name' },
        { accessorKey: 'email' },
        { accessorKey: 'initials' },
        { accessorKey: 'phoneNumber' },
        { accessorKey: 'role' },
        { accessorKey: 'status' },
        { accessorKey: 'title' }
    ], []);

    const table = useReactTable({
        data: users,
        columns,
        state: { globalFilter: searchTerm },
        onGlobalFilterChange: setSearchTerm,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    useEffect(() => {
        if (statusFilter === 'all') {
            table.getColumn('status')?.setFilterValue(undefined);
        } else {
            table.getColumn('status')?.setFilterValue(statusFilter === 'active');
        }
    }, [statusFilter, table]);

    const TableHeader = ({ title, columnId }: { title: string, columnId?: string }) => {
        const column = table.getColumn(columnId || "");
        return (
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => column?.toggleSorting()}>
                <span className="text-[11px] font-bold text-white uppercase tracking-widest whitespace-nowrap">{title}</span>
                <ArrowUpDown size={12} className={cn("shrink-0 transition-colors", column?.getIsSorted() ? "text-white" : "text-gray-400 group-hover:text-gray-200")} />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full font-poppins text-[#3D3462]">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C5DFA]/20 shadow-sm transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-11 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C5DFA]/20 text-sm font-semibold text-gray-600 shadow-sm cursor-pointer min-w-[160px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <Button
                    onClick={() => setUserForm({ isOpen: true, mode: 'add', data: null })}
                    className="flex items-center cursor-pointer gap-2 h-11 px-6 rounded-xl bg-[#7C5DFA] hover:bg-[#6a4fdb] text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Add New User</span>
                </Button>
            </div>

            <div className="flex-1 bg-[#E5E7EB] rounded-2xl p-6 overflow-hidden flex flex-col border border-gray-200 shadow-inner">
                <div className="grid grid-cols-12 px-8 py-4 mb-4 bg-[#504A6E] rounded-xl items-center shadow-md">
                    <div className="col-span-1"><span className="text-[11px] font-bold text-white uppercase tracking-widest">S.L</span></div>
                    <div className="col-span-1"><TableHeader title="Name" columnId="name" /></div>
                    <div className="col-span-2"><TableHeader title="Email" columnId="email" /></div>
                    <div className="col-span-1"><TableHeader title="Initials" columnId="initials" /></div>
                    <div className="col-span-2"><TableHeader title="Phone" columnId="phoneNumber" /></div>
                    <div className="col-span-1"><TableHeader title="Role" columnId="role" /></div>
                    <div className="col-span-1"><TableHeader title="Status" columnId="status" /></div>
                    <div className="col-span-2"><TableHeader title="Title" columnId="title" /></div>
                    <div className="col-span-1 text-right"><span className="text-[11px] font-bold text-white uppercase tracking-widest">Action</span></div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40 text-gray-500 font-medium italic">Loading users...</div>
                    ) : (
                        table.getRowModel().rows.map((row, idx) => {
                            const user = row.original;
                            return (
                                <div key={user.id} className="grid grid-cols-12 items-center bg-white px-8 py-3 rounded-xl shadow-sm border border-white hover:border-[#7C5DFA]/30 transition-all group">
                                    <div className="col-span-1 text-xs font-bold text-gray-400">
                                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + idx + 1}
                                    </div>
                                    <div className="col-span-1 text-sm font-medium text-[#3D3462]">{user?.name}</div>
                                    <div className="col-span-2 text-sm text-gray-500 font-medium line-clamp-1 break-all pr-2" title={user.email}>{user.email}</div>
                                    <div className="col-span-1 text-sm text-gray-500 font-medium">{user.initials || '--'}</div>
                                    <div className="col-span-2 text-sm text-gray-500 font-medium">{user.phoneNumber || '--'}</div>
                                    <div className="col-span-1 text-sm font-medium text-gray-500 tracking-tight">{user.role?.title || '--'}</div>
                                    <div className="col-span-1">
                                        <button
                                            onClick={() => handleToggleStatus(user.id, user.status)}
                                            className={cn("relative inline-flex h-5 w-10 items-center cursor-pointer rounded-full transition-colors focus:outline-none", user.status ? 'bg-[#7C5DFA]' : 'bg-gray-200')}
                                        >
                                            <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform", user.status ? 'translate-x-5.5' : 'translate-x-1')} />
                                        </button>
                                    </div>
                                    <div className="col-span-2 text-sm text-gray-500 font-medium truncate">{user.title || '--'}</div>
                                    <div className="col-span-1 flex justify-end gap-1">
                                        <button onClick={() => setUserForm({ isOpen: true, mode: 'edit', data: user.id })} className="text-blue-500 hover:bg-blue-50 p-2 cursor-pointer rounded-lg transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-500 hover:bg-red-50 p-2 cursor-pointer rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between px-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                    showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} results
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-[#7C5DFA] shadow-sm transition-all border border-gray-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
                    {Array.from({ length: table.getPageCount() }, (_, i) => (
                        <button key={i} onClick={() => table.setPageIndex(i)} className={cn("w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all border border-gray-100", table.getState().pagination.pageIndex === i ? "bg-[#7C5DFA] text-white shadow-lg shadow-indigo-100" : "bg-white text-[#3D3462] hover:bg-gray-50")}>{i + 1}</button>
                    ))}
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-[#7C5DFA] shadow-sm transition-all border border-gray-100 disabled:opacity-50"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                isLoading={isDeleting}
            />

            {/* Add/Edit User Modal */}
            <UserFormModal
                isOpen={userForm.isOpen}
                mode={userForm.mode}
                userId={userForm.data}
                onClose={() => setUserForm({ ...userForm, isOpen: false })}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default UserManagementPage;