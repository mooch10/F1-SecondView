---
name: f1-data-sources
description: Guide and patterns for integrating Formula 1 data sources (OpenF1 API and Jolpica F1 API) in Node.js backend and React frontend. Covers endpoints, caching, rate limiting, and TypeScript models.
---

# F1 Data Sources Integration (OpenF1 & Jolpica F1)

This skill provides guidelines and patterns for querying and caching Formula 1 data in the F1 Second-Screen Platform.

## 1. Primary Sources Overview

| Provider | Base URL | Primary Use Case | Status / Notes |
| :--- | :--- | :--- | :--- |
| **OpenF1** | `https://api.openf1.org/v1` | Real-time telemetry, lap times, intervals, car data, radio, sessions | Modern, free, community-driven, active |
| **Jolpica F1** | `https://api.jolpica.com/ergast/f1` | Historical data, seasons, schedules, standings, circuits, drivers | Drop-in Ergast API successor (active since Ergast decommission in 2024) |

---

## 2. Jolpica F1 (Schedule, Drivers, Standings)

Jolpica maintains backward compatibility with the Ergast API structure.

### Key Endpoints:
* **Current Season Schedule**: `GET /current.json`
* **Driver Standings**: `GET /current/driverStandings.json`
* **Constructor Standings**: `GET /current/constructorStandings.json`
* **Drivers List**: `GET /current/drivers.json`
* **Race Results**: `GET /current/{round}/results.json`
* **Qualifying Results**: `GET /current/{round}/qualifying.json`

### Caching Pattern:
Historical and schedule data changes infrequently.
* **TTL**: Cache season schedules and past race results for **6 to 24 hours** in Node.js backend (memory or Redis).
* Avoid spamming Jolpica for static data on every frontend request.

---

## 3. OpenF1 (Live & Detailed Session Data)

OpenF1 exposes detailed telemetry and race state.

### Key Endpoints:
* **Sessions**: `GET /sessions?year=2024` or `GET /sessions?session_key=latest`
* **Drivers in Session**: `GET /drivers?session_key={session_key}`
* **Intervals / Gaps**: `GET /intervals?session_key={session_key}`
* **Laps**: `GET /laps?session_key={session_key}&driver_number={driver_number}`
* **Car Telemetry**: `GET /car_data?session_key={session_key}&driver_number={driver_number}` (speed, rpm, gear, throttle, brake, drs)
* **Position / Track Order**: `GET /position?session_key={session_key}`
* **Race Control & Flags**: `GET /race_control?session_key={session_key}`

### Telemetry Best Practices:
* **Never fetch raw high-frequency telemetry directly from React client.** Route requests through the Node.js backend proxy.
* **Aggregation**: Normalize and downsample high-frequency data (like speed/throttle traces) before sending to frontend.
* **Polling interval**: 2–5 seconds during live sessions, or use SSE (Server-Sent Events) / WebSockets from Node backend.

---

## 4. Architecture Contract

```
[OpenF1 / Jolpica APIs]
          │
          ▼
┌─────────────────────────┐
│ Node.js Backend Proxy   │
│  - In-memory / Redis    │
│  - Data Sanitization    │
│  - Strong TS Interfaces │
└─────────────────────────┘
          │ (Clean REST / SSE)
          ▼
┌─────────────────────────┐
│ Vite + React + Tailwind │
│  - TanStack Query / Hook│
│  - No unused API fields │
│  - Real-time Dashboard  │
└─────────────────────────┘
```

## 5. Anti-Junk Code Rules for Data Fetching

1. **Strict Types**: Always define explicit TypeScript interfaces for the transformed data payloads; avoid `any`.
2. **Selective Picking**: Strip unused third-party payload fields in the backend before forwarding to the client.
3. **Fallback & Graceful Degradation**: Always handle API downtime or off-season states gracefully with empty states or cached fixtures.
