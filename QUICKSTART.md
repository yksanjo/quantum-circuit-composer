# ⚡ Quick Start Guide

Get your Quantum Circuit Composer up and running in 3 steps!

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 3. Deploy to GitHub

### First Time Setup

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Quantum Circuit Composer"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/quantum-circuit-composer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment will start automatically!

Your site will be live at: `https://YOUR_USERNAME.github.io/quantum-circuit-composer/`

## Try It Out!

1. Click the **"Superposition"** challenge
2. Add a **Hadamard gate (H)** to Q0
3. Click **"Run Simulation"**
4. See 50/50 probability between |00⟩ and |10⟩!

## Next Steps

- Try the **Bell State** challenge (H on Q0, then CNOT)
- Experiment with different gates
- Drag and drop gates onto the circuit
- Click **"Measure"** to see probabilistic results

Enjoy exploring quantum computing! ⚛️

