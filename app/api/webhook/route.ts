import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus } from "@/lib/generated/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  const orderId = body.orderId;
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
