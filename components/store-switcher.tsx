"use client"

import * as React from "react"
import { Store } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

export default function StoreSwitcher({ className }: PopoverTriggerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-label="Selecione a loja"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          Clube de diretores
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};