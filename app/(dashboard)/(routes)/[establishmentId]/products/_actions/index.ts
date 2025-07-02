"use server"

import prismadb from "@/lib/prismadb";

export const toggleUpdate = async (id: string, field: string, value: boolean) => {
    try {
      const response = await prismadb.product.update({
        where: {
            id,
        },
        data: {
            [field]: value
        }
      })

      if (!response) {
        throw new Error("Erro ao atualizar o produto.");
      }
      console.log("Produto atualizado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };