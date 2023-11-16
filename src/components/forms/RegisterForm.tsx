'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterForm() {

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!name || !password) {
      setError("Semua form harus di isi.")
      return
    }

    try {

      const resUserExists = await fetch('api/userExists', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      })

      const { user } = await resUserExists.json()

      if (user) {
        setError("User sudah ada.")
        return
      }

      const res = await fetch('api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, password
        })
      })

      if (res.ok) {
        const form = e.target
        form.reset()
        router.push("/")
      } else {
        console.log("Pendaftaran pengguna gagal.")
      }
    } catch (error) {
      console.log("Kesalahan saat pendaftaran: ", error)
    }
  }

  return (
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
                <Label htmlFor="name">Username</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  type="name"
                  id="name"
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <Button>Daftar</Button>
            {error && (
              <div className="bg-red-600 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )
            }
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
    </div >
  )
}
