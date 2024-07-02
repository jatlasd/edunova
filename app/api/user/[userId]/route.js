import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import Student from "@/models/student";
import Session from "@/models/session";

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
    
    const populated = await user.populate(['students',{
      path: "sessions",
      populate: {
        path: "student",
        select: "name"
      }
    }]);
    return new Response(JSON.stringify(populated), { status: 200 });


  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch user", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  await connectToDB();
  const { userId } = params;
  const updates = await request.json();

  console.log("Received updates:", JSON.stringify(updates, null, 2)); 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) { 
        if (key === 'quickNotes') {
          console.log("Updating quickNotes:", JSON.stringify(updates[key], null, 2));
        }
        user[key] = updates[key];
      }
    });

    await user.save();
    console.log("User updated successfully");
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return new Response("Failed to update user", { status: 500 });
  }
}

export const DELETE = async (request, {params}) => {
  await connectToDB();

  const { userId } = params;

  try {
    const user = await User.findById(userId);
    await user.deleteOne()
    return new Response("User deleted", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete user", { status: 500 });
  }
}