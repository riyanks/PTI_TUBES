import Image from "next/image";
import Login from "@/app/login/page"
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login />
    </main>
  );
}
