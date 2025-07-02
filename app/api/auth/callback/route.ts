import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log(body.data)
        const { id, email_addresses, first_name, image_url } = body?.data

        const email = email_addresses[0]?.email_address

        // Cria ou atualiza o usuário no banco
        await prismadb.user.upsert({
            where: { externalId: id },
            update: { email, name: first_name },
            create: {
                externalId: id,
                email,
                name: first_name,
                role: "admin",
                // ajuste aqui se quiser criar dinamicamente um estabelecimento
                establishment: {
                    connectOrCreate: {
                        where: { id: "default-establishment-id" },
                        create: { name: "Minha Pizzaria" },
                    },
                },
            },
        });

        return new NextResponse('User updated in database successfully', {
            status: 200,
          })
    } catch (error) {
        console.error('Error updating database:', error)
        return new NextResponse('Error updating user in database', { status: 500 })
    }
}
