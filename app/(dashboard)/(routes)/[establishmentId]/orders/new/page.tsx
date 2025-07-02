"use client"

import { OrdersEdit } from "@/components/modals/orders/order-edit";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/components/ui/multiple-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getCategories, getFlavors, searchCustomerByPhone } from "../__actions/actions";
import { useOrderStore } from "@/hooks/use-order";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit2, Printer, Trash2 } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

const options = [
    { value: "entrega", label: "Entrega" },
    { value: "balcao", label: "Balcão" },
    { value: "mesa", label: "Mesa" },
]

type categories = {
    id: string;
    name: string;
    products: {
        id: string;
        name: string;
        minOptions: number,
        maxOptions: number;
    }[]
}[]

const NewOrderPage = () => {
  const params = useParams()

  const establishmentId = params.establishmentId as string

    const [phoneInput, setPhoneInput] = useState<string>('');
    const [nameInput, setNameInput] = useState<string>(''); // Estado para o nome
    const [suggestedPhones, setSuggestedPhones] = useState<{ celphone: string; name: string }[]>([]);
    const [localActiveValue, setLocalActiveValue] = useState<string>("balcao");
    const [categorieActiveValue, setCategorieActiveValue] = useState<string>("");
    const [categoriesWithProducts, setCategoriesWithProducts] = useState<categories>([]);
    const [flavors, setFlavors] = useState<any[]>([])
    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedPhone = useDebounce(phoneInput, 400);

    const { order } = useOrderStore();
  
    const selectedCategory = categoriesWithProducts.find(
        (category) => category.id === categorieActiveValue
    );

    const filteredProducts = categoriesWithProducts.flatMap((category) =>
        category.products
            .filter((product) =>
                product.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((product) => ({
                id: product.id,
                name: product.name,
                categoryName: category.name, // Inclui o nome da categoria para exibição
            }))
    );

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const phone = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      setPhoneInput(phone);
    };
  
    const handleSelectPhone = (selectedPhone: { celphone: string; name: string }) => {
      setPhoneInput(selectedPhone.celphone); // Preenche o input de telefone
      setNameInput(selectedPhone.name); // Preenche o input de nome
      setSuggestedPhones([]); // Limpa as sugestões
    };

    useEffect(() => {
      const fetchSuggestions = async () => {
        if (debouncedPhone.length >= 4 && debouncedPhone.length < 11) {
          try {
            const result = await searchCustomerByPhone(debouncedPhone, establishmentId);
            setSuggestedPhones(result || []);
          } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
          }
        }
      };
  
      fetchSuggestions();
    }, [debouncedPhone]);
  
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories(establishmentId)
                setCategoriesWithProducts(result || []);
                console.log("result", result)
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const flavors = await getFlavors(categorieActiveValue);
                setFlavors(flavors || []);
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }
        fetchFlavors();
    }, [categorieActiveValue])


  return ( 
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Heading title="Novo Pedido" description="Crie um novo pedido para o cliente" />
                <Button>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div> 
            <Separator />  
            <div className="flex h-full py-4 gap-4">
                <div className="flex flex-col gap-4 lg:w-4/5">
                    <div className="flex gap-3">
                        <div className="relative">
                        <Input
                            placeholder="Telefone"
                            value={phoneInput}
                            onChange={handlePhoneChange}
                        />
                
                        {suggestedPhones.length > 0 && (
                            <div className="absolute z-50 bg-gray-100 border rounded shadow mt-1 w-full">
                            {suggestedPhones.map((user) => (
                                <div
                                key={user.celphone}
                                className="p-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                                onClick={() => handleSelectPhone(user)}
                                >
                                {user.celphone}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                
                        <Input
                        placeholder="Nome"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)} // Permite edição manual, se necessário
                        />

                        <Tabs value={localActiveValue} onValueChange={setLocalActiveValue}>
                            <TabsList>
                                {options.map((option) => (
                                    <TabsTrigger key={option.value} value={option.value}>
                                        {option.label}
                                    </TabsTrigger>
                                ))}                
                            </TabsList>
                        </Tabs> 
                    </div>
                    <div className="flex gap-3">
                        <Tabs value={categorieActiveValue} onValueChange={setCategorieActiveValue}>
                            <TabsList>
                                {categoriesWithProducts.map((categorie) => (
                                    <TabsTrigger key={categorie.name} value={categorie.id}>
                                        {categorie.name}
                                    </TabsTrigger>
                                ))}                
                            </TabsList>
                        </Tabs> 
                        <div className="relative flex-grow">
                            <Input
                                placeholder="Pesquisar"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full"
                            />
                    
                            {searchInput && filteredProducts.length > 0 && (
                                <div className="absolute z-50 bg-gray-100 border rounded shadow mt-1 w-full">
                                {filteredProducts.map((product) => (
                                    <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                                
                                    >
                                    {product.categoryName}: {product.name}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <OrdersEdit products={selectedCategory?.products} flavors={flavors} />
                </div>
                <div className="lg:w-1/5 p-4 bg-white text-gray-700">
                    <h3 className="text-lg font-semibold">Resumo do pedido</h3>
                    <ul className="font-medium">                        
                        {order.products.map((item) => (
                            <li key={item.id}>
                                - {item.name} 
                                <div className="flex flex-col">
                                    {item.flavors.map((flavor) => (
                                        <span key={flavor.id}>{flavor.name}</span>
                                    ))}
                                </div>  
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    </div>    
  );
};

export default NewOrderPage;