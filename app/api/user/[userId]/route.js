import { connectToDB } from "@/lib/database";
import User from "@/models/user";

export const GET = async (request, { params }) => {
  await connectToDB();
  const { userId } = params;
  const url = new URL(request.url);
  const includeStudents = url.searchParams.get("includeStudents");

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    
    if (includeStudents === "true") {
      const populatedUser = await User.findById(userId).populate("students");
      return new Response(JSON.stringify(populatedUser.students), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify(user), {
        status: 200,
      });
    }


  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch user", { status: 500 });
  }
};
