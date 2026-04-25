# Map Viewer - Deployment Guide

Created three versions of the Map Viewer for different deployment scenarios.

---

## Version Comparison

| Feature | Original | Server Edition | GitHub Pages |
|---------|----------|-----------------|--------------|
| **File Input** | Local file picker | ❌ | ❌ |
| **Server API** | ❌ | ✅ Express.js | ✅ GitHub API |
| **Local Dev** | Open in browser | `npm start` | Open in browser |
| **GitHub Pages** | ❌ | ❌ | ✅ |
| **Deployment** | Desktop only | Railway/Heroku | Automatic with GitHub |
| **Requires Backend** | ❌ | ✅ Node.js | ❌ |
| **Image Source** | Local file system | Server `/maps/` path | raw.githubusercontent.com |

---

## Choose Your Version

### Option 1: Original (MapViewer.html)
**Best for:** Local testing and development

- Single-file HTML application
- Uses browser's file picker to load local maps
- Works offline, no setup needed
- Perfect for desktop use

**How to use:**
```bash
# Just open it in a browser
open tools/MapViewer.html
```

---

### Option 2: Server Edition (MapViewerServer.html + server.js)
**Best for:** Sharing maps, group access, cloud deployment

- Professional server setup
- Maps loaded via REST API
- Can deploy to Railway, Heroku, Vercel, etc.
- Suitable for production use

**Quick start:**
```bash
npm install
MAPSHOTS_DIR=./mapshots npm start
# Visit http://localhost:3000
```

**Deploy to Railway (recommended):**
1. Push code to GitHub
2. Sign up at railway.app
3. Connect your GitHub repo
4. Maps auto-serve from `mapshots/` folder

---

### Option 3: GitHub Pages Edition (MapViewerGitHubPages.html)
**Best for:** GitHub-hosted projects, collaborative sharing

- Completely static - deploys to GitHub Pages
- Loads maps directly from your GitHub repository
- No backend server needed
- Settings saved to browser localStorage

**Setup:**
1. Enable GitHub Pages in repository settings
2. Add map files to a folder (e.g., `mapshots/`)
3. Commit and push to GitHub
4. Access viewer at `https://username.github.io/repo-name/tools/MapViewerGitHubPages.html`

**To use:**
- Open the page
- Enter: `username`, `repo-name`, `main` (branch), `mapshots` (folder)
- Click "Load Maps from GitHub"

---

## Installation & Deployment

### Server Edition Setup

**1. Install dependencies:**
```bash
cd tools
npm install
```

**2. Prepare maps:**
```
hypernet-explorer/
├── mapshots/
│   ├── 0,0.png
│   ├── 54,114.png
│   └── ...
└── tools/
    └── server.js
```

**3. Run locally:**
```bash
npm start
# http://localhost:3000
```

---

### Deploy to Railway (30 seconds)

1. Push code to GitHub
2. Visit https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. **Add environment variable:**
   - Key: `MAPSHOTS_DIR`
   - Value: `mapshots`
6. Deploy - done! 🚀

---

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-map-viewer

# Deploy
git push heroku main

# View live
heroku open
```

---

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

### GitHub Pages (GitHub Edition)

1. Ensure you have a `mapshots/` folder in your repo with map files
2. Go to **Settings** → **Pages**
3. Select `main` branch, `/root` or `/docs` folder
4. Save
5. Maps automatically load from GitHub API when you use the viewer

**URL to your viewer:**
```
https://username.github.io/repo-name/tools/MapViewerGitHubPages.html
```

---

## Map File Format

All versions expect map files named with coordinates:

```
0,0.png              ✓ Correct
54,114.png           ✓ Correct
-10,20.png           ✓ Correct (negative coords)
54, 114.png          ✓ Correct (spaces allowed)

chunk-0-0.png        ✗ Wrong format
map_54_114.png       ✗ Wrong format
mapshot.png          ✗ Wrong format
```

---

## API Reference (Server Edition)

### GET `/api/maps`
Returns JSON list of available maps:
```json
[
  {"x": 0, "y": 0, "path": "/maps/0,0.png"},
  {"x": 54, "y": 114, "path": "/maps/54,114.png"}
]
```

### GET `/maps/:filename`
Serves individual map image

### GET `/health`
Health check endpoint

---

## Troubleshooting

### Server Edition
**Maps not loading:**
- Verify `MAPSHOTS_DIR` path is correct
- Check `/api/maps` endpoint
- Ensure files match naming pattern (X,Y.png)

**Port already in use:**
```bash
PORT=8080 npm start
```

### GitHub Edition
**No maps appear:**
- Enter correct GitHub username/repo/branch
- Verify mapshots folder path (case-sensitive)
- Check GitHub API isn't rate-limited (60 req/hour for anonymous)

**"File not found" errors:**
- Maps must be in public repo (or public files)
- Filenames must match pattern exactly
- Try `/api/maps` equivalent (GitHub API endpoint)

---

## Performance Tips

1. **Image size:** Use 256px × 256px PNG files
2. **Compression:** Use PNG 8-bit or JPEG quality 85
3. **Quantity:** Server handles 1000+ maps efficiently
4. **Caching:** Server caches images for 1 day

---

## File Structure

```
tools/
├── MapViewer.html                 (Original)
├── MapViewerServer.html            (Server version)
├── MapViewerGitHubPages.html       (GitHub Pages version)
├── server.js                       (Express backend)
├── package.json                    (Dependencies)
├── Procfile                        (Heroku/Railway config)
├── SERVER_SETUP.md                 (Detailed setup guide)
└── DEPLOYMENT_GUIDE.md             (This file)
```

---

## Which Version Should I Use?

| Scenario | Use |
|----------|-----|
| Local testing only | Original (MapViewer.html) |
| Share with friends | Server Edition on Railway |
| Portfolio/showcase | GitHub Pages Edition |
| Production website | Server Edition (Railway/Heroku) |
| No backend needed | GitHub Pages Edition |
| Complex features later | Server Edition |

---

## Cost

- **Original:** Free (no backend)
- **Server Edition:**
  - Railway: Free tier (5GB/month)
  - Heroku: Paid ($7/month minimum)
  - Vercel: Free tier available
- **GitHub Pages:** Free (included with GitHub)

---

## Support

- For Server Edition issues: See SERVER_SETUP.md
- For API issues: Check `/api/maps` endpoint
- For GitHub API limits: Cache maps locally or get GitHub token

---

Happy deploying! 🗺️
