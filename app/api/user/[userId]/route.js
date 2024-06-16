import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import Student from "@/models/student";

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
      const populatedUser = await user.populate("students");
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

export const PATCH = async (request, { params }) => {
  await connectToDB();
  const { userId } = params;
  const { name, email, role, password } = await request.json();

  try {
    const user = await User.findById(userId)
    user.name = name;
    user.email = email
    user.role = role
    user.password = password
    
    await user.save();
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Failed to update user", { status: 500 });
  }

}