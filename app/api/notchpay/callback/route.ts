import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { verifyNotchpayPayment } from "@/lib/notchpay";

export const runtime = "nodejs";

/**
 * Extract orderId from our reference format: FZ-{orderId}-{timestamp}
 */
function extractOrderIdFromReference(reference: string | null): string | null {
  if (!reference) return null;

  // Our reference format is: FZ-{orderId}-{timestamp}
  // Example: FZ-cmknx8az70004e62s77wabbkk-1768993793687
  const parts = reference.split("-");
  if (parts.length >= 3 && parts[0] === "FZ") {
    // The orderId is the second part (cuid format)
    return parts[1];
  }

  return null;
}

/**
 * Notchpay redirect callback
 * Called when user is redirected back after payment
 */
export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get("reference");
    const status = url.searchParams.get("status");
    const trxref = url.searchParams.get("trxref");
    const notchpayTrxref = url.searchParams.get("notchpay_trxref");

    // Our custom reference is in trxref or notchpay_trxref
    const ourReference = trxref || notchpayTrxref;

    console.log("Notchpay callback:", { reference, status, trxref, notchpayTrxref });

    // If payment was cancelled or failed
    if (status === "cancelled" || status === "failed") {
      return Response.redirect(`${baseUrl}/payment/cancelled`, 302);
    }

    // Extract orderId from our custom reference
    const orderId = extractOrderIdFromReference(ourReference);
    console.log("Extracted orderId:", orderId);

    // If status is complete and we have orderId, process the payment
    if (status === "complete" && orderId) {
      try {
        // Update order status to completed
        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.COMPLETED },
        });
        console.log(`Order ${orderId} marked as COMPLETED`);
      } catch (dbError) {
        console.error("DB update error (may already be completed):", dbError);
      }

      // Redirect to confirmation page
      return Response.redirect(`${baseUrl}/confirmation?orderId=${orderId}`, 302);
    }

    // If we have orderId but status is not complete, try to verify via API
    if (orderId && reference) {
      try {
        const verification = await verifyNotchpayPayment(reference);
        console.log("Verification result:", verification.transaction?.status);

        if (verification.transaction?.status === "complete") {
          try {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: OrderStatus.COMPLETED },
            });
          } catch (e) {
            // Ignore if already completed
          }
          return Response.redirect(`${baseUrl}/confirmation?orderId=${orderId}`, 302);
        }
      } catch (verifyError) {
        console.error("Verification error:", verifyError);
      }
    }

    // If we still have orderId from URL status=complete, redirect anyway
    if (orderId) {
      return Response.redirect(`${baseUrl}/confirmation?orderId=${orderId}`, 302);
    }

    // No orderId found
    console.error("No orderId could be extracted");
    return Response.redirect(`${baseUrl}/payment/error?type=unknown`, 302);
  } catch (error) {
    console.error("Notchpay callback error:", error);
    return Response.redirect(`${baseUrl}/payment/error?type=unknown`, 302);
  }
}
