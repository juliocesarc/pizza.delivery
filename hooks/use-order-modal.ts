import { Order } from "@/app/(dashboard)/(routes)/[establishmentId]/orders/components/ordersForm";
import { create } from "zustand";

type ModalType = 'create' | 'details' | 'approve' | null;

interface OrderModalStore {
  modalType: ModalType;
  isOpen: boolean;
  selectedOrder: Order | null;
  
  openCreateModal: () => void;
  openDetailsModal: (order: Order) => void;
  openApproveModal: (order: Order) => void;
  closeModal: () => void;
}

export const useOrderModalStore = create<OrderModalStore>((set) => ({
  modalType: null,
  isOpen: false,
  selectedOrder: null,
  
  openCreateModal: () => set({ 
    modalType: 'create', 
    isOpen: true, 
    selectedOrder: null 
  }),
  
  openDetailsModal: (order: Order) => set({ 
    modalType: 'details', 
    isOpen: true, 
    selectedOrder: order 
  }),
  
  openApproveModal: (order: Order) => set({ 
    modalType: 'approve', 
    isOpen: true, 
    selectedOrder: order 
  }),
  
  closeModal: () => set({ 
    modalType: null, 
    isOpen: false, 
    selectedOrder: null 
  }),
}));