import { connectToDatabase } from '@/app/lib/db';
import { ObjectId, Filter } from 'mongodb';
import { NextResponse } from 'next/server';
import { Order } from '@/app/lib/models';

function buildIdFilter(id: string): Filter<Order> {
  const filter =
    ObjectId.isValid(id) && id.length === 24
      ? { $or: [{ _id: new ObjectId(id) }, { orderId: id }] }
      : { orderId: id };
  return filter as unknown as Filter<Order>;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const { id } = await params;

    const order = await ordersCollection.findOne(buildIdFilter(id));

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const { id } = await params;
    const body = await req.json();

    const updatedOrder = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await ordersCollection.updateOne(buildIdFilter(id), { $set: updatedOrder });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Order updated', data: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const { id } = await params;

    const result = await ordersCollection.deleteOne(buildIdFilter(id));

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to delete order' },
      { status: 500 }
    );
  }
}
