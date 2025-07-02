import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string }
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true
    }
  });

  const categories = await prismadb.category.findMany();

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={product}
          categories={categories} 
        />
      </div>
    </div>
  );
}

export default ProductPage;