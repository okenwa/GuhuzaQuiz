// This route is not needed since authentication is handled by NextAuth
// import db from "@/lib/db";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { cookies } from "next/headers";
// import { useContext } from "react";
// import PlayerContextProvider from "@/app/context/playerContext";

export async function POST(req: Request) {
    return new Response("This endpoint is not available. Use NextAuth for authentication.", { status: 404 });
}