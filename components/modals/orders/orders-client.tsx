import { getCategories, getFlavors, searchCustomerByPhone } from "@/app/(dashboard)/(routes)/[establishmentId]/orders/__actions/actions";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/components/ui/multiple-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { OrdersEdit } from "./order-edit";

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
        maxFlavors: number;
    }[]
}[]

export const OrdersClient = () => {
    const [phoneInput, setPhoneInput] = useState<string>('');
    const [nameInput, setNameInput] = useState<string>(''); // Estado para o nome
    const [suggestedPhones, setSuggestedPhones] = useState<{ celphone: string; name: string }[]>([]);
    const [localActiveValue, setLocalActiveValue] = useState<string>("balcao");
    const [categorieActiveValue, setCategorieActiveValue] = useState<string>("");
    const [categoriesWithProducts, setCategoriesWithProducts] = useState<categories>([]);
    /* const [flavors, setFlavors] = useState<Flavor[]>([]) */
    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedPhone = useDebounce(phoneInput, 400);
  
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
            const result = await searchCustomerByPhone(debouncedPhone, "");
            setSuggestedPhones(result || []);
          } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
          }
        }
      };
  
      fetchSuggestions();
    }, [debouncedPhone]);
  
/*     useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories()
                setCategoriesWithProducts(result || []);
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }
        fetchCategories();
    }, []); */

/*     useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const flavors = await getFlavors(categorieActiveValue);
                setFlavors(flavors || []);
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }
        fetchFlavors();
    }, [categorieActiveValue]) */


    return (
        <>
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
            <FormLabel>Pedido</FormLabel>
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
           {/*  <OrdersEdit products={selectedCategory?.products} flavors={flavors} /> */}
        </>
    );
  };
  