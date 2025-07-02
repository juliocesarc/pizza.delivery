import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/hooks/use-order";
import { ProductsWithFlavors } from "@/types";
import { add } from "lodash";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Flavor = {
    id: string;
    name: string;
  };

type ordersEditProps = {
    products: {
        id: string;
        name: string;
        maxOptions: number;
    }[] | undefined;
    flavors: Flavor[];
} 

type selectedProduct = {
    id: string;
    name: string;
    maxOptions: number;
    flavors: Flavor[] | [];
}

export const OrdersEdit = ({ products, flavors }: ordersEditProps) => {
    const { order, addProduct } = useOrderStore();
    const [product, setProduct] = useState<selectedProduct | null>(null);
    const [showFlavors, setShowFlavors] = useState(false);

    const handleAddProduct = (product: {
        id: string;
        name: string;
        maxOptions: number;
    }) => {
        setProduct({ ...product, flavors: [] });
        
        if (product.maxOptions === 1) {
            addProduct({ ...product, flavors: [] });
            setProduct(null);
            return;
        }

        setShowFlavors(true);
    };

    const handleAddFlavor = (flavor: Flavor) => {
        if (!product) return;
        setProduct({
            ...product,
            flavors: [...product?.flavors, flavor]
        });
        setShowFlavors(false);
    }

    const handleRemoveFlavor = (index: number) => {
        setProduct((prevProduct) => {
            if (!prevProduct) return null;
    
            const updatedProduct = {
                ...prevProduct,
                flavors: prevProduct.flavors.filter((_, i) => i !== index)
            };
    
            return updatedProduct;
        });
    };

    return (
        <>
            <div className="grid grid-cols-7 gap-4">
            {/* Exibe os produtos disponíveis */}
            {!product && products && (  
                <>
                {products.map((product) => (
                    <div
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="flex justify-center items-center text-gray-700 bg-gray-200 text-sm h-20 rounded-lg cursor-pointer hover:bg-gray-300"
                    >
                        {product.name}
                    </div>
                ))}
                </>
            )}

            {/* Exibe os sabores disponíveis */}
            {product && product.maxOptions > 1 && showFlavors && (
                <>
                    {flavors
                        .map((flavor) => (
                        <div
                            key={flavor.name}
                            onClick={() => handleAddFlavor(flavor)}
                            className="flex justify-center items-center text-gray-700 bg-gray-200 h-20 rounded-lg cursor-pointer hover:bg-gray-300"
                        >
                            {flavor.name}
                        </div>
                    ))}
                </>
            )}

            {/* Exibe os sabores já selecionados */}
            {product && !showFlavors && (
                <>
                {product.flavors.map((flavor, index) => (
                    <div
                    key={index}
                    onClick={() => handleRemoveFlavor(index)}
                    className="relative flex justify-center items-center text-gray-700 bg-gray-200 h-20 rounded-lg cursor-pointer group transition duration-200"
                    >
                    {/* Nome do sabor */}
                    <span>{flavor.name}</span>
                    <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-60 rounded-lg transition duration-200"></div>
                    <Trash2
                        className="absolute w-5 h-5 text-gray-500 font-medium opacity-0 group-hover:opacity-100 group-hover:text-red-600 transition duration-200"
                    />
                    </div>
                ))}

                {/* Exibe o botão "Adicionar" somente se não estiver no modo de adição */}
                {product.flavors.length < product?.maxOptions && (
                    <button
                    onClick={() => setShowFlavors(true)}
                    className="flex justify-center items-center text-white bg-blue-500 h-20 rounded-lg"
                    >
                    Adicionar
                    </button>
                )}
                </>
            )}

            </div>
            {product && !showFlavors && (
                <div className="flex gap-3 mt-4">
                    <Button onClick={() => {addProduct(product) 
                        setProduct(null)}}>Adicionar</Button>
                    <Button variant={"destructive"} onClick={() => setProduct(null)}>Cancelar</Button>
                </div>
            )}
        </>
    )
}