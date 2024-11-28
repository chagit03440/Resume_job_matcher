from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Enable CORS for your frontend app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the Next.js client
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data structure for incoming requests
class Resume(BaseModel):
    resume: str
    jobs: list

# Function to calculate cosine similarity between resume and job description
def calculate_similarity(resume, job_description):
    vectorizer = CountVectorizer().fit_transform([resume, job_description])
    vectors = vectorizer.toarray()
    score = cosine_similarity(vectors)[0, 1]
    return score

# Job matching function that uses cosine similarity
@app.post("/match")
def match_jobs(data: Resume):
    resume_text = data.resume
    jobs = data.jobs

    matched_jobs = []

    # Compare resume with each job's description using cosine similarity
    for job in jobs:
        job_description = job['description']
        similarity_score = calculate_similarity(resume_text, job_description)
        print(f"Job: {job['title']}, Similarity Score: {similarity_score}")  # Log similarity scores

        # If similarity score is above a threshold (e.g., 0.3), consider it a match
        if similarity_score > 0.3:
            matched_jobs.append({
                'job': job,
                'similarity_score': similarity_score
            })

    # Return matched jobs along with similarity scores
    return {"matched_jobs": matched_jobs}
