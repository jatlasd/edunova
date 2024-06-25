import { connectToDB } from "@/lib/database";
import Student from "@/models/student";
import Behavior from "@/models/behavior";
import Session from "@models/session";
import User from "@models/user";

export const GET = async (request, { params }) => {
  await connectToDB();

  const { studentId } = params;

  try {
    const student = await Student.findById(studentId)
    const populatedStudent =
      await student.populate(["behaviors", "sessions", "users"]);

    if (!populatedStudent) {
      return new Response("Student not found", { status: 404 });
    }

return new Response(JSON.stringify({
  student: student,
  behaviors: populatedStudent.behaviors,
  sessions: populatedStudent.sessions,
  staff: populatedStudent.users,
}), {
  status: 200,
});
  } catch (error) {
    console.error("Error fetching student:", error.message, error.stack);
    return new Response("Failed to fetch student", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  await connectToDB();

  const { studentId } = params;
  const { name, age, grade, user } = await request.json();

  try {
    const student = await Student.findById(studentId);
    student.name = name;
    student.age = age;
    student.grade = grade;
    student.users = user;
    await student.save()
    return new Response(JSON.stringify(student), { status: 200 });
  } catch (error) {
    return new Response("Failed to update student", { status: 500 });
  }
}
