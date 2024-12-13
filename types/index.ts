export interface Order {
    customer: Customer;
    pizza: Pizza[];
    products: {
        name: String;
        observations: String;
    }
}

interface Customer {
    name: String;
    celPhoneNumber?: String;
    address?: String;
}

interface Pizza {
    size: String;
    edge: String;
    flavors: {
        name: String;
    }[]
    observations: String;
}
