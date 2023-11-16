"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-10 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-6 md:p-14">
            <span className="mb-3 text-4xl font-bold">Daftar</span>
            <span className="font-medium text-gray-400 mb-8">
                Masukkan Username dan Password !
            </span>
            <form onSubmit={handleSubmit}>
                <div className="py-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Email</Label>
                        <Input
                            type="name"
                            placeholder="Masukkan Email"
                        />
                    </div>
                </div>
                <div className="py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                         
                            type="password"
            
                            placeholder="Password"
                        />
                    </div>
                </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Register
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <Link className="text-sm mt-3 text-right" href={"/"}>
                        Sudah memiliki akun? <span className="font-bold">Login</span>
                    </Link>
            </div>
                    <div className="relative">
                    <Image
                        src="/image/login-page.jpg"
                        alt="login-page"
                        className="w-[500px] h-[800px] hidden rounded-r-2xl md:block object-cover"
                        width={600}
                        height={600}
                    />
              </div>
      </div>
      </div>
    )
  );
};

export default Register;
