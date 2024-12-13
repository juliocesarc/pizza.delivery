"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


// Definindo o schema Zod
const createOrderFormSchema = z.object({
  customerType: z.enum(['Balcão', 'Mesa', 'Entrega']),
  phone: z.string().min(10, "Telefone deve ter ao menos 10 dígitos"),
  name: z.string().min(1, "Nome é obrigatório"),
  promocao: z.any(),
  pizzas: z.array(
    z.object({
      size: z.enum(['Pequena', 'Média', 'Grande']),
      flavors: z.array(z.string()).nonempty("Informe ao menos um sabor"),
      edge: z.string().optional(),
    })
  ),
  discount: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(['Dinheiro', 'Cartão', 'Pix']).optional(),
  notes: z.string().optional(),
  products: z
    .array(
      z.object({
        name: z.string().min(1, "Nome do produto é obrigatório"),
        notes: z.string().optional(),
      })
    )
});

// Tipos inferidos do schema Zod
type OrderForm = z.infer<typeof createOrderFormSchema>;
type Pizza = OrderForm['pizzas'][number];
type Product = OrderForm['products'][number];

export const OrdersForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderForm>({
    resolver: zodResolver(createOrderFormSchema),
  });

  const pizzaForm = useForm<Pizza>({
    defaultValues: {
      size: 'Média',
      flavors: [''],
      edge: ''
    },
  });

  const productForm = useForm<Product>({
    defaultValues: {
      name: '',
      notes: ''
    },
  });

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Função para salvar informações da pizza
  const savePizza: SubmitHandler<Pizza> = (data) => {
    setPizzas((prevPizzas) => [...prevPizzas, data]);
    pizzaForm.reset(); // Limpa os campos do formulário de pizza
  };

  // Função para salvar produto adicional
  const saveProduct: SubmitHandler<Product> = (data) => {
    setProducts((prevProducts) => [...prevProducts, data]);
    productForm.reset(); // Limpa os campos do formulário de produto
  };

  // Função para concluir o pedido
  const concludeOrder: SubmitHandler<OrderForm> = (data) => {
    console.log('Pedido concluído:', { ...data, pizzas, products });
    // Aqui você pode enviar os dados para um servidor ou realizar outra ação
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(concludeOrder)} className="space-y-4">
        <div>
          <label>Cliente</label>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <select {...register("customerType")}>
                <option value="Balcão">Balcão</option>
                <option value="Mesa">Mesa</option>
                <option value="Entrega">Entrega</option>
              </select>
            </div>

            <div>
              <label>Telefone</label>
              <Input type="text" {...register("phone")} />
              {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label>Nome</label>
              <Input type="text" {...register("name")} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className='col-span-2'>
            <label>Pedido</label>
            <Input type="text" placeholder='promoção' {...register("promocao")} />
          </div>

          <form onSubmit={pizzaForm.handleSubmit(savePizza)}>
            <div>
              <label>Tamanho</label>
              <select {...pizzaForm.register("size")}>
                <option value="Pequena">Pequena</option>
                <option value="Média">Média</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div>
              <label>Sabor</label>
              <Input type="text" {...pizzaForm.register("flavors.0")} placeholder="Sabor 1" />
              {pizzaForm.formState.errors.flavors && <p className="text-red-500">{pizzaForm.formState.errors.flavors.message}</p>}
            </div>
            <div>
              <label>Borda</label>
              <Input type="text" {...pizzaForm.register("edge")} placeholder="Borda" />
            </div>
            <Button type="submit">Salvar Pizza</Button>
          </form>

          <div>
            <div>
              <label>Desconto (%)</label>
              <Input type="number" {...register("discount")} />
            </div>
            
            <div>
              <label>Método de Pagamento</label>
              <select {...register("paymentMethod")}>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão</option>
                <option value="Pix">Pix</option>
              </select>
            </div>

            <div>
              <label>Notas</label>
              <Textarea {...register("notes")} />
            </div>
          </div>

          <form onSubmit={productForm.handleSubmit(saveProduct)}>
            <div>
              <label>Nome do Produto</label>
              <Input type="text" {...productForm.register("name")} placeholder="Nome do Produto" />
              {productForm.formState.errors.name && <p className="text-red-500">{productForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <label>Notas</label>
              <Textarea {...productForm.register("notes")} placeholder="Notas sobre o produto" />
            </div>
            <Button type="submit">Salvar Produto</Button>
          </form>
        </div>

        <Button type="submit">Concluir Pedido</Button>
      </form>

      <h2 className="text-lg font-semibold mt-4">Pizzas adicionadas:</h2>
      <ul>
        {pizzas.map((pizza, index) => (
          <li key={index}>{pizza.size} - {pizza.flavors.join(', ')} - {pizza.edge || 'Sem borda'}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mt-4">Produtos adicionados:</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name} - {product.notes || 'Sem notas'}</li>
        ))}
      </ul>
    </div>
  );
};

