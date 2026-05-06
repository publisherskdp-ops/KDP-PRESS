import dbConnect from "@/lib/mongodb"; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();

    return Response.json({
      success: true,
      message: "MongoDB connected ✅",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: "MongoDB failed ❌",
    });
  }
}