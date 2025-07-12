# Architecture Documentation - Job Importer System (MERN)

## Overview

This system is designed to import job listings from third-party XML APIs, process them using BullMQ queues with Redis, store them in MongoDB, and provide a Next.js frontend admin interface to view import logs in real-time. The application uses the MERN stack (MongoDB, Express, React, Node.js) along with BullMQ and Redis Cloud.

---

## System Design Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           JOB IMPORTER SYSTEM                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EXTERNAL      │    │   EXTERNAL      │    │   EXTERNAL      │
│   XML FEEDS     │    │   XML FEEDS     │    │   XML FEEDS     │
│                 │    │                 │    │                 │
│ • Jobicy.com    │    │ • Jobicy.com    │    │ • HigherEdJobs │
│ • SMM Jobs      │    │ • Seller Jobs   │    │ • Article Feed  │
│ • Full-time     │    │ • France        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND SERVER                                   │
│                           (Node.js + Express)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SCHEDULER LAYER                                  │
│                                                                               │
│  ┌─────────────────┐                                                         │
│  │   node-cron     │  ──→  Runs every hour (0 0 * * * *)                   │
│  │   Scheduler     │                                                         │
│  └─────────────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                    │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │  importJobs.ts  │───▶│  fetchJobs.ts   │───▶│   parseXML.ts   │          │
│  │  (Orchestrator) │    │  (HTTP Client)  │    │  (XML Parser)   │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│           │                                                                   │
│           ▼                                                                   │
│  ┌─────────────────┐                                                         │
│  │   jobQueue.ts   │  ──→  BullMQ Queue ("jobs")                           │
│  └─────────────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WORKER LAYER                                     │
│                                                                               │
│  ┌─────────────────┐                                                         │
│  │   worker.ts     │  ──→  BullMQ Worker (Concurrency: 5)                   │
│  │                 │  ──→  Processes jobs and upserts to MongoDB            │
│  └─────────────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                       │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   MongoDB       │    │   Redis Cloud   │    │   ImportLog     │          │
│  │   Atlas         │    │   (30MB Free)   │    │   Collection    │          │
│  │                 │    │                 │    │                 │          │
│  │ • jobs          │    │ • BullMQ Queue  │    │ • Logs each     │          │
│  │   Collection    │    │ • Job Storage   │    │   feed process  │          │
│  │ • importlogs    │    │ • Temporary     │    │ • Tracks        │          │
│  │   Collection    │    │   Data          │    │   metrics       │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                        │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │  importRoute.ts │    │importController │    │  SSE Stream     │          │
│  │                 │    │.ts              │    │                 │          │
│  │ • /import       │    │ • Manual import │    │ • /import/logs/ │          │
│  │ • /import/logs/ │    │ • SSE endpoint  │    │   stream        │          │
│  │   stream        │    │ • Change streams│    │ • Real-time     │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                         │
│                           (Next.js 14)                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                     │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   page.tsx      │    │ImportLogTable   │    │   AG Grid       │          │
│  │   (Dashboard)   │    │.tsx             │    │   Component     │          │
│  │                 │    │                 │    │                 │          │
│  │ • SSE Client    │    │ • Data Table    │    │ • Sortable      │          │
│  │ • State Mgmt    │    │ • Real-time     │    │ • Filterable    │          │
│  │ • EventSource   │    │   Updates       │    │ • Paginated     │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UI LAYER                                         │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   Tailwind CSS  │    │   Real-time     │    │   Error         │          │
│  │   Styling       │    │   Dashboard     │    │   Visualization │          │
│  │                 │    │                 │    │                 │          │
│  │ • Modern UI     │    │ • Live Updates  │    │ • Failed Jobs   │          │
│  │ • Responsive    │    │ • Auto-refresh  │    │   Highlighted   │          │
│  │ • Clean Design  │    │ • SSE Connection│    │ • Red Indicators│          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cron      │───▶│  Fetch XML  │───▶│ Parse XML   │───▶│ Queue Jobs  │
│ Scheduler   │    │   Feeds     │    │ to JSON     │    │ (BullMQ)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │◀───│  SSE Stream │◀───│ Import Logs │◀───│  Worker     │
│ Dashboard   │    │  (Real-time)│    │ (MongoDB)   │    │ (Process)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Component Interaction

### 1. Scheduled Job Execution
```
Cron Scheduler (hourly)
    ↓
importJobs.ts (orchestrator)
    ↓
fetchJobs.ts (HTTP requests to 9 XML feeds)
    ↓
parseXML.ts (xml2js conversion)
    ↓
jobQueue.ts (BullMQ queue)
```

### 2. Job Processing
```
BullMQ Worker (5 concurrent)
    ↓
Process each job
    ↓
Upsert to MongoDB (jobs collection)
    ↓
Log results to ImportLog collection
```

### 3. Real-time Updates
```
MongoDB Change Streams
    ↓
SSE Controller
    ↓
EventSource (Frontend)
    ↓
AG Grid Table (Real-time display)
```

### Diagram Overview:

* **Cron Scheduler** triggers XML API fetch job every hour
* **Job Queue** (BullMQ with Redis Cloud) queues the job data
* **Worker Service** pulls from queue, processes and upserts to MongoDB
* **Import Log Tracker** logs each feed processing in `import_logs` collection
* **Next.js Admin UI** displays logs via Server-Sent Events (SSE)

---

## Backend Architecture (`/server`)

### Tech Stack

* **Node.js** + **Express.js**
* **MongoDB Atlas** (via Mongoose)
* **Redis Cloud** (with BullMQ)
* **node-cron** (for scheduling)

