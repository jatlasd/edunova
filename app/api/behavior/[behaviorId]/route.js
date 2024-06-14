import { connectToDB } from "@/lib/database";
import Behavior from "@/models/behavior";

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