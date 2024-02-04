// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
// import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(req: Request) {
//   const { name, email } = await req.json();

  

//   if (email) {
//     return new NextResponse("Product ids are required", { status: 400 });
//   }

//   const products = await prismadb.product.findMany({
//     where: {
//       id: {
//         in: productIds
//       }
//     }
//   });



//   return NextResponse.json({ url: session.url }, {
//     headers: corsHeaders
//   });
// };
