"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <button
        onClick={() => signIn("google")}
        disabled={loading}
        style={{
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google logo"
          style={{ width: "20px", height: "20px" }}
        />
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
