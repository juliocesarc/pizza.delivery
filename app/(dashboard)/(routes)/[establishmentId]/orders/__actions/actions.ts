"use server"

import prismadb from "@/lib/prismadb";
import axios from "axios";
import { redirect } from "next/navigation";

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
          name: true
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
        }
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

export async function getOrdersByEstablishment(establishmentId: string, token: string): Promise<Order[]> {
  try {
    if (!establishmentId?.trim()) {
      throw new Error('ID do estabelecimento é obrigatório');
    }

    const response = await axios.get(`https://api.pizzarianapole.com.br/cashiers/${establishmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status != 200) {
      throw new Error(`Erro ao buscar pedidos: ${response.status}`);
    }

    let { orders } = response.data

    orders = (orders || []).map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      totalAmount: Number(order.totalAmount) || 0
    }));

    return orders;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirect('/sign-in');
    }
    
    return [];
  }
}