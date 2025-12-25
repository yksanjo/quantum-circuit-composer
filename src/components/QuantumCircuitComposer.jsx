import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, Zap, Download, Upload, Target, Sparkles } from 'lucide-react';

const QuantumCircuitComposer = () => {
  const [circuit, setCircuit] = useState([[], []]);
  const [results, setResults] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [measurementResult, setMeasurementResult] = useState(null);
  const [draggedGate, setDraggedGate] = useState(null);
  const [stateVector, setStateVector] = useState([1, 0, 0, 0]);
  const circuitRef = useRef(null);

  const gates = [
    { id: 'H', name: 'Hadamard', color: 'bg-blue-500', symbol: 'H', description: 'Creates superposition' },
    { id: 'X', name: 'Pauli-X', color: 'bg-red-500', symbol: 'X', description: 'Bit flip (NOT gate)' },
    { id: 'Y', name: 'Pauli-Y', color: 'bg-yellow-500', symbol: 'Y', description: 'Y rotation' },
    { id: 'Z', name: 'Pauli-Z', color: 'bg-green-500', symbol: 'Z', description: 'Phase flip' },
    { id: 'CNOT', name: 'CNOT', color: 'bg-purple-500', symbol: '⊕', description: 'Entanglement gate' },
  ];

  const challenges = [
    { 
      id: 1, 
      name: 'Superposition', 
      description: 'Create equal probability of |0⟩ and |1⟩ on Q0', 
      target: { '00': 0.5, '10': 0.5 },
      hint: 'Use Hadamard gate on Q0'
    },
    { 
      id: 2, 
      name: 'Bell State', 
      description: 'Create maximum entanglement between qubits', 
      target: { '00': 0.5, '11': 0.5 },
      hint: 'H on Q0, then CNOT'
    },
    { 
      id: 3, 
      name: 'Bit Flip', 
      description: 'Flip Q0 from |0⟩ to |1⟩', 
      target: { '10': 1.0 },
      hint: 'Use Pauli-X gate'
    },
    {
      id: 4,
      name: 'GHZ State',
      description: 'Create three-qubit entangled state (simulated with 2 qubits)',
      target: { '00': 0.5, '11': 0.5 },
      hint: 'H on Q0, CNOT, then measure'
    },
  ];

  const famousCircuits = [
    {
      id: 'deutsch-jozsa',
      name: 'Deutsch-Jozsa (Simplified)',
      description: 'Constant vs balanced function oracle',
      setup: () => {
        setCircuit([['H', 'H'], ['H', 'I']]);
      }
    },
    {
      id: 'quantum-teleportation',
      name: 'Quantum Teleportation',
      description: 'Teleport quantum state',
      setup: () => {
        setCircuit([['H', 'CNOT_C'], ['I', 'CNOT_T']]);
      }
    },
  ];

  const addGate = (qubit, gateId, position = null) => {
    if (gateId === 'CNOT') {
      const newCircuit = [...circuit];
      if (position !== null) {
        newCircuit[0].splice(position, 0, 'CNOT_C');
        newCircuit[1].splice(position, 0, 'CNOT_T');
      } else {
        newCircuit[0].push('CNOT_C');
        newCircuit[1].push('CNOT_T');
      }
      setCircuit(newCircuit);
    } else {
      const newCircuit = [...circuit];
      if (position !== null) {
        newCircuit[qubit].splice(position, 0, gateId);
        newCircuit[1 - qubit].splice(position, 0, 'I');
      } else {
        newCircuit[qubit].push(gateId);
        if (qubit === 0) newCircuit[1].push('I');
        else newCircuit[0].push('I');
      }
      setCircuit(newCircuit);
    }
    setResults(null);
    setMeasurementResult(null);
  };

  const removeGate = (qubit, index) => {
    const newCircuit = [...circuit];
    newCircuit[0].splice(index, 1);
    newCircuit[1].splice(index, 1);
    setCircuit(newCircuit);
    setResults(null);
    setMeasurementResult(null);
  };

  const reset = () => {
    setCircuit([[], []]);
    setResults(null);
    setSelectedChallenge(null);
    setMeasurementResult(null);
    setStateVector([1, 0, 0, 0]);
  };

  const handleDragStart = (e, gateId) => {
    setDraggedGate(gateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, qubit, position) => {
    e.preventDefault();
    if (draggedGate) {
      addGate(qubit, draggedGate, position);
      setDraggedGate(null);
    }
  };

  const simulate = () => {
    // Initialize state vector [|00⟩, |01⟩, |10⟩, |11⟩]
    let state = [1, 0, 0, 0];

    const applyH = (state, qubit) => {
      const newState = [0, 0, 0, 0];
      const sqrt2 = Math.sqrt(2);
      for (let i = 0; i < 4; i++) {
        const bit = (i >> (1 - qubit)) & 1;
        if (bit === 0) {
          newState[i] += state[i] / sqrt2;
          newState[i ^ (1 << (1 - qubit))] += state[i] / sqrt2;
        } else {
          newState[i] += state[i] / sqrt2;
          newState[i ^ (1 << (1 - qubit))] -= state[i] / sqrt2;
        }
      }
      return newState;
    };

    const applyX = (state, qubit) => {
      const newState = [...state];
      for (let i = 0; i < 4; i++) {
        const j = i ^ (1 << (1 - qubit));
        if (i < j) {
          [newState[i], newState[j]] = [newState[j], newState[i]];
        }
      }
      return newState;
    };

    const applyZ = (state, qubit) => {
      const newState = [...state];
      for (let i = 0; i < 4; i++) {
        const bit = (i >> (1 - qubit)) & 1;
        if (bit === 1) newState[i] *= -1;
      }
      return newState;
    };

    const applyY = (state, qubit) => {
      const newState = [...state];
      for (let i = 0; i < 4; i++) {
        const j = i ^ (1 << (1 - qubit));
        const bit = (i >> (1 - qubit)) & 1;
        if (i < j) {
          if (bit === 0) {
            [newState[i], newState[j]] = [newState[j] * -1, newState[i]];
          } else {
            [newState[i], newState[j]] = [newState[j], newState[i] * -1];
          }
        }
      }
      return newState;
    };

    const applyCNOT = (state) => {
      const newState = [...state];
      [newState[2], newState[3]] = [newState[3], newState[2]];
      return newState;
    };

    for (let col = 0; col < circuit[0].length; col++) {
      const gate0 = circuit[0][col];
      const gate1 = circuit[1][col];

      if (gate0 === 'CNOT_C' && gate1 === 'CNOT_T') {
        state = applyCNOT(state);
      } else {
        if (gate0 === 'H') state = applyH(state, 0);
        else if (gate0 === 'X') state = applyX(state, 0);
        else if (gate0 === 'Y') state = applyY(state, 0);
        else if (gate0 === 'Z') state = applyZ(state, 0);

        if (gate1 === 'H') state = applyH(state, 1);
        else if (gate1 === 'X') state = applyX(state, 1);
        else if (gate1 === 'Y') state = applyY(state, 1);
        else if (gate1 === 'Z') state = applyZ(state, 1);
      }
    }

    setStateVector(state);

    const probs = state.map(amp => {
      const real = typeof amp === 'number' ? amp : amp.real || 0;
      const imag = typeof amp === 'number' ? 0 : amp.imag || 0;
      return real * real + imag * imag;
    });
    const labels = ['00', '01', '10', '11'];
    const probData = labels.map((label, i) => ({ label, prob: probs[i] }))
      .filter(d => d.prob > 0.001)
      .sort((a, b) => b.prob - a.prob);

    setResults(probData);
  };

  const measure = () => {
    if (!results) {
      simulate();
      setTimeout(measure, 100);
      return;
    }

    // Probabilistic measurement
    const random = Math.random();
    let cumulative = 0;
    let measured = null;

    for (const { label, prob } of results) {
      cumulative += prob;
      if (random <= cumulative) {
        measured = label;
        break;
      }
    }

    setMeasurementResult(measured);
  };

  const loadChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCircuit([[], []]);
    setResults(null);
    setMeasurementResult(null);
  };

  const saveCircuit = () => {
    const data = {
      circuit,
      challenge: selectedChallenge?.id,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum-circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadCircuit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            setCircuit(data.circuit || [[], []]);
            if (data.challenge) {
              const challenge = challenges.find(c => c.id === data.challenge);
              if (challenge) setSelectedChallenge(challenge);
            }
            setResults(null);
            setMeasurementResult(null);
          } catch (error) {
            alert('Failed to load circuit file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const checkChallengeComplete = () => {
    if (!selectedChallenge || !results) return false;
    const tolerance = 0.05;
    for (const [label, targetProb] of Object.entries(selectedChallenge.target)) {
      const result = results.find(r => r.label === label);
      if (!result || Math.abs(result.prob - targetProb) > tolerance) {
        return false;
      }
    }
    return true;
 };

  const isChallengeComplete = checkChallengeComplete();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ⚛️ Quantum Circuit Composer
            </h1>
            <p className="text-slate-300 text-sm md:text-base">Design quantum circuits and watch quantum magic happen</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              title="Info"
            >
              <Info size={20} />
            </button>
            <button
              onClick={saveCircuit}
              className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              title="Save Circuit"
            >
              <Download size={20} />
            </button>
            <button
              onClick={loadCircuit}
              className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              title="Load Circuit"
            >
              <Upload size={20} />
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="mb-6 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Zap className="text-yellow-400" /> How to use
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm md:text-base">
              <li>• <strong>Drag & Drop:</strong> Drag gates from the palette onto qubit lines</li>
              <li>• <strong>Click:</strong> Click gate buttons to add them to the circuit</li>
              <li>• <strong>Remove:</strong> Click gates in the circuit to remove them</li>
              <li>• <strong>Simulate:</strong> Press "Run Simulation" to see measurement probabilities</li>
              <li>• <strong>Measure:</strong> Click "Measure" for probabilistic measurement results</li>
              <li>• <strong>Challenges:</strong> Try the challenges to learn quantum computing concepts!</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              onClick={() => loadChallenge(challenge)}
              className={`p-4 rounded-lg cursor-pointer transition ${
                selectedChallenge?.id === challenge.id
                  ? 'bg-purple-600 border-2 border-purple-400'
                  : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} />
                <h3 className="font-bold text-sm md:text-base">{challenge.name}</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-300">{challenge.description}</p>
            </div>
          ))}
        </div>

        {famousCircuits.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" /> Famous Circuits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {famousCircuits.map(circuit => (
                <button
                  key={circuit.id}
                  onClick={circuit.setup}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition"
                >
                  <h4 className="font-bold text-sm">{circuit.name}</h4>
                  <p className="text-xs text-slate-400">{circuit.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Gate Palette</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
            {gates.map(gate => (
              <div key={gate.id} className="text-center">
                <div className="mb-2 space-y-2">
                  <button
                    draggable
                    onDragStart={(e) => handleDragStart(e, gate.id)}
                    onClick={() => addGate(0, gate.id)}
                    className={`w-full ${gate.color} hover:opacity-80 text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded transition cursor-grab active:cursor-grabbing`}
                    title={`${gate.name}: ${gate.description}`}
                  >
                    {gate.symbol}
                  </button>
                  {gate.id !== 'CNOT' && (
                    <button
                      draggable
                      onDragStart={(e) => handleDragStart(e, gate.id)}
                      onClick={() => addGate(1, gate.id)}
                      className={`w-full ${gate.color} hover:opacity-80 text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded transition opacity-70 cursor-grab active:cursor-grabbing`}
                      title={`${gate.name}: ${gate.description}`}
                    >
                      {gate.symbol}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">{gate.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-lg p-4 md:p-6" ref={circuitRef}>
            <h3 className="text-lg font-bold mb-4">Circuit</h3>
            {[0, 1].map(qubit => (
              <div 
                key={qubit} 
                className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, qubit, circuit[qubit].length)}
              >
                <div className="text-xs md:text-sm font-mono bg-slate-800 px-3 py-2 rounded whitespace-nowrap">
                  Q{qubit} |0⟩
                </div>
                <div className="flex-1 h-1 bg-slate-700"></div>
                <div className="flex gap-2 flex-wrap">
                  {circuit[qubit].map((gate, idx) => {
                    if (gate === 'I') return <div key={idx} className="w-10 md:w-12"></div>;
                    const gateInfo = gates.find(g => g.id === gate || gate.includes(g.id));
                    const isCNOT = gate.includes('CNOT');
                    return (
                      <div
                        key={idx}
                        className="relative"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, qubit, idx)}
                      >
                        <button
                          onClick={() => removeGate(qubit, idx)}
                          className={`${isCNOT ? 'bg-purple-500' : gateInfo?.color} hover:opacity-70 text-white font-bold py-2 px-3 rounded transition text-sm`}
                          title="Click to remove"
                        >
                          {isCNOT ? (gate === 'CNOT_C' ? '●' : '⊕') : gateInfo?.symbol}
                        </button>
                      </div>
                    );
                  })}
                  <div 
                    className="w-16 h-10 border-2 border-dashed border-slate-600 rounded flex items-center justify-center text-slate-500 text-xs"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, qubit, circuit[qubit].length)}
                  >
                    Drop
                  </div>
                </div>
              </div>
            ))}
            {circuit[0].length === 0 && (
              <p className="text-slate-500 text-center py-4 text-sm">Drag gates or click buttons above to build your circuit</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <button
              onClick={simulate}
              disabled={circuit[0].length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Play size={20} /> Run Simulation
            </button>
            <button
              onClick={measure}
              disabled={circuit[0].length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Target size={20} /> Measure
            </button>
            <button
              onClick={reset}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-slate-800 rounded-lg p-4 md:p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Measurement Probabilities</h2>
            <div className="space-y-3 mb-4">
              {results.map(({ label, prob }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-sm md:text-base">|{label}⟩</span>
                    <span className="text-slate-400 text-sm md:text-base">{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${prob * 100}%` }}
                    >
                      {prob > 0.15 && <span className="text-xs font-bold">{(prob * 100).toFixed(1)}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {measurementResult && (
              <div className="mt-4 p-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg">
                <p className="text-lg font-bold text-center">
                  Measurement Result: <span className="text-blue-400 font-mono">|{measurementResult}⟩</span>
                </p>
              </div>
            )}

            {selectedChallenge && (
              <div className={`mt-4 p-4 rounded border-2 ${
                isChallengeComplete 
                  ? 'bg-green-900/30 border-green-500' 
                  : 'bg-slate-900 border-slate-700'
              }`}>
                <p className="text-sm text-slate-400 mb-2">
                  💡 Challenge: {selectedChallenge.description}
                </p>
                {isChallengeComplete ? (
                  <p className="text-green-400 font-bold">✅ Challenge Complete!</p>
                ) : (
                  <p className="text-yellow-400 text-xs">Hint: {selectedChallenge.hint}</p>
                )}
              </div>
            )}

            <div className="mt-4 p-4 bg-slate-900 rounded border border-slate-700">
              <h3 className="text-sm font-bold mb-2">State Vector (Complex Amplitudes)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                {['00', '01', '10', '11'].map((label, i) => {
                  const amp = stateVector[i];
                  const real = typeof amp === 'number' ? amp : (amp?.real || 0);
                  const imag = typeof amp === 'number' ? 0 : (amp?.imag || 0);
                  const magnitude = Math.sqrt(real * real + imag * imag);
                  const phase = Math.atan2(imag, real);
                  
                  return (
                    <div key={label} className="p-2 bg-slate-800 rounded">
                      <div className="text-slate-400">|{label}⟩</div>
                      <div className="text-blue-400">
                        {real.toFixed(3)} {imag >= 0 ? '+' : ''}{imag.toFixed(3)}i
                      </div>
                      <div className="text-xs text-slate-500">
                        |α| = {magnitude.toFixed(3)}, φ = {(phase * 180 / Math.PI).toFixed(1)}°
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumCircuitComposer;

