import { connectToDB } from "@/lib/database";
import Student from "@/models/student";

export const GET = async (request, { params }) => {
  await connectToDB();

  const { studentId } = params;

  try {
    const populatedStudent =
      await Student.findById(studentId).populate("behaviors");

    if (!populatedStudent) {
      return new Response("Student not found", { status: 404 });
    }

    console.log("Populated student:", populatedStudent);

    return new Response(JSON.stringify(populatedStudent.behaviors), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching student:", error.message, error.stack);
    return new Response("Failed to fetch student", { status: 500 });
  }
};
