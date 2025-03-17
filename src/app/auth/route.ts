import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.password !== password) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user });
}
