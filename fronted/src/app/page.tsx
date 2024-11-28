"use client";
import { useState } from "react";

export default function MatchJobs() {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");

  const handleMatchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/match", { // Ensure this matches the FastAPI URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume, // Send the resume text from the state
          jobs: [
            // Dummy job data (replace with real job data from your source)
            { 
              title: "Software Engineer",
              description: "Looking for a software engineer with experience in React and Node.js.",
              requirements: ["JavaScript", "React", "Node.js"]
            },
            { 
              title: "Software Engineer",
              description: "Looking for a software engineer with experience in C# and WPF.",
              requirements: ["C#", "WPF", ".NET"]
            },
            { 
              title: "Data Scientist", 
              description: "Looking for a data scientist skilled in Python and Machine Learning.",
              requirements: ["Python", "Machine Learning"]
            },
            { 
              title: "Full Stack Developer",
              description: "Seeking a full stack developer with expertise in JavaScript and backend technologies.",
              requirements: ["JavaScript", "Node.js", "React"]
            },
            { 
              title: "Backend Developer",
              description: "Looking for a backend developer with experience in Python and SQL.",
              requirements: ["Python", "SQL"]
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data.matched_jobs, null, 2)); // Format matched jobs with indentation
    } catch (error) {
      console.error("Error matching jobs:", error);
    }
  };

  return (
    <div>
      <h2>Job Matcher</h2>
      <textarea
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="Paste your resume here"
      />
      <button onClick={handleMatchJobs}>Match Jobs</button>
      <div>
        <h3>Matched Jobs:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
}
