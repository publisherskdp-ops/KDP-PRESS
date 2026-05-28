import dbConnect from "@/lib/mongodb"; // adjust path if needed
import Order from "@/models/Order"; // adjust path to your order.ts model file

export async function GET() {
  try {
    await dbConnect();

    // Forces MongoDB to build the empty orders collection and its unique indexes immediately
    await Order.syncIndexes();

    return Response.json({
      success: true,
      message: "Orders collection and unique indexes created successfully with zero data! ✅",
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: "Failed to initialize collection ❌",
      details: error.message,
    });
  }
}