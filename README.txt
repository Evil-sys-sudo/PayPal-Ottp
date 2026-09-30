BLUEBAST OPTION 2 — FOUR MAIN FILES

Files:
- index.html
- admin.html
- package.json
- server.js

GITHUB + RENDER
1. Create a GitHub repository.
2. Upload these four files to the repository root (not inside a public folder).
3. In Render choose New + > Web Service and connect the repository.
4. Build command: npm install
5. Start command: npm start
6. In Render > Environment, create ADMIN_PASSWORD and set a strong private password.
7. Deploy.

STUDENT PAGE: your Render service URL.
TEACHER DASHBOARD: your Render service URL followed by /admin

LOGO
Open index.html on GitHub. Find:
const LOGO_URL = "";
Put your public image URL between the quotes, save, and redeploy.

STORAGE WARNING
This version saves to a local JSON file. Render's ephemeral filesystem can be cleared on restart or redeploy. Use a database or persistent disk for reliable records.

Use only for classroom exercise numbers that students understand they are submitting. Do not collect passwords, payment details, or one-time verification codes.
