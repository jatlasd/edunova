import { connectToDB } from "@lib/database";
import User from "@models/user";
import Student from "@models/student";
import Session from "@models/session";

export const GET = async (request, { params }) => {
  await connectToDB();
  const { sessionId } = params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return new Response("Session not found", { status: 404 });
    }
    const populatedSession = await session.populate("student", "staff");
    return new Response(
      JSON.stringify({
        session: populatedSession,
        student: populatedSession.student,
        staff: populatedSession.staff,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {}
};

export const PATCH = async (request, { params }) => {
  await connectToDB();
  const { sessionId } = params;
  const { studentId, staffId, status, behaviors, notes } = await request.json();

  try {
    const session = await Session.findById(sessionId);
    session.student = studentId;
    session.staff = staffId;
    session.status = status;
    session.behaviors = behaviors;
    if (notes !== undefined) {  
      session.notes = notes;
    }

    await session.save();
    return new Response(JSON.stringify(session), { status: 200 });
  } catch (error) {
    return new Response("Failed to update session", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
    await connectToDB();
    const { sessionId } = params;
    
    try {
        const session = await Session.findById(sessionId);
        if (!session) {
        return new Response("Session not found", { status: 404 });
        }
        await session.deleteOne();
        return new Response(JSON.stringify(session), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete session", { status: 500 });
    }
}
