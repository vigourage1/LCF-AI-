import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import { TradingSession, Trade } from '../../types';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TradingSession;
  trades: Trade[];
}

const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  session,
  trades,
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const generatedSummary = await aiService.generateSessionSummary(session, trades);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
      // Provide a fallback summary
      setSummary(`## ${session.name} - Session Summary

**Performance Overview:**
- Total Trades: ${trades.length}
- Initial Capital: $${session.initial_capital.toFixed(2)}
- Current Capital: $${session.current_capital.toFixed(2)}

**Analysis:**
${trades.length === 0 
  ? 'No trades recorded yet. Start trading to see detailed analysis!'
  : `This session has ${trades.length} trades with a net P/L of $${(session.current_capital - session.initial_capital).toFixed(2)}.`
}

*Summary generated offline due to connection issues*`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSummary = () => {
    if (!summary) return;
    
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, '_')}_summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Summary downloaded successfully');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-400 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-white">Session Summary</h3>
                <p className="text-slate-400">{session.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {summary && (
                <button
                  onClick={downloadSummary}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Download Summary"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!summary && !isGenerating && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-300 mb-2">
                  Generate AI Summary
                </h4>
                <p className="text-slate-400 mb-6">
                  Let Sydney analyze your trading session and provide detailed insights
                </p>
                <button
                  onClick={generateSummary}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Summary
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-300 mb-2">
                  Generating Summary...
                </h4>
                <p className="text-slate-400">
                  Sydney is analyzing your trades and performance
                </p>
              </div>
            )}

            {summary && (
              <div className="prose prose-invert max-w-none">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-600">
                  <pre className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed">
                    {summary}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {summary && (
            <div className="p-6 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={generateSummary}
                disabled={isGenerating}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
              >
                Regenerate
              </button>
              <button
                onClick={downloadSummary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SessionSummaryModal;