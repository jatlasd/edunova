import Todo from '@models/todo';
import { connectToDB } from '@lib/database';

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

export const GET = async (request) => {
    await connectToDB();
    try {
        const todos = await Todo.find()
        return new Response(JSON.stringify(todos), { status: 200 })
    } catch (error) {
        return new Response('Failed to fetch todos', { status: 500 })
    }
}