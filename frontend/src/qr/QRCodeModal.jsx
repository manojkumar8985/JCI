import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download, ExternalLink } from "lucide-react";

const QRCodeModal = ({ open, onClose, qrid }) => {
  const onImageDownload = () => {
    const canvas = document.getElementById("QRCodeZoomed");
    if (!canvas) return;
    
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = "business-qr-code.png";
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Share Business</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* QR Code Section */}
            <div className="p-10 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
              <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-slate-100 mb-8">
                <QRCodeCanvas
                  id="QRCodeZoomed"
                  value={qrid}
                  size={240}
                  level="H"
                  includeMargin={true}
                  bgColor="transparent"
                  fgColor="#000000"
                />
              </div>
              
              <div className="text-center space-y-2 mb-8">
                <p className="text-slate-900 font-bold text-lg">Scan to view details</p>
                <p className="text-slate-500 text-sm">Anyone with this code can access the business page</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={onImageDownload}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  <Download size={20} />
                  Download
                </button>
                <button
                  onClick={() => window.open(qrid, "_blank")}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ExternalLink size={20} />
                  Link
                </button>
              </div>
            </div>

            {/* Footer decoration */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;
