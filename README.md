# REIA Motors — Website

Car dealership website for REIA Motors, Aruba. Built with vanilla HTML/CSS/JS, Decap CMS for content management, and deployed on Netlify.

---

## Stack

| Layer | Tool |
|---|---|
| Frontend | HTML, CSS, JavaScript (no frameworks) |
| CMS | Decap CMS (formerly Netlify CMS) |
| Auth | Netlify Identity |
| Hosting | Netlify |
| Repo | GitHub (`Xinamayca/reia-motors`) |

---

## Project Structure

```
/
├── index.html          — Home page
├── browse.html         — Browse all cars
├── car.html            — Car detail page (loads by ?id=)
├── about.html          — About page
├── contact.html        — Contact page
│
├── index.css           — Home page styles
├── browse.css          — Browse page styles
├── car.css             — Car detail styles
├── about.css           — About page styles
├── contact.css         — Contact page styles
├── styles.css          — Shared/legacy styles
│
├── app.js              — Home page JS (featured cars)
├── browse.js           — Browse page JS (filter + render)
├── car.js              — Car detail JS (load car by ID)
│
├── data/
│   └── cars.json       — Car inventory data (managed by CMS)
│
├── uploads/            — Car images uploaded via CMS
│
├── img/                — Static images (logo, hero, etc.)
│
├── admin/
│   ├── index.html      — Decap CMS admin panel
│   ├── config.yml      — CMS field configuration
│   ├── preview.js      — CMS live preview template
│   └── preview.css     — CMS preview styles
│
└── netlify/
    └── functions/
        └── auth.js     — Netlify Identity auth handler
```

---

## How the CMS Works

1. Go to `https://your-site.netlify.app/admin`
2. Log in with Netlify Identity (email + password)
3. Click **Cars List** to manage inventory
4. Each car has: Title, Price, Currency, Body type, Fuel, Transmission, KM, Year, Images (up to 8), Featured toggle, Sold toggle
5. Click **Publish** — changes commit to GitHub and redeploy automatically (takes ~1–2 min)

### Adding a Car
- Click the **+** button in the Cars List
- Fill in all fields
- Upload images (drag and drop)
- Toggle **Featured** to show it on the home page
- Click **Publish**

### Marking a Car as Sold
- Open the car entry
- Toggle **Sold** to on
- Click **Publish**
- The card will show a "Sold" badge and the WhatsApp button will be disabled on the detail page

---

## Deployment

The site is hosted on **Netlify** and deploys automatically on every push to the `main` branch on GitHub.

### Manual deploy
```bash
git add -A
git commit -m "your message"
git push origin main
```
Netlify picks it up automatically — no extra steps.

### Environment
No build step required. The site is plain HTML/CSS/JS served as static files.

---

## Brand

| | Value |
|---|---|
| Purple | `#6B2FFF` |
| Pink | `#FF2D78` |
| Gradient | `linear-gradient(135deg, #6B2FFF, #FF2D78)` |
| Body font | Poppins (300, 400, 500) |
| Heading font | Georgia, serif |
| WhatsApp number | `2975927663` |

---

## Transferring Ownership

### GitHub
1. Go to `https://github.com/Xinamayca/reia-motors/settings`
2. Scroll to **Danger Zone** → **Transfer repository**
3. Enter the new owner's GitHub username

### Netlify
1. Log in to [netlify.com](https://netlify.com)
2. Go to **Site settings** → **General** → **Transfer site**
3. Enter the new owner's Netlify team name
4. They will receive an email to accept

### Netlify Identity (CMS login)
1. In Netlify → **Identity** tab
2. Invite the new owner's email as a user
3. They set their own password via the invite email
4. You can then remove your own user

---

## Contact

**REIA Motors** · Oranjestad, Aruba  
WhatsApp: +297 592 7663
