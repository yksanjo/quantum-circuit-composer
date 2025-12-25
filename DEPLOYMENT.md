# 🚀 Deployment Guide

## Quick Start for GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Quantum Circuit Composer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/quantum-circuit-composer.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow file (`.github/workflows/deploy.yml`) is already configured!

3. **That's it!** 
   - The workflow will automatically build and deploy on every push to `main`
   - Your site will be available at: `https://YOUR_USERNAME.github.io/quantum-circuit-composer/`

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   - Use any static hosting service (Vercel, Netlify, Cloudflare Pages)
   - Or manually upload the `dist` folder contents

### Option 3: Using gh-pages Branch

1. **Install gh-pages** (optional)
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Environment Variables

No environment variables needed for this project!

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain
2. Configure DNS settings on your domain provider
3. Update GitHub Pages settings with your custom domain

## Troubleshooting

### Build Fails
- Make sure Node.js 18+ is installed
- Run `npm install` to ensure all dependencies are installed
- Check that `vite.config.js` has the correct `base` path

### 404 Errors on GitHub Pages
- Ensure `vite.config.js` has: `base: '/quantum-circuit-composer/'`
- Make sure the repository name matches the base path
- Clear browser cache and try again

### Assets Not Loading
- Check that all paths are relative
- Verify the `base` path in `vite.config.js` matches your repository name

