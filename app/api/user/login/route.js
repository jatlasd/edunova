import { connectToDB } from "@/lib/database";
import User from "@/models/user";
import { serialize } from "cookie";

export const POST = async (req) => {
  await connectToDB();
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const cookie = serialize(
      "userToken",
      JSON.stringify({ id: user._id.toString(), role: user.role }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/",
      },
    );

    const headers = new Headers();
    headers.append("Set-Cookie", cookie);

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          name: user.name,
          id: user._id,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: headers,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 400,
    });
  }
};
