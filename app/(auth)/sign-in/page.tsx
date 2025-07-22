'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const signInSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async ({ email, password }: SignInFormData) => {
        setIsLoading(true);
        setError(""); 

        try {
            const { data } = await axios.post("/api/auth/users/sessions",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            )

            if (data?.error) {
                setError("Credenciais inválidas");
                return;
            }

            router.push("/establishments");
        } catch (err) {
            setError("Erro interno do servidor");
            console.error("Erro no login:", err);
        } finally {
            setIsLoading(false);
        }
    } 

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Entrar</CardTitle>
                    <CardDescription className="text-sm">
                        Digite seu e-mail abaixo para acessar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <label htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <span className="text-sm text-red-600">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <label htmlFor="password">Senha</label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <span className="text-sm text-red-600">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}