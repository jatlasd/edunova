import Session from "@models/session";
import { connectToDB } from "@lib/database";
import User from "@models/user";
import Student from "@models/student";
import Behavior from "@models/behavior";

export const POST = async (request) => {
    const { name, student, createdDate, finishedDate, status, staff, behaviors } = await request.json();
    try {
        await connectToDB();
        const session = new Session({
            name,
            student,
            createdDate,
            finishedDate,
            status,
            staff,
            behaviors,
        });
        await session.save();
        const studentDoc = await Student.findById(student);
        if (studentDoc) {
            studentDoc.sessions.push(session._id);
            await studentDoc.save();
        }
        return new Response(JSON.stringify(session), { status: 200 });
    } catch (error) {
        console.error("Error occurred:", error);  
        return new Response(JSON.stringify({ message: "Failed to create session", error: error.toString() }), { status: 500 });
    }
}