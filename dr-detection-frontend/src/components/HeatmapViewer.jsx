import { motion } from "framer-motion";
import { Eye, Layers } from "lucide-react";

export default function HeatmapViewer({ original, heatmap }) {
  if (!heatmap) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-dark rounded-2xl p-6 border border-slate-700/50 space-y-4"
    >
      <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-widest">
        <Layers className="w-4 h-4 text-cyan-400" />
        Grad-CAM Visualization
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-mono flex items-center gap-1">
            <Eye className="w-3 h-3" /> Original Scan
          </p>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-square">
            <img src={original} alt="Original retinal scan" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-mono flex items-center gap-1">
            <span className="w-3 h-3 text-center text-[10px]">🌡</span> Activation Map
          </p>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-square">
            <img src={heatmap} alt="Grad-CAM heatmap" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-xs font-mono text-center">
        Red/yellow regions indicate areas most relevant to the prediction
      </p>
    </motion.div>
  );
}