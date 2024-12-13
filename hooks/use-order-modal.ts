import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isModalOpen: false, // false
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
}));
