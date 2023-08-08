import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');


  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || '',
      },
      include: {
        orderItems: true,
      }
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });
  }

  return new NextResponse(null, { status: 200 });
};

// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
// import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     };

//     export async function OPTIONS() {
//     return NextResponse.json({}, { headers: corsHeaders });
//     }

//     export async function POST(
//     req: Request,
//     { params }: { params: { storeId: string } }
//     ) {
//     const { productIds } = await req.json();

//     if (!productIds || productIds.length === 0) {
//         return new NextResponse("Product ids are required", { status: 400 });
//     }

//     const products = await prismadb.product.findMany({
//         where: {
//         id: {
//             in: productIds
//         }
//         }
//     });

//     const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//     products.forEach((product) => {
//         line_items.push({
//         quantity: 1,
//         price_data: {
//             currency: 'USD',
//             product_data: {
//             name: product.name,
//             },
//             unit_amount: product.price.toNumber() * 100
//         }
//         });
//     });

//     const order = await prismadb.order.create({
//         data: {
//         storeId: params.storeId,
//         isPaid: false,
//         orderItems: {
//             create: productIds.map((productId: string) => ({
//             product: {
//                 connect: {
//                 id: productId
//                 }
//             }
//             }))
//         }
//         }
//     });

//   const session = await stripe.checkout.sessions.create({
//     line_items,
//     mode: 'payment',
//     billing_address_collection: 'required',
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//     cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//     metadata: {
//       orderId: order.id
//     },
//   });

//   return NextResponse.json({url: session.url }, {
//     headers: corsHeaders
//   });
// };

// import Stripe from "stripe";

// import { NextResponse } from "next/server";

// import prismadb from "@/lib/prismadb";
// import { stripe } from "@/lib/stripe";
// import { connect } from "http2";


// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
//     "Access-Control-Allow-Headers": "Content-type, Authorization",


// };

// export async function OPTIONS() {
//     return NextResponse.json({}, {headers: corsHeaders})
// };

// export async function POST(
//     req: Request,
//     {params}: {params: {storeId: string}}
// ){
//     const {productIds} = await req.json();

//     if (!productIds || productIds.length === 0) {
//         return new NextResponse("Product ids are required", {status:400})
//     }

//     const products = await prismadb.product.findMany({
//         where: {
//             id:{
//                 in: productIds
//             }
//         }
//     });

//     const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//     products.forEach((product) => {
//         line_items.push({
//             quantity: 1,
//             price_data: { 
//                 currency: "USD",
//                 product_data: {
//                     name: product.name
//                 },
//                 unit_amount: product.price.toNumber()*100
//             }
//         });
//     });

//     const order = await prismadb.order.create({
//         data: {
//             storeId: params.storeId,
//             isPaid: false,
//             orderItems: {
//                 create: productIds.map((productId: string) => {
//                     product: {
//                         connect: { 
//                             id: productId
//                         }
//                     }
//                 })
//             }
//         }
//     });

//     const session = await stripe.checkout.sessions.create({
//         line_items,
//         mode: "payment",
//         billing_address_collection: "required",
//         phone_number_collection: {
//             enabled: true
//         },
//         success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//         cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//         metadata: {
//             orderId: order.id
//         }

//     });
//     return NextResponse.json({url: session.url}, {
//         headers: corsHeaders
//     })
// }