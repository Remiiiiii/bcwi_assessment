import { auth } from "@/app/auth";
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