### Folder Structure

```
/server
├── src/
│   ├── app.ts                    # Express app entrypoint
│   ├── schedulers/
│   │   └── importJobsScheduler.ts # Cron job scheduler
│   ├── services/
│   │   ├── importJobs.ts         # Main import orchestration
│   │   └── fetchJobs.ts          # XML API fetcher
│   ├── queues/
│   │   └── jobQueue.ts           # BullMQ queue setup
│   ├── jobs/
│   │   └── worker.ts             # BullMQ worker
│   ├── models/
│   │   ├── ImportLog.ts          # Import log schema
│   │   └── Job.ts                # Job data schema
│   ├── routes/
│   │   └── importRoute.ts        # API routes
│   ├── controller/
│   │   └── importController.ts   # Route controllers
│   ├── utils/
│   │   └── parseXML.ts           # XML to JSON parser
│   └── config/
│       ├── env.ts                # Environment config
│       └── redis.ts              # Redis connection
```

### Core Flows

#### 1. Scheduled Job Fetcher

* **Cron Schedule**: Runs every hour (`0 0 * * * *`)
* **Multiple Feeds**: Processes 9 different XML job feeds
* **Feed Sources**: Jobicy.com and HigherEdJobs.com
* **Process**: Fetches XML, parses to JSON, queues each job

#### 2. Queue + Worker (BullMQ)

* **Queue Name**: `jobs`
* **Worker Concurrency**: 5 concurrent jobs
* **Job Processing**: Upserts jobs to MongoDB using `link` as unique identifier
* **Error Handling**: Failed jobs are logged in `failedJobs` array

#### 3. Import Log Tracking

* **Per Feed Logging**: Each feed gets its own ImportLog entry
* **Metrics Tracked**:
  * `totalFetched`: Number of jobs from XML
  * `totalImported`: Successfully queued jobs
  * `newJobs`: Currently 0 (not implemented)
  * `updatedJobs`: Currently 0 (not implemented)
  * `failedJobs`: Array of failed job details

#### 4. Real-time Updates (SSE)

* **Endpoint**: `/import/logs/stream`
* **Technology**: Server-Sent Events with MongoDB Change Streams
* **Data Flow**: Streams latest 50 logs + real-time updates

### Data Models

#### Job Schema
```typescript
{
  title: string;
  id: string;
  link: string;           // Unique identifier
  pubDate: string;
  guid: { _: string, $: { isPermaLink: string } };
  description: string;
  "content:encoded": string;
  "media:content": { $: { url: string, medium: string } };
  "job_listing:location": string;
  "job_listing:job_type": string;
  "job_listing:company": string;
}
```

#### ImportLog Schema
```typescript
{
  timestamp: Date;
  feedUrl: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: Array<{ reason: string, raw: any }>;
}
```

### Error Handling

* **Feed Failures**: Individual feed errors don't stop other feeds
* **Job Failures**: Failed jobs are logged with reason and raw data
* **Queue Failures**: BullMQ handles retries and dead letter queues
* **MongoDB**: Upsert operations prevent duplicates

---

## Frontend Architecture (`/client`)

### Tech Stack

* **Next.js 14** (React + App Router)
* **Tailwind CSS** (styling)
* **AG Grid** (data table)
* **Server-Sent Events** (real-time updates)

### Folder Structure

```
/client
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── components/
│       └── ImportLogTable.tsx    # AG Grid table component
```

### Key Features

* **Real-time Dashboard**: Displays import logs as they happen
* **AG Grid Table**: Sortable, filterable, paginated data table
* **SSE Connection**: Maintains persistent connection to backend
* **Error Visualization**: Failed jobs highlighted in red

### API Integration

```typescript
// SSE Connection
const eventSource = new EventSource(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/import/logs/stream`
);
```

---

## Key Implementation Details

### Redis Cloud Free Tier (30MB)

* **Queue Management**: Jobs are processed immediately, not stored long-term
* **Memory Optimization**: Minimal job payloads, no full XML storage
* **Cleanup**: BullMQ handles job cleanup automatically

### MongoDB Atlas

* **Collections**: `jobs` and `importlogs`
* **Indexing**: `link` field used for upsert operations
* **Change Streams**: Real-time updates for SSE

### XML Processing

* **Parser**: `xml2js` with `explicitArray: false`
* **Feed Structure**: RSS format with job-specific fields
* **Error Handling**: Invalid XML feeds are logged as failures

---

## Deployment Strategy

### Recommended Stack

* **Frontend**: Vercel (Next.js optimized)
* **Backend**: Render or Railway
* **MongoDB**: Atlas (free tier sufficient)
* **Redis**: Redis Cloud (30MB free tier)

---

## Current Limitations

* **New/Updated Job Tracking**: Not implemented (both fields are 0)
* **Job Deduplication**: Basic upsert by `link` field
* **Authentication**: No admin authentication
* **Error Recovery**: No retry mechanism for failed feeds
* **Monitoring**: Basic console logging only

---

## Future Improvements

* Implement proper new/updated job counting
* Add job deduplication logic beyond link matching
* Implement authentication for admin panel
* Add dashboard metrics and charts
* Implement job search and filtering
* Add feed management UI
* Implement job export functionality

---

## Assumptions

* XML APIs are stable and return consistent RSS structure
* No authentication required for public job feeds
* Job uniqueness is determined by `link` field
* System runs on single instance (no clustering)
* Redis Cloud 30MB is sufficient for queue operations

---

## Credits

Architecture by Aayush Rana
