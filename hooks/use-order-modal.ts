import { Order } from "@/app/(dashboard)/(routes)/[establishmentId]/orders/components/ordersForm";
import { create } from "zustand";

type ModalType = 'create' | 'details' | 'approve' | null;

interface OrderModalStore {
  modalType: ModalType;
  isOpen: boolean;
  selectedOrder: Order | null;
  onApproveCallback?: (orderId: string) => void;
  onRejectCallback?: (orderId: string) => void;

  openCreateModal: () => void;
  openDetailsModal: (order: Order) => void;
  openApproveModal: (
    order: Order,
    onApprove?: (orderId: string) => void,
    onReject?: (orderId: string) => void
  ) => void;
  closeModal: () => void;
}

export const useOrderModalStore = create<OrderModalStore>((set) => ({
  modalType: null,
  isOpen: false,
  selectedOrder: null,
  onApproveCallback: undefined,
  onRejectCallback: undefined,

  openCreateModal: () => set({
    modalType: 'create', 
    isOpen: true, 
    selectedOrder: null,
    onApproveCallback: undefined,
    onRejectCallback: undefined
  }),

  openDetailsModal: (order: Order) => set({
    modalType: 'details', 
    isOpen: true, 
    selectedOrder: order,
    onApproveCallback: undefined,
    onRejectCallback: undefined
  }),

  openApproveModal: (order: Order, onApprove, onReject) => set({
    modalType: 'approve', 
    isOpen: true, 
    selectedOrder: order,
    onApproveCallback: onApprove,
    onRejectCallback: onReject
  }),

  closeModal: () => set({
    modalType: null, 
    isOpen: false, 
    selectedOrder: null,
    onApproveCallback: undefined,
    onRejectCallback: undefined
  }),
}));