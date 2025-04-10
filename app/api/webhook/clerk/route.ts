// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { db } from '@/lib/db';

// export async function POST(req: Request) {
//   // Verify the webhook signature
//   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
//   if (!WEBHOOK_SECRET) {
//     throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
//   }

//   // Get the headers
//   const headerPayload = headers();
//   const svix_id = headerPayload.get('svix-id');
//   const svix_timestamp = headerPayload.get('svix-timestamp');
//   const svix_signature = headerPayload.get('svix-signature');

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error occured -- no svix headers', {
//       status: 400
//     });
//   }

//   // Get the body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   // Create a new Svix instance with your secret
//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt: WebhookEvent;

//   // Verify the payload with the headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error('Error verifying webhook:', err);
//     return new Response('Error occured', {
//       status: 400
//     });
//   }

//   // Handle the webhook
//   const eventType = evt.type;

//   if (eventType === 'user.created') {
//     const { id, email_addresses, image_url } = evt.data;

//     // Create a new user in your database with role "USER"
//     await db.user.create({
//       data: {
//         clerkUserId: id,
//         email: email_addresses[0]?.email_address,
//         image: image_url,
//         role: "USER", // Set default role to USER
//       },
//     });

//     return new Response('User created successfully', { status: 200 });
//   }

//   return new Response('Webhook received', { status: 200 });
// }