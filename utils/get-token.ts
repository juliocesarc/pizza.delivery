import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function getAuthToken() {
    const token = (await cookies()).get("token")?.value;
    if (!token) redirect("/sign-in");
    return token;
}