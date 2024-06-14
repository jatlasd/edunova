export const POST = async (request) => {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 }); // Method Not Allowed
  }

  // Clear the session cookie
  const headers = new Headers();
  headers.append('Set-Cookie', 'userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly=true');

  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: headers
  });
};
