"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: 'Visão geral',
      active: pathname === `/`,
    },
    {
      href: `/billboards`,
      label: 'Banners',
      active: pathname === `/billboards`,
    },
    {
      href: `/categories`,
      label: 'Categorias',
      active: pathname === `/categories`,
    },
    {
      href: `/sizes`,
      label: 'Tamanhos',
      active: pathname === `/sizes`,
    },
    {
      href: `/colors`,
      label: 'Cores',
      active: pathname === `/colors`,
    },
    {
      href: `/products`,
      label: 'Produtos',
      active: pathname === `/products`,
    },
    {
      href: `/orders`,
      label: 'Pedidos',
      active: pathname === `/orders`,
    }
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};