import { connectToDB } from "@lib/database";
import Doing from "@models/doing";

export const POST = async (request) => {
    const { text } = await request.json();
    try {
        await connectToDB();
        const doing = new Doing({ text });
        await doing.save();
        return new Response(JSON.stringify(doing), { status: 200 })
    } catch (error) {
        console.error('Error saving doing:', error);
        return new Response('Failed to add new doing', { status: 500 })
    }
}

export const GET = async (request) => {
    await connectToDB()
    try {
        const doings = await Doing.find()
        return new Response(JSON.stringify(doings), { status: 200 })
    } catch (error) {
        return new Response('Failed to fetch doings', { status: 500 })
    }
}

export const PATCH = async (request) => {
    const { id } = request.params;
    const { text } = await request.json();
    await connectToDB()
    try {
        const doing = await Doing.findById(id);
        doing.text = text;
        await doing.save();
        return new Response(JSON.stringify(doing), { status: 200 })
    } catch (error) {
        return new Response('Failed to update doing', { status: 500 })
    }
}