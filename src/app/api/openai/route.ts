"use server";
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});
if (!process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing.');
}

// Dummy jobs data
const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Develop and maintain software applications.",
    experience: 3,
    company: "TechCorp",
    location: "New York, NY",
    requirements: ["JavaScript", "React", "Node.js"],
  },
  {
    id: 2,
    title: "Data Analyst",
    description: "Analyze and interpret complex datasets.",
    experience: 2,
    company: "DataWorks",
    location: "San Francisco, CA",
    requirements: ["Python", "SQL", "Tableau"],
  },
  {
    id: 3,
    title: "Product Manager",
    description: "Lead product development and strategy.",
    experience: 5,
    company: "Innovate Inc.",
    location: "Remote",
    requirements: ["Agile", "Scrum", "Leadership"],
  },
];

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON body
    const { resume } = await req.json();

    // Validate the input
    if (!resume) {
      return NextResponse.json(
        { message: "Resume is required" },
        { status: 400 }
      );
    }

    // Interact with OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "You are a job-matching assistant. Match candidates' resumes with suitable jobs.",
        },
        {
          role: 'user',
          content: `Here is a list of jobs:\n${JSON.stringify(jobs)}\n\nHere is the candidate's resume: ${resume}. Match the candidate to the most suitable jobs and explain why.`,
        },
      ],
      max_tokens: 100,
    });

    const completion = response.choices[0]?.message?.content || 'No response';

    // Return the result
    return NextResponse.json({ result: completion }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error with OpenAI API:', error.message);
      return NextResponse.json(
        { message: 'Internal server error', error: error.message },
        { status: 500 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
