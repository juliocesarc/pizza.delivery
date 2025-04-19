"use server"

import prismadb from "@/lib/prismadb";

export async function getCategories() {
    const categories = await prismadb.category.findMany({
        select: {
            id: true,
            name: true,
            products: {
              select: {
                id: true,
                name: true,
                maxFlavors: true,
            }}
        },
        orderBy: {
          createdAt: 'asc',
        }
    });

    return categories
}

export async function getFlavors(categoryId: string) {
  const flavors = await prismadb.flavor.findMany({
      where: {
          categoryId: categoryId,
      },
      take: 10
  });

  return flavors
}

export async function searchUserByPhone(phone: string | number) {
    try {
      const response = await prismadb.user.findMany({
        where: {
          celphone: {
            contains: phone.toString(),
          },
        },
        select: {
          celphone: true,
          name: true,
        },
      })
    
      return response;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
};
  