import { Flavor } from "@prisma/client";

export interface Order {
    customer: Customer;
    products: ProductsWithFlavors[] | []
}

export interface Customer {
    name: String;
    celPhoneNumber?: String;
    address?: String;
}

export interface ProductsWithFlavors {
    id: string;
    name: string;
    maxFlavors: number;
    flavors: Flavor[];
};

// interface Pizza {
//     size: String;
//     edge: String;
//     flavors: {
//         name: String;
//     }[]
//     observations: String;
// }
