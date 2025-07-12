# Job Importer System — Artha Job Board Assignment

This is a full-stack MERN project to build a scalable job importer system that:
- Pulls jobs from multiple XML-based APIs
- Converts XML to JSON and stores jobs in MongoDB (MongoDB Atlas)
- Uses Redis Cloud + BullMQ for background job processing
- Logs detailed import history
- Displays history and job status in a clean Next.js admin UI

---

## Project Structure

```
job-importer-project/
├── client/              # Frontend (Next.js)
├── server/              # Backend (Express.js with BullMQ, Redis, MongoDB)
├── docs/
│   └── architecture.md  # System design and decisions
└── README.md           # This file
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js (React) |
| **Backend** | Node.js + Express |
| **Queue** | Redis Cloud + BullMQ |
| **Database** | MongoDB Atlas (Cloud) |

---

## Key Features

- ✅ Scheduled job fetching using cron
- ✅ Background queue processing with Redis & BullMQ
- ✅ XML to JSON parsing
- ✅ Job storage and update in MongoDB
- ✅ Import logs with stats (new, updated, failed)
- ✅ Admin UI for import tracking
- ✅ **Bonus**: Real-time updates via SSE

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- Redis Cloud account (30 MB free tier)
- MongoDB Atlas account (free tier)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/job-importer-project.git
cd job-importer-project
```

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 3: Start the Services

Environment files are already included and configured.

Just run the apps:

```bash
# Start backend server (with worker + cron jobs)
cd server
npm run dev

# In a new terminal, start frontend app
cd ../client
npm run dev
```

---

## Redis Cloud (30 MB Limit) Considerations

Using Redis Cloud's free tier (30 MB) can lead to buffer overflow or memory errors if not handled carefully. To avoid that:

### 1. Reduce Queue Payload Size
- **Do NOT** store full job data in the queue
- Only enqueue job IDs or minimal info; fetch full data in the worker

### 2. Use TTL and Cleanup
- Automatically remove completed/failed jobs:
  ```javascript
  removeOnComplete: true
  removeOnFail: 1000 // keep only last 1000 errors
  ```

### 3. Use Limiter and Concurrency Options
- Configure queues to control memory usage:
  - `max`: 100 jobs per minute
  - `concurrency`: 3–5 workers max

### 4. Regular Cleanup
- Use `queue.clean()` or `FLUSHALL` in development (not production) to clear Redis

### 5. Monitor Usage
- Use Redis Cloud dashboard to keep memory below the threshold

---

## API Sources Used

- https://jobicy.com/?feed=job_feed
- https://jobicy.com/?feed=job_feed&job_categories=data-science
- https://www.higheredjobs.com/rss/articleFeed.cfm

XML is converted to JSON before processing.

---

## Import Log Schema

Each import log is stored in `"import_logs"` MongoDB collection:

```json
{
  "timestamp": "2025-07-12T10:00:00Z",
  "totalFetched": 200,
  "totalImported": 198,
  "newJobs": 120,
  "updatedJobs": 78,
  "failedJobs": [
    {
      "jobId": "abc123",
      "reason": "ValidationError: title required"
    }
  ]
}
```

---

## Documentation

Design architecture, component breakdown, and flow diagrams are available at:

📄 [`/docs/architecture.md`](./docs/architecture.md)


---

## Questions?

Open an issue or contact the repository maintainer if needed.
