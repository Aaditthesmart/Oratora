# Oratora 🎤  
AI-Powered Public Speaking Analysis & Improvement Platform

---

## 1. Problem Statement
Public speaking performance is usually judged subjectively, with limited actionable feedback on delivery aspects such as pauses, pace, silence, and confidence. Most tools focus on speech content rather than *delivery mechanics*, making it difficult for speakers to identify and correct specific issues in real time.

There is a need for a system that not only analyzes delivery but also **actively helps users improve and verifies that improvement**.

---

## 2. Solution Overview
Oratora is a web-based AI platform that analyzes a user’s speech using **audio and webcam input** to evaluate delivery-focused metrics such as:

- Flow Continuity  
- Pause Control  
- Vocal Confidence  
- Visual Confidence  
- Speech Flow Timeline (smooth flow, natural pauses, awkward silences)

Oratora goes beyond analysis by introducing a **closed-loop improvement system** consisting of:
- A **Context-Aware AI Coach**
- **Personalized Practice Tasks**
- **Before vs After performance comparison**

This ensures measurable improvement, not just feedback.

---

## 🌐 Live Deployed Website
The application is deployed and accessible here:

🔗 **https://oratora-ai.vercel.app/**

User can use the live version to:
- Record a speech using microphone and webcam
- View delivery analysis metrics
- Interact with the AI Coach
- Complete personalized practice tasks
- Compare before vs after performance




---
## 3. Simple Architecture Diagram
```
User (Browser)
↓
Audio + Webcam Capture
↓
Frontend (React / Next.js)
↓
Feature Extraction
├─ Audio signals (pauses, silence, pace)
├─ Video signals (eye contact, presence, movement)
↓
AI Analysis Engine
├─ Metric scoring
├─ Speech flow timeline
↓
AI Coach Logic
├─ Weakest metric detection
├─ Context-aware explanation
├─ Practice task assignment
↓
Results Dashboard
├─ Scores
├─ AI Coach feedback
├─ Practice mode
└─ Before vs After comparison
```
---

## 4. Tech Stack

### Frontend
- React / Next.js
- Vite
- TypeScript
- Tailwind CSS
- Shadcn/ui (Radix primitives)
- Web Audio API
- MediaDevices API (Webcam & Mic)

### Backend / Logic
- Node.js
- Client-side ML logic & heuristics
- API-based AI inference
  
### AI Tools
- Google Gemini 3 Flash (context-aware coaching & analysis)
- Lovable AI (UI scaffolding & rapid prototyping)

### Database
- 	PostgreSQL (via Supabase, with RLS policies)
  
### Deployment
- Vercel

---

## 5. AI Tools Used
- Large Language Model (LLM) for **context-aware coaching feedback**
- Audio signal analysis for silence, pauses, pace
- Video frame analysis for visual confidence indicators
- Rule-based + AI hybrid scoring system

---

## 6. Prompt Strategy Summary
The AI Coach uses **strict prompt constraints** to ensure high-quality feedback:

- Reads only delivery metrics (not speech content)
- Identifies the weakest metric
- Explains *why* the issue occurred
- References *where* in the speech it happened
- Generates **one actionable practice task**

Response format enforced:
Issue:
Explanation:
Practice Task:
How This Helps:

No motivational, generic, or content-rewriting responses are allowed.

---

## 7. Setup Instructions (Local)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Webcam & microphone enabled

### Steps
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
npm install
npm run dev

Open browser at:
http://localhost:3000
```
No environment variables are required.
All features run locally in browser using standard Web APIs.

---

## 8. Final Output
The final output is an interactive dashboard that provides:
- Delivery scores
- Speech flow timeline visualization
- Context-aware AI coaching feedback
- Personalized practice tasks
- Before vs After performance comparison

