"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type Establishment = {
    id: string;
    name: string;
    phone: string;
    address: string;
};

export default function EstablishmentsGrid({
    establishments,
}: {
    establishments: Establishment[];
}) {
    return (
        <div>
            <h2 className="mb-4 text-2xl font-semibold">Selecione o estabelecimento</h2>

            <div className="flex flex-col gap-4">
                {/* Card “Criar novo” */}
                <Link href="/establishments/new" className="group outline-none">
                    <Card className="flex h-full cursor-pointer items-center justify-center transition hover:shadow-md group-hover:shadow-lg bg-white">
                        <div className="flex items-center text-zinc-700 py-2.5 gap-2">
                            <Plus className="h-6 w-6 font-bold" />
                            <CardTitle className="text-lg">Novo estabelecimento</CardTitle>
                        </div>
                    </Card>
                </Link>

                {establishments.map((est) => (
                    <Link key={est.id} href={`/${est.id}/orders`} className="group outline-none">
                        <Card className="h-full cursor-pointer transition hover:shadow-md group-hover:shadow-lg">
                            <CardHeader className="p-4 pb-2.5">
                                <CardTitle className="text-lg">{est.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 text-sm text-muted-foreground">
                                <p>{est.address}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
