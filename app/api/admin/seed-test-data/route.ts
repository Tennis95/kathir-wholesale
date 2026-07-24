import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Verify authorization token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { message: 'Unauthorized. Invalid setup token.' },
        { status: 401 }
      );
    }

    await connectDB();

    // Create test customer
    let testCustomer = await User.findOne({ email: 'customer@test.co.uk' });
    if (!testCustomer) {
      testCustomer = await User.create({
        name: 'Test Customer',
        email: 'customer@test.co.uk',
        password: 'TestPassword123!',
        phone: '+44 123 456 7890',
        address: {
          street: '123 Test Street',
          city: 'London',
          state: 'Greater London',
          zipCode: 'SW1A 1AA',
          country: 'UK',
        },
        role: 'customer',
        isVerified: true,
        isActive: true,
      });
      console.log('✅ Test customer created:', testCustomer.email);
    }

    // Get a product for the test order
    let testProduct = await Product.findOne({});
    if (!testProduct) {
      testProduct = await Product.create({
        id: 'test-product-1',
        name: 'Test Product',
        category: 'Spices',
        size: '500g',
        price: 15.99,
        stock: 100,
        inStock: true,
        description: 'Test product for orders',
        imageUrl: '',
        discount: 0,
        rating: 4.5,
        reviews: [],
      });
      console.log('✅ Test product created:', testProduct.name);
    }

    // Create test orders with different statuses
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const createdOrders = [];

    for (let i = 0; i < orderStatuses.length; i++) {
      const orderNumber = `ORD-TEST-${Date.now()}-${i}`;
      const existingOrder = await Order.findOne({ orderNumber });

      if (!existingOrder) {
        const testOrder = await Order.create({
          orderNumber,
          userId: testCustomer._id,
          items: [
            {
              productId: testProduct._id,
              name: testProduct.name,
              quantity: 2,
              size: testProduct.size,
            },
          ],
          subtotal: testProduct.price * 2,
          tax: testProduct.price * 2 * 0.2,
          shipping: 10,
          total: testProduct.price * 2 + testProduct.price * 2 * 0.2 + 10,
          status: orderStatuses[i] as any,
          paymentStatus: i === 4 ? 'failed' : 'completed',
          paymentMethod: 'Card',
          shippingAddress: testCustomer.address,
          billingAddress: testCustomer.address,
          trackingNumber: i > 1 ? `TRACK-${orderNumber}` : undefined,
          notes: `Test order with ${orderStatuses[i]} status`,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        createdOrders.push({
          orderNumber: testOrder.orderNumber,
          status: testOrder.status,
          total: testOrder.total,
        });
        console.log(`✅ Test order created: ${orderNumber} (${orderStatuses[i]})`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Test data seeded successfully',
        customer: {
          id: testCustomer._id,
          name: testCustomer.name,
          email: testCustomer.email,
        },
        product: {
          id: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
        },
        orders: createdOrders,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error seeding test data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check seeded data
export async function GET(req: NextRequest) {
  try {
    // Verify authorization token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { message: 'Unauthorized. Invalid setup token.' },
        { status: 401 }
      );
    }

    await connectDB();

    const customerCount = await User.countDocuments({ role: 'customer' });
    const productCount = await Product.countDocuments({});
    const orderCount = await Order.countDocuments({});

    return NextResponse.json(
      {
        success: true,
        stats: {
          customers: customerCount,
          products: productCount,
          orders: orderCount,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error fetching stats:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
