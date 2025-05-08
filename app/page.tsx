import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admindashboard");
  } else {
    redirect("/login");
  }
  return null;
}
