"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useOrderModalStore } from "@/hooks/use-order-modal";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const formSchema = z.object({
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  orderType: z.enum(["entrega", "balcao", "mesa"]),
  tableNumber: z.number().optional(),
});

const orderTypeOptions = [
  { value: "entrega", label: "Entrega" },
  { value: "balcao", label: "Balcão" },
  { value: "mesa", label: "Mesa" },
];

export const CreateOrderModal = () => {
  const { modalType, isOpen, closeModal } = useOrderModalStore();
  const [loading, setLoading] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<string>("balcao");

  const isCreateModalOpen = isOpen && modalType === 'create';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      orderType: "balcao",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // Aqui você faria a chamada para criar o pedido
      const response = await axios.post('/api/orders', {
        ...values,
        establishmentId: window.location.pathname.split('/')[1], // ou passar como prop
      });
      
      toast.success('Pedido criado com sucesso!');
      closeModal();
      form.reset();
      // window.location.reload(); // ou usar router.refresh() se preferir
      
    } catch (error) {
      toast.error('Erro ao criar pedido');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeModal}
      title="Novo Pedido"
      description="Cadastre um novo pedido para o estabelecimento."
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="Digite o nome" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Tipo do Pedido</FormLabel>
              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Tabs 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedOrderType(value);
                        }}
                        className="mt-2"
                      >
                        <TabsList className="grid w-full grid-cols-3">
                          {orderTypeOptions.map((option) => (
                            <TabsTrigger key={option.value} value={option.value}>
                              {option.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedOrderType === "mesa" && (
              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Mesa</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        type="number"
                        placeholder="Ex: 1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="pt-6 space-x-2 flex items-center justify-end">
              <Button 
                disabled={loading} 
                variant="outline" 
                onClick={closeModal}
                type="button"
              >
                Cancelar
              </Button>
              <Button disabled={loading} type="submit">
                Criar Pedido
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};