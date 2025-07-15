// This route is not needed since authentication is handled by NextAuth
// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import bcrypt from "bcryptjs";
// import { cookies } from "next/headers";

export async function POST(req: Request) {
    return new Response("This endpoint is not available. Use NextAuth for authentication.", { status: 404 });
}