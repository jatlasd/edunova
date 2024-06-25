import Student from "@/models/student";
import { connectToDB } from "@/lib/database";
import User from "@/models/user";

export const POST = async (request) => {
  const { name, age, grade, user } = await request.json();
  try {
    await connectToDB();
    const student = new Student({
        name,
        age,
        grade,
        users: [user],
    });
    await student.save();

    const userDoc = await User.findById(user);
    if (userDoc) {
      userDoc.students.push(student._id);
      await userDoc.save();
    }

    return new Response(JSON.stringify(student), { status: 200 })
  } catch (error) {
    console.error('Error saving student:', error);
    return new Response('Failed to add new student', { status: 500 })
  }
};

export const GET = async (request) => {
    try {
        await connectToDB();
        const students = await Student.find().populate('users');
        return new Response(JSON.stringify(students), { status: 200 })
    } catch (error) {
        return new Response('Failed to get students', { status: 500 })
    }
}
