import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2 } from "lucide-react";
import { DR_GRADES } from "../utils/constants";
import { formatConfidence, formatTime } from "../utils/helpers";

export default function PredictionHistory({ history, onClear }) {
  if (!history.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-2xl p-6 border border-slate-700/50 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-widest">
          <History className="w-4 h-4 text-slate-500" />
          Recent Predictions
        </div>
        <button
          onClick={onClear}
          className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {history.map((item, i) => {
            const grade = DR_GRADES[item.grade ?? item.class ?? 0];
            return (
              <motion.div
                key={item.timestamp}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-slate-900/40 rounded-xl px-4 py-3 border border-slate-800/60"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${grade.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${grade.color}`}>{grade.label}</p>
                  <p className="text-slate-600 text-xs font-mono truncate">{item.filename}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-300 text-xs font-mono font-semibold">
                    {formatConfidence(item.confidence ?? item.score ?? 0)}
                  </p>
                  <p className="text-slate-600 text-xs font-mono">{formatTime(item.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}