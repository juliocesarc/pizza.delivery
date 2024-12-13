import { Order } from "@/types";
import { create } from "zustand";

type OrderStore = {
    orders: Order[];
    add: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>()((set) => ({
    orders: [],
    add: (order: Order) => 
        set((state) => ({
            orders: [...state.orders, order],
        }))
}))