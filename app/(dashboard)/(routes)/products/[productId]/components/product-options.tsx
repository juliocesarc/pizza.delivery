import { Input } from "@/components/ui/input";
import { Plus, Trash2, X } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";


export const ProductOptions: React.FC = () => {
    const [product, setProduct] = useState("Baju Kemeja Flanel");
    const [variant, setVariant] = useState([{ name: "", value: [] }]);
    const [productCombine, setProductCombine] = useState([]);
  
    const generateCombination = (arrays) => {
      let resultCombination = [];
      if (arrays.length > 1 && arrays[1].value.length > 0) {
        for (var i = 0; i < arrays[0].value.length; i++) {
          for (var j = 0; j < arrays[1].value.length; j++) {
            let combine = [
              { id: i, label: arrays[0].value[i] || "" },
              { id: j, label: arrays[1].value[j] || "" }
            ];
            resultCombination.push(combine);
          }
        }
      } else {
        for (var i = 0; i < arrays[0].value.length; i++) {
          let combine = [{ id: i, label: arrays[0].value[i] || "" }];
          resultCombination.push(combine);
        }
      }
      return setProductCombine(resultCombination);
    };
  
    useEffect(() => {
      generateCombination(variant);
    }, [variant]);
  
    const handleVariant = (event) => {
      let input_name = event.target.name;
      let split = input_name.split("_");
      let index = parseInt(split[2], 10);
      let variants = [...variant];
      let item = { ...variants[index], name: event.target.value };
      variants[index] = item;
      setVariant(variants);
    };
  
    const handleVariantValue = (event, parent) => {
      let input_name = event.target.name;
      let split = input_name.split("_");
      let index = parseInt(split[2], 10);
      let variants = [...variant];
      let values = [...variants[parent].value];
      values[index] = event.target.value;
      let item = { ...variants[parent], value: values };
      variants[parent] = item;
      setVariant(variants);
    };
  
    const addVariant = () => {
      let newVariant = {
        name: "",
        value: []
      };
      setVariant((oldVariant) => [...oldVariant, newVariant]);
      console.log(productCombine);
    };
  
    const addOption = (parent, child) => {
      let variants = [...variant];
      let values = [...variants[parent].value];
      values[child + 1] = "";
      let item = { ...variants[parent], value: values };
      variants[parent] = item;
      setVariant(variants);
    };
  
    const removeVariant = (index) => {
      let variants = [...variant];
      if (variants.length > 1 && index > -1) {
        variants.splice(index, 1);
      }
      setVariant(variants);
    };
  
    const removeOption = (parent, child) => {
      let variants = [...variant];
      if (variants[parent].value.length > 1 && child > -1) {
        variants[parent].value.splice(child, 1);
      }
      setVariant(variants);
    };
  
    const outputInputVariant = [];
    for (let i = 0; i < variant.length; i++) {
      const outputInputVariantValue = [];

      // Cria a primeira opção da variação
      if (variant[i].value.length === 0) {
            outputInputVariantValue.push(
                <div key={0} className="flex">
                    <Input 
                        // value={variant[i].value[0] || ""}
                        onChange={(event) => handleVariantValue(event, i)}
                        placeholder="Ex: Branco, Amarelo, Azul"
                        className="w-40" 
                    />
                    <div className="flex items-center">
                        <span 
                            onClick={() => addOption(i, 0)}
                            className="ml-1 p-0.5 cursor-pointer text-gray-500 hover:text-gray-700">
                            <Plus size={16} />
                        </span>
                    </div>
                </div>
            );
      } else {
        for (let j = 0; j < variant[i].value.length; j++) {
          outputInputVariantValue.push(
            <div key={j} className="flex">
                <Input 
                    // value={variant[i].value[j] || ""}
                    onChange={(event) => handleVariantValue(event, i)}
                    placeholder="Ex: Branco, Amarelo, Azul"
                    className="w-40" 
                />
                <div className="flex items-center">
                    <span 
                        onClick={() => addOption(i, j)}
                        className="ml-1 p-0.5 cursor-pointer text-gray-500 hover:text-gray-700">
                        <Plus size={16} />
                    </span>
                    <span 
                        onClick={() => removeOption(i, j)}
                        className="ml-1 p-0.5 cursor-pointer text-gray-500 hover:text-gray-700">
                        <Trash2 size={16} />
                    </span>
                </div>
            </div>
          );
        }
      }

      outputInputVariant.push(
        // <div key={i} className="variant_wrapper">
        //   <label>Variant {i + 1}</label>
        //   <br />
        //   <input
        //     className="input_variant"
        //     name={"variant_name_" + i}
        //     value={variant[i].name}
        //     onChange={handleVariant}
        //     type="text"
        //     placeholder="Nama Variant Eg: (Color, Size, etc)"
        //   />
  
        //   {i < variant.length && variant.length < 2 && (
        //     <button style={{ marginLeft: "5px" }} onClick={() => addVariant()}>
        //       +
        //     </button>
        //   )}
  
        //   {variant.length === 2 && (
        //     <button
        //       style={{ marginLeft: "5px" }}
        //       onClick={() => removeVariant(i)}
        //     >
        //       -
        //     </button>
        //   )}
        //   {outputInputVariantValue}
        // </div>
        <ProductVariantComponent
            variantName={`Variação ${i + 1}`}
            inputValue={variant[i].name}
            inputChangeValue={handleVariant}
        >
            {outputInputVariantValue}
        </ProductVariantComponent>
      );
    }


    return (
        <form>
            {outputInputVariant}
        </form>
    );
};


