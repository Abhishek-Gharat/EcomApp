import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-900/80 border-green-500/50 text-green-400',
    error: 'bg-red-900/80 border-red-500/50 text-red-400',
    info: 'bg-blue-900/80 border-blue-500/50 text-blue-400',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 100 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border backdrop-blur-sm ${colors[type]}`}
      >
        {icons[type]}
        <span className="font-medium text-sm">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
