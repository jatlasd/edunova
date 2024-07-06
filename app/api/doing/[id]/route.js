import { connectToDB } from "@lib/database";
import Doing from "@models/doing";

export const PATCH = async ( request, { params }) => {
    await connectToDB();
    const { id } = params;
    const { text } = await request.json();
    try {
        const doing = await Doing.findById(id);
        doing.text = text;
        await doing.save();
        return new Response(JSON.stringify(doing), { status: 200 });
    } catch (error) {
        return new Response("Failed to update doing", { status: 500 });
    }
}