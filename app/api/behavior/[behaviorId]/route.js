import { connectToDB } from "@/lib/database";
import Behavior from "@/models/behavior";
import Student from "@/models/student";

export const GET = async (request, { params }) => {
    await connectToDB();
    const { behaviorId } = params;

    try {
        const behavior = await Behavior.findById(behaviorId)
        if (!behavior) {
            return new Response('Behavior not found', { status: 404 });
        }
        return new Response(JSON.stringify(behavior), { status: 200 });
    } catch (error) {
        return new Response('Failed to get behavior', { status: 500 });
    }
}

export const DELETE = async (request, { params }) => {
    await connectToDB();
    const { behaviorId } = params;

    try {
        // Find students with this behavior and remove it from their behaviors array
        await Student.updateMany(
            { behaviors: behaviorId },
            { $pull: { behaviors: behaviorId } }
        );

        const behavior = await Behavior.findByIdAndDelete(behaviorId);
        if (!behavior) {
            return new Response('Behavior not found', { status: 404 });
        }
        return new Response('Behavior deleted successfully', { status: 200 });
    } catch (error) {
        return new Response('Failed to delete behavior', { status: 500 });
    }
}