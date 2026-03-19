import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, X, Zap } from "lucide-react";
import { isValidImage } from "../utils/helpers";

export default function UploadZone({ onPredict, loading }) {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef();

  const handle = useCallback((f) => {
    setFileError(null);
    if (!isValidImage(f)) {
      setFileError("Please upload a valid retinal image (JPEG, PNG, WebP, BMP).");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handle(f);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = () => file && onPredict(file);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center gap-4 text-center
              ${dragging
                ? "border-brand-400 bg-brand-500/10 scale-[1.02]"
                : "border-slate-700 hover:border-brand-500/60 hover:bg-brand-500/5 bg-slate-900/40"
              }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
              ${dragging ? "bg-brand-500/20" : "bg-slate-800"}`}>
              <Upload className={`w-7 h-7 transition-colors duration-300 ${dragging ? "text-brand-400" : "text-slate-500"}`} />
            </div>
            <div>
              <p className="text-slate-200 font-medium mb-1">
                {dragging ? "Drop it here" : "Drag & drop retinal image"}
              </p>
              <p className="text-slate-500 text-sm">or click to browse • JPEG, PNG, WebP, BMP</p>
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              {dragging && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-brand-400"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900"
          >
            <img
              src={preview}
              alt="Retinal scan preview"
              className="w-full h-64 object-contain bg-black"
            />
            <div className="absolute top-3 right-3">
              <button
                onClick={clear}
                className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-3 flex items-center gap-2 border-t border-slate-800">
              <ImageIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-slate-400 text-sm font-mono truncate">{file?.name}</span>
              <span className="ml-auto text-slate-600 text-xs font-mono">
                {(file?.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {fileError && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {fileError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && handle(e.target.files[0])}
      />

      <button
        onClick={submit}
        disabled={!file || loading}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300
          ${file && !loading
            ? "bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-glow hover:shadow-[0_0_32px_4px_rgba(14,165,233,0.3)] active:scale-[0.98]"
            : "bg-slate-800 text-slate-600 cursor-not-allowed"
          }`}
      >
        <Zap className="w-4 h-4" />
        {loading ? "Analyzing…" : "Run Analysis"}
      </button>
    </div>
  );
}