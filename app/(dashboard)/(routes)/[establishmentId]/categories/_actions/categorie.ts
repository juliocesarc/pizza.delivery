"use server"

import prismadb from "@/lib/prismadb";

interface UpsertCategorieData {
    data: {
        name: string;
        billboardId?: string | undefined;
    },
    categoryId?: string
}


export const UpsertCategorie = async ({data, categoryId}: UpsertCategorieData) => {
    const category = await prismadb.category.upsert({
        where: { id: categoryId },
        create: {
            establishmentId: "a3c08158-9fa6-498b-bbf9-2b6358767520",
            name: data.name,
            bannerId: data.billboardId
        },
        update: {
            name: data.name,
            bannerId: data.billboardId
        }
    })

    return category
}