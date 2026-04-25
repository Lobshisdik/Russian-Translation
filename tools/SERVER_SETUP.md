# Map Viewer Server Edition

A server-based version of the Map Viewer that can be deployed locally or to cloud platforms, with GitHub Pages support.

## Files

- **MapViewerServer.html** - Client-side viewer (loads maps from server API)
- **server.js** - Node.js/Express server
- **package.json** - Node.js dependencies

## Quick Start (Local Server)

### Prerequisites
- Node.js 14+ installed
- Map image files in PNG/JPG format with coordinates in filename (e.g., `54,114.png`)

### Setup

1. **Install dependencies:**
   ```bash
   cd tools
   npm install
   ```

2. **Place map files:**
   Create a `mapshots` folder in the project root and add your map images:
   ```
   hypernet-explorer/
   ├── mapshots/
   │   ├── 0,0.png
   │   ├── 1,0.png
   │   ├── 54,114.png
   │   └── ...
   └── tools/
       ├── server.js
       ├── MapViewerServer.html
       └── package.json
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

### Configuration

**Custom mapshots directory:**
```bash
MAPSHOTS_DIR=/path/to/maps npm start
```

**Custom port:**
```bash
PORT=8080 npm start
```

**Development mode with auto-reload:**
```bash
npm run dev
```

---

## Deployment Options

### Option 1: Local Network Sharing

Expose your local server to your network:

```bash
PORT=3000 npm start
```

Access from other devices on your network:
```
http://<your-ip>:3000
```

---

### Option 2: Railway.app (Recommended for Beginners)

Free tier hosting with easy GitHub integration.

1. **Push to GitHub:**
   Ensure your repository is on GitHub with the mapshots folder in `.gitignore` (or committed if small).

2. **Create Railway account:**
   Visit https://railway.app - sign up with GitHub

3. **Connect repository:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and choose your repository

4. **Add environment:**
   - Railway detects `package.json` automatically
   - Set environment variables in Dashboard:
     - `MAPSHOTS_DIR`: `/app/mapshots` (or use default)
   - Add `Procfile` (if needed):
     ```
     web: npm start
     ```

5. **Deploy:**
   - Push to main branch - Railway auto-deploys
   - Access at `https://<project-name>.railway.app`

---

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows (using npm)
   npm install -g heroku
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-map-viewer
   ```

3. **Add Procfile:**
   ```bash
   echo "web: npm start" > tools/Procfile
   ```

4. **Set buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs -a your-map-viewer
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **View logs:**
   ```bash
   heroku logs --tail -a your-map-viewer
   ```

---

### Option 4: GitHub Pages (Static Hosting)

GitHub Pages only hosts static files, but you can use it as a CDN for map images with a modified approach:

**Alternative approach using GitHub as CDN:**

1. **Commit map images to GitHub:**
   ```bash
   git add mapshots/
   git commit -m "Add map images"
   git push
   ```

2. **Use raw.githubusercontent.com URLs:**
   - Maps are served from: `https://raw.githubusercontent.com/YOUR_USER/hypernet-explorer/main/mapshots/`
   - Create a modified viewer that loads from GitHub URLs

3. **Example modified HTML (uses GitHub as image CDN):**
   ```javascript
   // In MapViewerServer.html, modify the image loading:
   img.src = `https://raw.githubusercontent.com/YOUR_USER/hypernet-explorer/main/mapshots/${filename}`;
   ```

**Limitations:**
- Raw.githubusercontent.com has bandwidth limits
- Better for small datasets
- Suitable for demonstration/testing

---

### Option 5: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure `vercel.json`:**
   ```json
   {
     "buildCommand": "npm install",
     "outputDirectory": "tools",
     "env": {
       "MAPSHOTS_DIR": "mapshots"
     }
   }
   ```

---

## API Reference

### GET `/api/maps`

Returns list of available map files.

**Response:**
```json
[
  {
    "x": 0,
    "y": 0,
    "path": "/maps/0,0.png",
    "filename": "0,0.png"
  },
  {
    "x": 54,
    "y": 114,
    "path": "/maps/54,114.png",
    "filename": "54,114.png"
  }
]
```

### GET `/maps/:filename`

Serves individual map image files.

### GET `/health`

Health check endpoint. Returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## File Format Requirements

Map files must be named with coordinates:

**Valid formats:**
- `0,0.png`
- `54,114.png`
- `-10,20.png`
- `54, 114.png` (spaces allowed)
- `54,114.jpg`
- `54,114.JPEG`

**Invalid formats:**
- `map_0_0.png` ❌
- `chunk-0-0.png` ❌
- `map.png` ❌

---

## Troubleshooting

### Maps not loading
1. Check MAPSHOTS_DIR path is correct
2. Verify map files have correct naming format
3. Check browser console for errors (F12)
4. Visit `/api/maps` to see what the server found

### Server won't start
```bash
# Check if port is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Use different port
PORT=3001 npm start
```

### CORS errors (cross-origin)
- The server includes proper CORS headers for images
- Check that map files are in the correct directory
- Images should be served from `/maps/` path

### "No maps found" message
1. Ensure map files are in the `mapshots` directory
2. Verify file naming matches the pattern: `X,Y.png`
3. Run `/api/maps` endpoint directly to debug
4. Check file permissions

---

## Performance Tips

1. **Image Optimization:**
   - Use PNG 256-color mode if possible
   - Or JPEG with quality 85-90
   - This reduces file size by 30-50%

2. **Lazy Loading:**
   - Server automatically skips out-of-view tiles
   - Efficient rendering even with thousands of maps

3. **Caching:**
   - Server sets `maxAge: 1d` for map images
   - Browser caches loaded images automatically

4. **Network:**
   - Use gzip compression (Express handles automatically)
   - Consider using a CDN for very large map sets

---

## Security Notes

- This server is designed for local/internal use
- For public deployment, consider:
  - Adding authentication if maps are sensitive
  - Implementing rate limiting
  - Using HTTPS (let's encrypt)
  - Validating file paths to prevent directory traversal

---

## Development

### Local testing with live reload:
```bash
npm run dev
```

### Debug output:
```bash
DEBUG=* npm start
```

### Check what maps were found:
```bash
curl http://localhost:3000/api/maps
```

---

## License

Same as main project
