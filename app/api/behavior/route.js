import { connectToDB } from "@/lib/database";
import Student from "@/models/student";
import Behavior from "@/models/behavior";

export const POST = async (request) => {
  await connectToDB();

  const { student, behavior, description } = await request.json();

  try {
    // Create a new behavior
    const newBehavior = new Behavior({
      behavior,
      description,
    });
    await newBehavior.save();

    // Find the student and add the new behavior's ObjectId to their behaviors array
    console.log("Looking for student with ID:", student); // Added logging
    const foundStudent = await Student.findById(student);
    if (!foundStudent) {
      console.error("Student not found with ID:", student); // Added detailed error logging
      return new Response("Student not found", { status: 404 });
    }

    foundStudent.behaviors.push(newBehavior._id); // Only add the ObjectId
    await foundStudent.save();

    return new Response(JSON.stringify(newBehavior), { status: 200 });
  } catch (error) {
    console.error("Error saving behavior:", error.message, error.stack);
    return new Response("Failed to add behavior", { status: 500 });
  }
};

export const GET = async (request) => {
  await connectToDB();

  try {
    const behaviors = await Behavior.find();
    return new Response(JSON.stringify(behaviors), { status: 200 });
  } catch (error) {
    console.error("Error fetching behaviors:", error.message, error.stack);
    return new Response("Failed to fetch behaviors", { status: 500 });
  }
}
