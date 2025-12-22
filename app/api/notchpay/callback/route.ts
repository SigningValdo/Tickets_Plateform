import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { verifyNotchpayPayment } from "@/lib/notchpay";

export const runtime = "nodejs";

/**
 * Notchpay redirect callback
 * Called when user is redirected back after payment
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  const status = url.searchParams.get("status");
  const trxref = url.searchParams.get("trxref");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Use reference or trxref
  const paymentRef = reference || trxref;

  // If payment was cancelled
  if (status === "cancelled" || status === "failed") {
    return NextResponse.redirect(`${baseUrl}/payment/cancelled`);
  }

  // If no reference, redirect to error
  if (!paymentRef) {
    return NextResponse.redirect(`${baseUrl}/payment/error?type=unknown`);
  }

  try {
    // Verify the transaction with Notchpay
    const verification = await verifyNotchpayPayment(paymentRef);

    if (verification.transaction?.status === "complete") {
      // Extract orderId from metadata
      const orderId = verification.transaction.metadata?.orderId;

      if (orderId) {
        // Update order status to completed
        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.COMPLETED },
        });

        return NextResponse.redirect(`${baseUrl}/confirmation?orderId=${orderId}`);
      }
    }

    // Payment failed or pending
    return NextResponse.redirect(`${baseUrl}/payment/error?type=declined`);
  } catch (error) {
    console.error("Notchpay callback error:", error);
    return NextResponse.redirect(`${baseUrl}/payment/error?type=unknown`);
  }
}
