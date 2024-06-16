import { connectToDB } from "@/lib/database";
import User from "@/models/user";

export const POST = async (request) => {
    const { email, password, firstName, lastName, role } = await request.json();
    try {
        await connectToDB();
        const user = new User({
            email,
            password,
            role,
            name: `${firstName} ${lastName}`
        });
        await user.save();
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        console.error('Error saving user:', error);
        return new Response('Failed to add new user', { status: 500 })
    }
}

export const GET = async (request) => {
    await connectToDB()
    try {
        const users = await User.find()
        return new Response(JSON.stringify(users), { status: 200 })
    } catch (error) {
        return new Response('Failed to fetch users', { status: 500 })
    }
}

