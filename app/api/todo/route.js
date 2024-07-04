import Todo from './path/to/your/Todo/model';
import { connectToDB } from './path/to/your/db/connection';

export const POST = async (request) => {
    try {
        const todoData = await request.json();
        await connectToDB();

        const todo = new Todo(todoData);
        await todo.save();

        return new Response(JSON.stringify(todo), { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return new Response('Failed to create new todo', { status: 500 });
    }
};