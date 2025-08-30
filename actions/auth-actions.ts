"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  
  redirect("/");
}

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}