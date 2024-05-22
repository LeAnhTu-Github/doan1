import { create } from "zustand";

interface UpdateModalStore {
    isOpen: boolean;
    userId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

const useUpdateModal = create <UpdateModalStore>((set) => ({
    isOpen: false,
    userId: null,
    onOpen: (id: string) => set({ isOpen: true, userId: id }),
    onClose: () => set({ isOpen: false, userId: null }),
}));

export default useUpdateModal;