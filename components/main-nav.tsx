"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams()

  const base = `/${params.establishmentId}`;

  const routes = [
    { href: `${base}`, label: 'Visão geral', active: pathname === base },
    { href: `${base}/orders`, label: 'Pedidos', active: pathname === `${base}/orders` },
    { href: `${base}/billboards`, label: 'Banners', active: pathname === `${base}/billboards` },
    { href: `${base}/categories`, label: 'Categorias', active: pathname === `${base}/categories` },
    { href: `${base}/products`, label: 'Produtos', active: pathname === `${base}/products` },
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