interface propsProductVariantComponent {
    children: React.ReactNode,
    variantName: string,
    inputChangeValue: ChangeEventHandler,
    inputValue: string
}

const ProductVariantComponent: React.FC<propsProductVariantComponent> = ({
    children,
    variantName,
    inputChangeValue,
    inputValue
}) => {
    const [mostrarVariacoes, setMostrarVariacoes] = useState(false)

    const handleClick = () => {
        setMostrarVariacoes(!mostrarVariacoes)
      };

    return (
        <div className="flex justify-start items-start">
            <div className="flex min-h-10 items-center justify-end mr-4">
                <span>Variações</span>
            </div>
            {!mostrarVariacoes && (
                <button 
                    onClick={handleClick}
                    className="px-4 py-2 rounded border-dashed border border-gray-500 text-gray-700"
                >
                    + Habilitar variações
                </button>
            )}
            {mostrarVariacoes && (
            <div>
                <div className="p-4 bg-zinc-100 relative">
                    <span 
                        onClick={handleClick}
                        className="absolute right-4 top-6 p-0.5 cursor-pointer"
                    >
                        <X size={18} />
                    </span>
                    
                    <div className="flex items-start">
                        <div className="flex w-[72px] mr-4 min-h-8 justify-end items-center text-sm">{variantName}</div>
                        <div className="flex">
                            <Input 
                                // value={inputValue}
                                onChange={inputChangeValue}
                                className="h-full w-40" 
                            />
                        </div>
                    </div>

                    <div className="flex items-start mt-4">
                        <div className="flex w-[72px] mr-4 min-h-8 justify-end items-center text-sm">Opções</div>
                        <div className="flex flex-1">
                            <div className="grid grid-cols-3 gap-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-zinc-100 relative">
                    <div className="flex items-start">
                        <div className="flex w-[72px] mr-4 min-h-8 justify-end items-center text-sm">Variação 2</div>
                        <button 
                            onClick={handleClick}
                            className="px-2 py-1.5 font-bold text-sm rounded border-dashed border border-gray-500 text-gray-500"
                        >
                            + Adicionar variação 2
                        </button>
                        {/* <div className="flex">
                            <Input 
                                // value={inputValue}
                                onChange={inputChangeValue}
                                className="h-full w-40" 
                            />
                        </div> */}
                    </div>
                    {/* <span 
                        onClick={handleClick}
                        className="absolute right-4 top-6 p-0.5 cursor-pointer"
                    >
                        <X size={18} />
                    </span>

                    <div className="flex items-start">
                        <div className="flex w-[72px] mr-4 min-h-8 justify-end items-center text-sm">{variantName}</div>
                        <div className="flex">
                            <Input 
                                // value={inputValue}
                                onChange={inputChangeValue}
                                className="h-full w-40" 
                            />
                        </div>
                    </div>

                    <div className="flex items-start mt-4">
                        <div className="flex w-[72px] mr-4 min-h-8 justify-end items-center text-sm">Opções</div>
                        <div className="flex flex-1">
                            <div className="grid grid-cols-3 gap-4">
                                {children}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            )}
        </div>
    )
}