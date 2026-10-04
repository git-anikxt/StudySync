# StudySync — run doc

## Reproduce the artifacts

1. Env files (untracked, copy from the main checkout `C:\Projects\StudySync` — never commit values):
   - `backend\.env` — needs at least: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `MONGODB_URI`, `GEMINI_API_KEY`/`GROQ_API_KEY`, `JWT_SECRET` (legacy, unused).
   - `frontend\.env.local` — needs at least: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register`, `NEXT_PUBLIC_API_BASE_URL`.
2. Install dependencies with npm in both apps:
   - `cd backend && npm install`
   - `cd frontend && npm install`

## Run the servers (Windows, detached)

The sandbox shell pre-sets `PORT=0`; the launch scripts below override it explicitly. Start-Process requires stdout and stderr in DIFFERENT files.

Backend (port 5000):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Projects\StudySync\.freebuff\launch-backend.ps1"
# logs: .freebuff\backend.log / .freebuff\backend.log.err
```

Frontend (port 3000):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Projects\StudySync\.freebuff\launch-frontend.ps1"
# logs: .freebuff\preview-<thread>.log / .freebuff\preview-<thread>.log.err
```

Equivalent manual command (per app):
```powershell
powershell -NoProfile -Command "$env:PORT='3000'; (Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Projects\StudySync\frontend' -RedirectStandardOutput '<out.log>' -RedirectStandardError '<err.log>' -WindowStyle Hidden -PassThru).Id"
```

Notes / gotchas:
- **Next 16 enforces one dev server per project dir.** If you see `⨯ Another next dev server is already running`, `taskkill /PID <pid> /F` the process it names (it prints the PID) and relaunch.
- The dev log shows `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` — expected under Next 16.2.6 with `frontend/src/middleware.ts`; the middleware still runs (logged as `proxy.ts:` in request lines).
- Health checks: `GET http://localhost:5000/` → 200 "StudySync Backend Running"; `GET http://localhost:3000/login` → 200.
- Killing leftovers: `powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Projects\StudySync\.freebuff\kill-dev.ps1"`.
- Stale `.next` cache purge: kill frontend, `rm -rf frontend/.next`, relaunch.
