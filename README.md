# Customer Data Submission (Phase 1)

A very simple single-page React + Vite app. The user types any customer data
into a textarea and clicks **Submit**. The text is sent as JSON to a
Google Apps Script Web App URL:

```json
{ "data": "the exact text entered by the user" }
```

**Phase 1 is frontend only.** Google Apps Script and Google Sheets come in Phase 2.

Architecture: `Browser -> Google Apps Script Web App -> Google Sheet`.
AWS Amplify only hosts the frontend.

## Project structure

```
.
├── index.html
├── package.json
├── vite.config.js
├── amplify.yml          # Amplify build settings
├── .env.example         # Template for the script URL
└── src/
    ├── main.jsx
    ├── App.jsx          # The whole page
    └── index.css
```

## 1. Install dependencies

Requires Node.js 18 or newer.

```bash
npm install
```

## 2. Run the app locally

Create your env file (a placeholder URL is fine for now):

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

Open the address it prints (usually http://localhost:5173).

With the placeholder URL the request goes nowhere real, so you will normally
still see "Submitted successfully." (see "How the request works" below).
Real delivery only happens after Phase 2.

## 3. Build for production

```bash
npm run build
```

The output is created in the `dist/` folder.

## 4. Deploy with AWS Amplify Hosting

1. Push this project to a GitHub repository (`.env` is git-ignored, so it is not pushed).
2. In the AWS Console, open **AWS Amplify** -> **Create new app** -> **Host web app**.
3. Choose GitHub, select your repository and branch.
4. Amplify detects Vite and uses `amplify.yml` for the build. Keep the defaults.
5. Open **Environment variables** and add:
   - Key: `VITE_GOOGLE_SCRIPT_URL`
   - Value: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec` (placeholder for now)
6. Save and deploy.

Vite reads environment variables at **build time**, so after changing
`VITE_GOOGLE_SCRIPT_URL` in Amplify you must **redeploy** (re-run the build).

## 5. Phase 2 (later)

1. Create the Google Apps Script Web App and Google Sheet.
2. Deploy the script as a Web App (execute as you, access: anyone).
3. Put the real `/exec` URL in `.env` (local) and in the Amplify environment variable.
4. Redeploy.

## How the request works

Google Apps Script does not answer CORS preflight requests. To avoid needing
an AWS backend, the app:

- sends the POST with `Content-Type: text/plain` (a "simple" request, so no preflight)
- uses `mode: "no-cors"`, which means the browser sends the request but the
  response cannot be read

The body is still JSON, so in Phase 2 your script can read it with
`JSON.parse(e.postData.contents)`.

Because the response is unreadable, the app shows "Submission failed" only on
network-level errors (for example, the user is offline). It cannot detect an
error returned by the script itself.
