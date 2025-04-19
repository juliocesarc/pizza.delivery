import { Customer, Order, ProductsWithFlavors } from "@/types";
import { create } from "zustand";


type OrderStore = {
    order: Order;
    setCustomer: (customer: Customer) => void;
    addProduct: (product: ProductsWithFlavors) => void;
}

export const useOrderStore = create<OrderStore>()((set) => ({
    order: {
        customer: {
            name: '',
            celPhoneNumber: '',
            address: '',
        },
        products: []
    },
    setCustomer: (customer) => 
        set((state) => ({
            order: {
                ...state.order,
                customer
            }
        })),
    addProduct: (product) =>
        set((state) => ({
            order: {
                ...state.order,
                products: [...state.order.products, product]
            }
        }))
}))