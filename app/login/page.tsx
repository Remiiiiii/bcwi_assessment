"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    console.log(
      "Calling signOut({ redirect: false }) and then manually redirecting..."
    );
    signOut({ redirect: false })
      .then(() => {
        console.log(
          "signOut({ redirect: false }) promise resolved (or was not awaited). Redirecting now."
        );
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error from signOut promise (if any):", error);
        console.log(
          "Attempting redirect to '/' despite potential signOut promise error."
        );
        window.location.href = "/";
      });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Welcome, {session.user?.name || session.user?.email}</h1>
        <p>You are signed in!</p>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="User avatar"
            style={{
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              margin: "10px 0",
            }}
          />
        )}
        <button
          onClick={handleSignOut}
          style={{
            padding: "10px 15px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1>Sign In</h1>
      <p>You are not signed in.</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => signIn("google")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
