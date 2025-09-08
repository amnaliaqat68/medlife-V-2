
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return Response.json({ user: decoded });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
