import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { validateNotchpayWebhook, verifyNotchpayPayment } from "@/lib/notchpay";

export const runtime = "nodejs";

/**
 * Notchpay Webhook Handler
 * Receives payment notifications from Notchpay
 * Configure this URL in your Notchpay dashboard: https://yourdomain.com/api/notchpay/webhook
 */
export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-notch-signature");
    const body = await req.text();

    // Validate webhook signature
    if (!validateNotchpayWebhook(signature, body)) {
      console.error("Invalid Notchpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log("Notchpay webhook payload:", payload);

    const event = payload.event;
    const transaction = payload.data;

    // Handle payment completion
    if (event === "payment.complete" && transaction?.status === "complete") {
      const reference = transaction.reference;
      const orderId = transaction.metadata?.orderId;

      if (!orderId) {
        console.error("No orderId in webhook payload");
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }

      // Verify the transaction to be sure
      const verification = await verifyNotchpayPayment(reference);

      if (verification.transaction?.status === "complete") {
        // Update order status
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (order && order.status !== OrderStatus.COMPLETED) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.COMPLETED },
          });

          console.log(`Order ${orderId} marked as COMPLETED via Notchpay webhook`);

          // TODO: Send confirmation email here
        }
      }
    }

    // Handle payment failure
    if (event === "payment.failed") {
      const orderId = transaction?.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CANCELLED },
        });

        console.log(`Order ${orderId} marked as CANCELLED via Notchpay webhook`);
      }
    }

    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error("Notchpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
