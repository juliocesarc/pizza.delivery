"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Product } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { MultipleSelector } from "@/components/ui/multiple-select"

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(15),
  // image: z.string(),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  categories: z.array(z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
  })).min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: (Product & {
    category: Category[];
  }) | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const options = categories.map(item => ({
    value: item.id,
    label: item.name
  }))

  const title = initialData ? 'Editar produto' : 'Criar produto';
  const description = initialData ? 'Faça alterações no produto.' : 'Adicione um novo Produto';
  const toastMessage = initialData ? 'Produto editado.' : 'Produto criado.';
  const action = initialData ? 'Salvar Mudanças' : 'Criar';

  const defaultValues = initialData ? {
    ...initialData,
    stock: initialData?.stock || 1,
    // image: initialData?.images[0]?.url,
    price: parseFloat(String(initialData?.price)),
    categories: initialData?.category.map(categorie => ({ 
      label: categorie.name,
      value: categorie.id
    }))
  } : {
    name: '',
    description: '',
    price: 0,
    stock: 1,
    // image: '',
    categories: [],
    isFeatured: false,
    isArchived: false,
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/products`, data);
      }
      router.refresh();
      router.push(`/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Ocorreu algum erro.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      router.push(`/products`);
      toast.success('Produto Deletado.');
    } catch (error: any) {
      toast.error('Ocorreu algum erro.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Images */}
            {/* <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagens</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={(url) => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Categoria */}
            <FormField
              control={form.control}
              name="categories"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <MultipleSelector 
                      className="mt-4"
                      value={field.value}
                      onChange={field.onChange}
                      defaultOptions={options} 
                      placeholder="Selecione uma categoria..."
                      />
                  </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">

            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preço */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estoque */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <div className="md:col-span-3 min-h-24">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="min-h-36">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Descrição do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Apresentar na página principal */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Apresentar
                    </FormLabel>
                    <FormDescription>
                      Este produto aparecerá na página inicial
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Arquivar */}
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Arquivado
                    </FormLabel>
                    <FormDescription>
                      Este produto não aparecerá em nenhum lugar da loja.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};