import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import('@/components/ui/Map'),
  { 
    loading: () => <p>A map is loading</p>,
    ssr: false
  }
)

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
 
  return (

    <div>
      <span className="font-bold text-4xl">Dashboard</span>

      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg">
      <Map />
      </div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
    </div>
  );
};

export default Dashboard;
