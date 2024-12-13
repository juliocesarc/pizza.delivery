"use server"

import prismadb from "@/lib/prismadb";

export async function getProductData() {
    const data = await prismadb.product.findMany()
    return data
}