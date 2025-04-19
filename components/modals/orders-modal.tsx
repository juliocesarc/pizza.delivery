"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/hooks/use-order-modal";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Product } from "@prisma/client";
import { useDebounce } from "../ui/multiple-select";
import { OrderClient } from "@/app/(dashboard)/(routes)/orders/components/client";
import { OrdersClient } from "./orders/orders-client";

const formSchema = z.object({
  name: z.string().min(1),
  celphone: z.number()
});

const options = [
  { value: "entrega", label: "Entrega" },
  { value: "balcao", label: "Balcão" },
  { value: "mesa", label: "Mesa" },
];

export const OrdersModal = () => {
  const { isModalOpen, closeModal } = useModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stores', values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Novo pedido"
      description="Cadastre um novo pedido."
    >
        {/* <div className="space-y-4 py-2 pb-4"> */}
          <div>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormLabel>Cliente</FormLabel>
                <OrdersClient/>
                {/* <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="celphone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input disabled={loading} placeholder="Telefone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> *
                  <Tabs value={activeValue} onValueChange={setActiveValue}>
                    <TabsList>
                      {options.map((option) => (
                        <TabsTrigger key={option.value} value={option.value}>
                          {option.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input disabled={loading} placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> 
                </div>
                <div>
                  {productData.map((product) => (
                    <div key={product.name}>
                      <p>{product.name}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between w-full">
                  <p className="font-medium">R$: 250,00</p>
                  <div>
                    <Button disabled={loading} variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button disabled={loading} type="submit">Continue</Button>
                  </div>
                </div> */}
              </form>
            </Form>
          </div>

      {/* </div> */}
    </Modal>
  );
};