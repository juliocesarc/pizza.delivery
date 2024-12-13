import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { 
      name,
      description,
      images, 
      price, 
      stock,
      categories,  
      isFeatured, 
      isArchived 
    } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Nome é necessário", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Imagem é necessário", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Preço é necessário", { status: 400 });
    }

    if (!categories) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        stock,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        categoryItem: {
          createMany: {
            data: categories.map(categorie => ({ categoryId: categorie.value }))
          }
        }
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prismadb.product.findMany({
      where: {
        categoryItem: {
          some: {
            categoryId
          }
        },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        categoryItem: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    console.log(products)

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
