import { NextResponse } from "next/server";
import { adminAuth } from "../../../lib/firebaseAdmin";

export async function GET() {
  if (!adminAuth) {
    return NextResponse.json({ error: "Admin Auth not initialized" }, { status: 500 });
  }
  try {
    const listUsersResult = await adminAuth.listUsers();
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      creationTime: user.metadata.creationTime,
      role: user.customClaims?.role || "super_admin",
    }));
    return NextResponse.json({ users });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!adminAuth) {
    return NextResponse.json({ error: "Admin Auth not initialized" }, { status: 500 });
  }
  try {
    const { email, password, role } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    });
    
    // Set custom claims for role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: role || "super_admin" });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!adminAuth) {
    return NextResponse.json({ error: "Admin Auth not initialized" }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }
    await adminAuth.deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
