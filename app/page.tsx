import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const establishment = await prismadb.establishment.findFirst()

  if (!establishment) {
    redirect("/erro-sem-estabelecimento"); // ou uma página de fallback
  }

  redirect(`/${establishment.id}`);
}

export default HomePage