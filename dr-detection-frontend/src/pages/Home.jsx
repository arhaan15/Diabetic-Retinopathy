import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import UploadZone from "../components/UploadZone";
import ResultCard from "../components/ResultCard";
import HeatmapViewer from "../components/HeatmapViewer";
import PredictionHistory from "../components/PredictionHistory";
import LoadingSpinner from "../components/LoadingSpinner";
import { useApi } from "../hooks/useApi";

export default function Home() {
  const [currentFile, setCurrentFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const {
    health, prediction, heatmap, history,
    loadingPredict, loadingHeatmap, error,
    predict, fetchHeatmap, clear,
  } = useApi();

  const handlePredict = async (file) => {
    setCurrentFile(file);
    setPreview(URL.createObjectURL(file));
    await predict(file);
  };

  const handleHeatmap = () => {
    if (currentFile) fetchHeatmap(currentFile);
  };

  const handleClear = () => {
    setCurrentFile(null);
    setPreview(null);
    clear();
  };

  return (
    <div className="min-h-screen">
      <Navbar health={health} />

      {/* Hero */}
      <div className="pt-24 pb-8 px-6 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          
          <h1 className="font-display text-4xl font-bold text-white mb-3 leading-tight">
            Diabetic Retinopathy<br />
            <span className="text-gradient">Detection System</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Upload a fundus photograph for automated DR grading using convolutional neural networks with Grad-CAM explainability.
          </p>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-6 border border-slate-700/50"
          >
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-brand-500 inline-block" />
              Image Input
            </h2>
            <UploadZone onPredict={handlePredict} loading={loadingPredict} />
            {loadingPredict && <LoadingSpinner label="Running neural network inference…" />}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm font-mono"
            >
              ⚠ {error}
            </motion.div>
          )}

          <PredictionHistory history={history} onClear={handleClear} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {!prediction && !loadingPredict && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl border border-slate-800 p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-slate-400 font-medium mb-1">No analysis yet</p>
                <p className="text-slate-600 text-sm">Upload a retinal fundus image to begin</p>
              </div>
            </motion.div>
          )}

          {loadingPredict && (
            <div className="glass-dark rounded-2xl p-12 border border-slate-700/50 flex items-center justify-center min-h-[280px]">
              <LoadingSpinner label="Analyzing retinal image…" />
            </div>
          )}

          {prediction && !loadingPredict && (
            <ResultCard
              prediction={prediction}
              onFetchHeatmap={handleHeatmap}
              loadingHeatmap={loadingHeatmap}
              heatmap={heatmap}
            />
          )}

          {loadingHeatmap && (
            <div className="glass-dark rounded-2xl p-8 border border-slate-700/50 flex items-center justify-center">
              <LoadingSpinner label="Generating Grad-CAM activation map…" />
            </div>
          )}

          {heatmap && preview && !loadingHeatmap && (
            <HeatmapViewer original={preview} heatmap={heatmap} />
          )}
        </div>
      </div>
    </div>
  );
}