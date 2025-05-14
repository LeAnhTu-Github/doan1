🚀 Key Features

🧑‍💻 Online Coding Environment
Powered by Monaco Editor (VS Code experience in the browser)

Real-time code execution via Judge0 (self-hosted with Docker)

Supports multiple programming languages

Test case support (visible and hidden) for each coding problem

Instant feedback on submission results (output, status, error, etc.)

📚 Course Management
Browse and filter available courses

Track course progress

Mark chapters as completed or incomplete

Rich text editor for creating course/chapter content

Upload thumbnails, attachments, and videos

👨‍🏫 Teacher Mode
Create new courses and chapters

Reorder chapters easily via drag & drop

Manage coding problems and test cases

Analytics and student performance tracking (coming soon)

🧑‍🎓 Student Dashboard
View enrolled courses and chapter progress

Access coding problems and submit solutions

Track achievements and completion stats

🔒 Authentication
Built with NextAuth.js

Supports credentials, GitHub, Google, and more

Session-based user access (students vs. teachers)

🧰 Tech Stack
Frontend: Next.js 13 (App Router), React 18, Tailwind CSS, Framer Motion

Editor: Monaco Editor

Code Execution: Judge0 (Docker-based, self-hosted)

Authentication: NextAuth.js

Database: MongoDB (via Prisma)

File Upload: UploadThing

Video Streaming: Mux (upload + HLS playback)

State Management: Zustand

UI Libraries: Radix UI, Lucide, Ant Design, DaisyUI

🛠 Project Scripts
bash
Copy
Edit
npm run dev         # Run in development mode
npm run build       # Build for production
npm run start       # Start production build
npm run lint        # Run linter
🔐 Environment Variables
Create a .env file in the root of your project with the following keys:

env
Copy
Edit
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>"
NEXTAUTH_SECRET="<your_nextauth_secret>"
NEXTAUTH_URL="http://localhost:3000"

# OAuth providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""

# Judge0 Self-hosted
JUDGE0_API_URL="http://localhost:2358"

# Mux
MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""

# UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
🧪 Judge0 Setup (Self-Hosted via Docker)
This project uses a custom Judge0 Docker deployment for secure and scalable code evaluation. Here's a quick setup:

bash
Copy
Edit
git clone https://github.com/judge0/judge0.git
cd judge0
docker compose -f docker-compose.yml up -d
Make sure to update JUDGE0_API_URL in your .env to point to your Docker container (e.g., http://localhost:2358).

📂 Project Structure
bash
Copy
Edit
/app            # Next.js App Router pages and layout
/components     # Reusable UI components
/db             # Prisma schema + MongoDB configuration
/editor         # Monaco editor wrapper + integrations
/actions        # Server actions for authentication, data mutation, etc.
/libs           # Utility functions and config
/hooks          # Custom React hooks
