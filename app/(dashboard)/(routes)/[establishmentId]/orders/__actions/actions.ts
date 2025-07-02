"use server"

import prismadb from "@/lib/prismadb";

export async function getCategories(establishmentId: string) {
  const categories = await prismadb.category.findMany({
    where: {
      establishmentId,
    },
    select: {
      id: true,
      name: true,
      products: {
        select: {
          id: true,
          name: true,
          minOptions: true,
          maxOptions: true,
        }
      }
    },
    orderBy: {
      createdAt: 'asc',
    }
  });

  return categories
}

export async function getFlavors(categoryId: string) {
  const flavors = await prismadb.product.findMany({
    where: {
      categoryId,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return flavors
}

export async function searchCustomerByPhone(phone: string | number, establishmentId: string) {
  try {
    const response = await prismadb.customer.findMany({
      where: {
        celphone: {
          contains: phone.toString(),
        },
        establishmentId,
      },
      select: {
        celphone: true,
        name: true,
        id: true,
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return [];
  }
};

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  options?: {
    name: string;
    price: number;
  }[];
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  items: OrderItem[];
}

interface ApiResponse {
  orders: Order[];
  count?: number;
  establishmentId?: string;
}

export async function getOrdersByEstablishment(establishmentId: string): Promise<Order[]> {
  try {
    if (!establishmentId?.trim()) {
      throw new Error('ID do estabelecimento é obrigatório');
    }

    const response = await fetch(`https://api.pizzarianapole.com.br/cashiers/${establishmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pedidos: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    const orders = (data.orders || []).map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      totalAmount: Number(order.totalAmount) || 0
    }));

    return orders;

  } catch (error) {
    console.error('❌ Erro na Server Action getOrdersByEstablishment:', error);
    return [];
  }
}