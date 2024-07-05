import Todo from "@models/todo";
import { connectToDB } from "@lib/database";

export const PATCH = async (request, { params }) => {
    await connectToDB();
    const { id } = params;
    const updates = await request.json();
    try {
        const item = await Todo.findById(id);
        if(!item) {
            return new Response("Item not found", { status: 404 });
        }
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                if (key === 'status') {
                    item[key] = updates[key] === 'completed' ? 'completed' : 'open';
                } else {
                    item[key] = updates[key];
                }
            }
        });
        await item.save();
        return new Response(JSON.stringify(item), { status: 200 });
    } catch (error) {
        return new Response("Failed to update item", { status: 500 });
    }
}

export const DELETE = async (request, { params }) => {
    await connectToDB();
    const { id } = params;
    try {
        const deletedItem = await Todo.findByIdAndDelete(id);
        if(!deletedItem) {
            return new Response("Item not found", { status: 404 });
        }
        return new Response("Item deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Failed to delete item", { status: 500 });
    }
}