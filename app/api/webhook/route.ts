import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const queryOrderId = url.searchParams.get("orderId");
  const body = await req.json().catch(() => ({}));
  console.log("Webhook payload:", body);
  const bodyOrderId = body?.orderId || body?.customer_meta?.orderId;
  const orderId = queryOrderId || bodyOrderId;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) {
    return NextResponse.json({ message: "Order not found" });
  }
  order.status = OrderStatus.COMPLETED;
  await prisma.order.update({
    where: { id: orderId },
    data: order,
  });
  // Envoi du mail
  // ce que tu veux
  return NextResponse.json({ message: "Webhook received" });
}
