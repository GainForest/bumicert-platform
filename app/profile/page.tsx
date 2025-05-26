"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("token", token);
    axios
      .get("http://localhost:8000/api/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch projects");
        console.log("error", err);
        setLoading(false);
      });
  }, []);

  const hasNoProjects =
    !loading && !error && (projects == null || (Array.isArray(projects) && projects.length === 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <p className="mt-2 text-muted-foreground">This is your profile.</p>
      <div className="mt-6 w-full max-w-lg">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {hasNoProjects && <p className="text-muted-foreground">not part of any projects</p>}
        {projects && Array.isArray(projects) && projects.length > 0 && (
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{JSON.stringify(projects, null, 2)}</pre>
        )}
      </div>
    </div>
  );
} 