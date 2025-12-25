# ⚛️ Quantum Circuit Composer

An interactive, educational web application for building and simulating quantum circuits. Learn quantum computing through hands-on experimentation with drag-and-drop gates, real-time visualizations, and engaging challenges.

![Quantum Circuit Composer](https://img.shields.io/badge/Quantum-Computing-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-yellow) ![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Core Functionality
- **Drag & Drop Interface**: Intuitively drag quantum gates onto qubit lines
- **Real Quantum Simulation**: Accurate state vector calculations using actual quantum mechanics
- **Interactive Circuit Builder**: Visual representation of your quantum circuit
- **Probabilistic Measurements**: Real quantum measurements with random outcomes
- **Save & Load Circuits**: Export and import your quantum circuits as JSON

### Visualizations
- **Probability Bars**: Animated visualization of measurement probabilities
- **State Vector Display**: See complex amplitudes for each basis state
- **Real-time Updates**: Instant feedback as you build your circuit

### Educational Features
- **Interactive Challenges**: Learn through guided challenges
  - Superposition: Create equal probability states
  - Bell State: Maximum entanglement
  - Bit Flip: Basic quantum gates
  - GHZ State: Multi-qubit entanglement
- **Famous Circuits**: Pre-built examples of quantum algorithms
  - Deutsch-Jozsa Algorithm (simplified)
  - Quantum Teleportation
- **Gate Descriptions**: Hover tooltips explain each quantum gate

### Quantum Gates
- **Hadamard (H)**: Creates superposition states
- **Pauli-X**: Bit flip (quantum NOT gate)
- **Pauli-Y**: Y-axis rotation
- **Pauli-Z**: Phase flip
- **CNOT**: Controlled-NOT (entanglement gate)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quantum-circuit-composer.git
   cd quantum-circuit-composer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📖 How to Use

### Basic Usage

1. **Add Gates**: 
   - Click gate buttons in the palette, or
   - Drag gates from the palette onto qubit lines

2. **Remove Gates**: Click any gate in the circuit to remove it

3. **Run Simulation**: Click "Run Simulation" to see measurement probabilities

4. **Measure**: Click "Measure" for a probabilistic measurement result

5. **Reset**: Clear the circuit and start over

### Challenges

1. Click on a challenge card to load it
2. Build the circuit to achieve the target state
3. Run simulation to check your progress
4. Complete the challenge to see the success message!

### Example: Creating a Bell State

1. Click the "Bell State" challenge
2. Add a Hadamard gate (H) to Q0
3. Add a CNOT gate (connects Q0 to Q1)
4. Run simulation
5. You should see 50% probability for |00⟩ and 50% for |11⟩ - maximum entanglement!

## 🎓 Educational Value

This tool helps you understand:
- **Quantum Superposition**: States that exist in multiple possibilities simultaneously
- **Quantum Entanglement**: Correlated states that cannot be described independently
- **Quantum Gates**: Operations that transform quantum states
- **Measurement**: The probabilistic nature of quantum mechanics
- **State Vectors**: Mathematical representation of quantum states

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## 📦 Project Structure

```
quantum-circuit-composer/
├── src/
│   ├── components/
│   │   └── QuantumCircuitComposer.jsx  # Main component
│   ├── App.jsx                         # App entry point
│   ├── main.jsx                        # React DOM render
│   └── index.css                       # Global styles
├── index.html                          # HTML template
├── package.json                        # Dependencies
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind configuration
└── README.md                           # This file
```

## 🚢 Deployment

### GitHub Pages

1. **Update `vite.config.js`** (already configured):
   ```js
   base: '/quantum-circuit-composer/',
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   - Go to your repository Settings → Pages
   - Select source: "GitHub Actions" or "Deploy from a branch"
   - If using branch: select `gh-pages` branch and `/` folder
   - If using Actions: create `.github/workflows/deploy.yml` (see below)

4. **GitHub Actions Workflow** (optional):
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Other Deployment Options

- **Vercel**: Connect your GitHub repo, automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect GitHub
- **Cloudflare Pages**: Connect GitHub repo for automatic deployments

## 🧪 Quantum Mechanics Behind the Scenes

The simulator uses actual quantum mechanics:

- **State Vectors**: Represented as complex amplitudes [α₀₀, α₀₁, α₁₀, α₁₁]
- **Unitary Operations**: Each gate is a unitary matrix transformation
- **Measurement**: Born's rule - probability = |amplitude|²
- **Entanglement**: Non-separable states like Bell states

### Mathematical Accuracy

All gate operations are mathematically correct:
- Hadamard: Creates equal superposition
- Pauli gates: Rotations and phase flips
- CNOT: Entangles qubits through controlled operations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Vite
- Icons from Lucide React
- Styling with Tailwind CSS
- Inspired by quantum computing education initiatives

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Made with ⚛️ and ❤️ for quantum computing education**

