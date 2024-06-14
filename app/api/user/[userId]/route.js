import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import Student from "@/models/student"; // Ensure this model is imported

export const GET = async (request, { params }) => {
    await connectToDB();
    const { userId } = params;
    const url = new URL(request.url);
    const includeStudents = url.searchParams.get('includeStudents');

    try {
        let foundUser = User.findById(userId);
        if (includeStudents === 'true') {
            console.log('finding students')
            foundUser = foundUser.populate("students");
        }
        const user = await foundUser;

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch user", { status: 500 });
    }
}