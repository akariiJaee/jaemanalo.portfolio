# Portfolio Contact Form Backend

A small Express + Nodemailer API that powers the contact form on your portfolio.
When someone submits the form, it:
1. Emails **you** (manalojesz@gmail.com) the full inquiry
2. Auto-replies to the **client** confirming you got their message

## 1. Get a Gmail App Password (do this first)

Gmail blocks normal-password login from apps. You need an **App Password** instead:

1. Turn on **2-Step Verification** on the Gmail account: https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password (name it e.g. "Portfolio Website")
4. Copy the 16-character code — you'll paste it into `.env` as `GMAIL_APP_PASSWORD`

You can use manalojesz@gmail.com itself as the sender, or create a separate
Gmail account just for sending (e.g. `noreply.jaeportfolio@gmail.com`) and set
`NOTIFY_EMAIL=manalojesz@gmail.com` so replies still land in your main inbox.

## 2. Local setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your real GMAIL_USER, GMAIL_APP_PASSWORD, ALLOWED_ORIGINS
npm start
```

Server runs on `http://localhost:3000`. Test it:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Client","email":"test@example.com","projectType":"video","message":"Testing the contact form, please ignore."}'
```

You should get an email at manalojesz@gmail.com within seconds.

## 3. Deploy the backend (free options)

Your portfolio is static (GitHub Pages), so it can't run this server itself —
you need to host `server.js` somewhere separately. Easiest free options:

- **Render** (recommended, free tier): https://render.com
  - New → Web Service → connect your repo (or upload this `backend/` folder as its own repo)
  - Build command: `npm install`
  - Start command: `npm start`
  - Add the same variables from `.env` under "Environment"
- **Railway**: https://railway.app — similar flow, connect repo, set env vars
- **Fly.io / Cyclic / Vercel (serverless function)** also work if you prefer

Once deployed, you'll get a URL like `https://your-app.onrender.com`.

## 4. Point the frontend at your deployed backend

In `script.js`, update:

```js
const CONTACT_API_URL = 'https://your-app.onrender.com/api/contact';
```

And in `.env` on your host, set:

```
ALLOWED_ORIGINS=https://your-username.github.io,https://jaemanalo.com
```

(use your actual GitHub Pages URL / custom domain — this is what stops
random sites from calling your email API)

## 5. Files in this folder

| File            | Purpose                                      |
|-----------------|-----------------------------------------------|
| `server.js`     | Express app + `/api/contact` route            |
| `package.json`  | Dependencies (express, nodemailer, cors, etc.)|
| `.env.example`  | Template for required environment variables   |
| `.gitignore`    | Keeps `.env` and `node_modules` out of git     |

## Notes

- Gmail's free sending limit is ~500 emails/day — plenty for a portfolio.
- The endpoint is rate-limited to 5 submissions per IP per 15 minutes to stop spam.
- There's a hidden honeypot field (`website`) already wired into the form
  payload — if you ever add a hidden `<input name="website">` to the HTML
  form, real users will leave it blank while most spam bots will fill it in,
  and the backend will silently reject it.
