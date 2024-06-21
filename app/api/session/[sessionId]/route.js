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
    const populatedSession = await session.populate(["student", "staff"]);
    // return new Response(JSON.stringify(session), { status: 200 })
    return new Response(
      JSON.stringify({
        session: session,
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
  const updates = await request.json();

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return new Response("Session not found", { status: 404 });
    }

    // Dynamically update fields based on the updates object
    Object.keys(updates).forEach(key => {
      session[key] = updates[key];
    });

    await session.save();
    return new Response(JSON.stringify(session), { status: 200 });
  } catch (error) {
    console.error("Error updating session:", error);
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

