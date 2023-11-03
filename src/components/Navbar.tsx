"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session }: any = useSession();
  return (
    <div>
      <ul className="flex justify-between m-10 item-center">
        <div className="flex gap-10">
          <Link href="/dashboard">

          </Link>
          {!session ? (
            <>
              <Link href="/login">
                <li>Login</li>
              </Link>
              <Link href="/register">
                <li>Register</li>
              </Link>
            </>
          ) : (
            <>
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold">{session.user?.email}</span>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 max-h text-sm p-2">
                  Logout
                </button>
            </div>
              {/* {session.user?.email}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Logout
                </button>
              </li> */}
            </>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
