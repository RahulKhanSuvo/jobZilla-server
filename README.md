<div align="center">

![JobZilla Banner](./banner.png)

# JobZilla — Backend

**Express 5 · Prisma 7 · PostgreSQL · TypeScript 5.9**

[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📦 Tech Stack

| Library | Version | Role |
|---|---|---|
| **Express** | 5 | HTTP framework |
| **TypeScript** | 5.9 | Type safety |
| **Prisma** | 7 | ORM & database migrations |
| **@prisma/adapter-pg** | 7 | Native pg driver adapter |
| **pg** | 8 | PostgreSQL client |
| **Zod** | 4 | Request body & schema validation |
| **jsonwebtoken** | 9 | JWT generation & verification |
| **bcrypt** | 6 | Password hashing |
| **Multer** | 2 | Multipart file upload handling |
| **Cloudinary** | 2 | Cloud image & file storage |
| **cookie-parser** | 1 | HTTP cookie reading |
| **cors** | 2 | Cross-origin resource sharing |
| **dotenv** | 17 | Environment variable loading |
| **axios** | 1 | Internal HTTP client |
| **tsx** | 4 | TypeScript execution for dev |

---

## 📁 Folder Structure

```
Server/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma        # datasource, generator, User, AppStatus
│   │   ├── candidate.prisma     # Candidate, Resume, workExperience, skill, eduction
│   │   └── company.prisma       # Company, Job, Application, SavedJob
│   └── migrations/              # Auto-generated SQL migrations
│
└── src/
    ├── server.ts                # Entry point
    ├── app.ts                   # Express app setup + middleware
    ├── config/                  # Environment & Prisma client config
    ├── routes/
    │   └── index.ts             # Central route registry
    ├── modules/
    │   ├── user/                # Auth: register, login, logout
    │   ├── candidate/           # Profile, skills, experience, education
    │   ├── recruiter/           # Company profile management
    │   ├── jobs/                # Job CRUD & search
    │   └── application/         # Job applications & status updates
    ├── middleware/
    │   ├── auth.ts              # JWT verify middleware
    │   ├── FromParse.ts         # Multipart body parsing
    │   └── ...
    ├── lib/                     # Shared library instances (Cloudinary, etc.)
    ├── errors/                  # Custom error classes
    ├── shared/                  # Shared DTOs & constants
    ├── types/                   # Global TypeScript types
    └── utils/                   # Pure utility functions
```

---

## 🗄️ Database Modal Diagram

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email
        UserRole role
        String password
        Int views
        DateTime createdAt
        DateTime updatedAt
    }

    Candidate {
        String id PK
        String userId FK
        String phone
        String location
        DateTime dob
        String gender
        String maritalStatus
        String aboutMe
        String avatar
        String facebook
        String linkedin
        String github
        String preferredCategory
        String preferredJobType
        String preferredCareerLevel
        Int expectedSalaryMin
        Int expectedSalaryMax
        Boolean availabilityStatus
        Int experienceYears
    }

    Company {
        String id PK
        String userId FK
        String description
        String website
        String industry
        String phone
        String location
        String companySize
        String logo
        String foundedDate
        String coverImage
        String facebook
        String linkedin
        String twitter
        String address
        Boolean showProfile
        DateTime createdAt
        DateTime updatedAt
    }

    Job {
        String id PK
        String title
        String description
        String category
        String gender
        String salaryType
        Int salaryMin
        Int salaryMax
        Int totalApplications
        JobStatus status
        JobType jobType
        LocationType locationType
        String location
        String experience
        CareerLevel careerLevel
        String qualification
        Int views
        DateTime deadline
        String companyId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Application {
        String id PK
        String userId FK
        String jobId FK
        String resumeId FK
        AppStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    SavedJob {
        String id PK
        String userId FK
        String jobId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Resume {
        String id PK
        String title
        String fileUrl
        Boolean isPrimary
        Boolean isDraft
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    WorkExperience {
        String id PK
        String userId FK
        String jobTitle
        String companyName
        String industry
        DateTime startData
        DateTime endData
        String Description
        Boolean isWorking
        DateTime createdAt
        DateTime updatedAt
    }

    Eduction {
        String id PK
        String userId FK
        String institution
        String major
        String field
        DateTime startData
        DateTime endData
        Boolean isStudying
        DateTime createdId
    }

    Skill {
        String id PK
        String userId FK
        String skill
    }

    Language {
        String id PK
        String userId FK
        String language
    }

    UserSettings {
        String id PK
        String userId FK
        String theme
        String language
        String timezone
        String privacy
        Boolean openToWork
        Boolean twoFactorAuthentication
        Boolean emailVerified
        Boolean phoneVerified
        DateTime createdAt
        DateTime updatedAt
    }

    NotificationSettings {
        String id PK
        String userSettingsId FK
        Boolean emailNotification
        Boolean pushNotification
        Boolean inAppNotification
        DateTime createdAt
        DateTime updatedAt
    }

    Conversation {
        String id PK
        String participantA FK
        String participantB FK
        DateTime createdAt
        DateTime updatedAt
    }

    Message {
        String id PK
        String conversationId FK
        String senderId FK
        String content
        Boolean isRead
        DateTime createdAt
        DateTime updatedAt
    }

    Notification {
        String id PK
        String userId FK
        NotificationType type
        String title
        String message
        Boolean isRead
        String link
        DateTime createdAt
        DateTime updatedAt
    }

    CandidateViews {
        String id PK
        String userId FK
        String companyId FK
        DateTime createdAt
        DateTime updatedAt
    }

    JobView {
        String id PK
        String jobId FK
        String userId FK
        String anonymousId
        DateTime createdAt
        DateTime updatedAt
    }

    Follow {
        String id PK
        String followerId FK
        String followingId FK
        DateTime createdAt
    }

    User ||--o| Candidate : "has"
    User ||--o| Company : "owns"
    User ||--o| UserSettings : "configures"
    User ||--o{ Application : "submits"
    User ||--o{ SavedJob : "saves"
    User ||--o{ Resume : "uploads"
    User ||--o{ WorkExperience : "has"
    User ||--o{ Eduction : "has"
    User ||--o{ Skill : "has"
    User ||--o{ Language : "has"
    User ||--o{ Notification : "receives"
    User ||--o{ Job : "posts / jobs owned"
    User ||--o{ Conversation : "participates"
    User ||--o{ Message : "sends"
    User ||--o{ CandidateViews : "views / is viewed"
    User ||--o{ JobView : "views"
    User ||--o{ Follow : "follows / is followed"
    
    UserSettings ||--o{ NotificationSettings : "has"
    Job ||--o{ Application : "receives"
    Job ||--o{ SavedJob : "is saved"
    Job ||--o{ JobView : "is viewed"
    Resume ||--o{ Application : "attached to"
    Conversation ||--o{ Message : "contains"
```

---

## 🔑 Enums

| Enum | Values |
|---|---|
| `UserRole` | `CANDIDATE` · `EMPLOYER` · `ADMIN` |
| `AppStatus` | `PENDING` · `SHORTLISTED` · `REJECTED` · `HIRED` |
| `JobType` | `FULL_TIME` · `PART_TIME` · `CONTRACT` · `INTERN` · `FREELANCE` |
| `JobStatus` | `OPEN` · `CLOSED` · `PUBLISHED` |
| `CareerLevel` | `ENTRY_LEVEL` · `MID_LEVEL` · `SENIOR_LEVEL` · `EXECUTIVE_LEVEL` |
| `LocationType`| `REMOTE` · `ON_SITE` · `HYBRID` |
| `NotificationType`| `APPLICATION` · `MESSAGE` · `ALERT` · `INTERVIEW` · `SUCCESS` |

---

## 🛣️ API Modules

| Module | Base Path | Responsibility |
|---|---|---|
| `user` | `/api/auth` | Register, login, logout, session |
| `candidate` | `/api/candidate` | Profile, experience, education, skills |
| `recruiter` | `/api/recruiter` | Company profile management |
| `jobs` | `/api/jobs` | Post, fetch, search, close jobs |
| `application` | `/api/application` | Apply, view applications, update status |
| `chat` | `/api/chat` | Real-time messaging and conversations |
| `notification` | `/api/notification` | In-app user notifications and alerts |
| `saveJobs` | `/api/saveJobs` | Manage saved jobs for candidates |
| `FollowCompany`| `/api/follow` | Company following mechanism |
| `stats` | `/api/stats` | Application and platform usage statistics |

---

## 🔐 Authentication Flow

```
Client                            Server
  │                                  │
  │──── POST /api/auth/register ───▶ │  bcrypt.hash(password)
  │                                  │  prisma.user.create()
  │◀─── Set-Cookie: token ────────── │  jwt.sign() → HTTP-only cookie
  │                                  │
  │──── POST /api/auth/login ──────▶ │  bcrypt.compare()
  │◀─── Set-Cookie: token ────────── │  jwt.sign() → HTTP-only cookie
  │                                  │
  │──── GET /api/... ──────────────▶ │  authMiddleware → jwt.verify()
  │◀─── Protected resource ───────── │  req.user populated
```

---

## ⚙️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.1 **or** Node.js >= 20
- **PostgreSQL** >= 15 running locally or via cloud

### Install dependencies

```bash
bun install
```

### Environment Variables

Create a `.env` file in the `Server/` folder:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobzilla"
JWT_SECRET="your-super-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Run database migrations

```bash
bunx prisma migrate dev --name init
```

### Generate Prisma client

```bash
bunx prisma generate
```

### Start the dev server

```bash
bun run dev
```

API is available at **http://localhost:5000**

---

## 📐 Code Quality

- **ESLint** — TypeScript-aware linting (`typescript-eslint`)
- **Prettier** — Auto-formatting on staged files
- **Husky + lint-staged** — Pre-commit hooks enforce lint + format
- **CommitLint** — Enforces [Conventional Commits](https://www.conventionalcommits.org/)

---

<div align="center">

Made with ❤️ using **Express 5** + **Prisma 7** + **PostgreSQL**

</div>
