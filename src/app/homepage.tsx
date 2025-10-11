"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logger } from "../lib/logger";

export default function Homepage() {
  const router = useRouter();

  useEffect(() => {
    logger.info("Homepage redirecting to fuel form", {
      component: "HomePage",
    });

    // Redirect directly to the fuel form
    router.replace("/form?name=fuel");
  }, [router]);

  // Show a simple loading message while redirecting
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      {/* Loading fuel form... */}
    </div>
  );
}
