import Note from "@models/note";
import { connectToDB } from "@lib/database";

export const PATCH = async (request, { params }) => {
  const { id } = params;
  const updates = await request.json();
  try {
    await connectToDB();
    const note = await Note.findById(id);
    if (!note) {
      return new Response("Note not found", { status: 404 });
    }
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        note[key] = updates[key];
      }
    });
    await note.save();
    return new Response(JSON.stringify(note), { status: 200 });
  } catch (error) {
    return new Response("Failed to update note", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
    const { id } = params;
    try {
        await connectToDB();
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
        return new Response("Note not found", { status: 404 });
        }
        return new Response("Note deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Failed to delete note", { status: 500 });
    }
}
