// Mock AI service for Sydney assistant
export const aiService = {
  async sendChatMessage(
    message: string,
    currentSession: any,
    trades: any[],
    messageHistory: any[]
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = message.toLowerCase();

    // Session switching
    if (lowerMessage.includes('load') || lowerMessage.includes('switch')) {
      return "I can help you switch sessions! Just tell me the session name, like 'Load the BTC session' or 'Switch to Apple Scalping'.";
    }

    // Trading analysis
    if (lowerMessage.includes('analysis') || lowerMessage.includes('analyze')) {
      if (!trades.length) {
        return "I don't see any trades in your current session yet. Once you add some trades, I can provide detailed analysis of your performance, patterns, and suggestions for improvement.";
      }

      const winRate = (trades.filter(t => t.profit_loss > 0).length / trades.length) * 100;
      const totalPL = trades.reduce((sum, t) => sum + t.profit_loss, 0);
      
      return `Here's your trading analysis:

📊 **Performance Overview:**
• Total Trades: ${trades.length}
• Win Rate: ${winRate.toFixed(1)}%
• Net P/L: $${totalPL.toFixed(2)}

🎯 **Key Insights:**
${winRate > 60 ? '• Great win rate! You\'re showing strong trade selection.' : '• Consider reviewing your entry criteria to improve win rate.'}
${totalPL > 0 ? '• Positive performance - keep up the good work!' : '• Focus on risk management and position sizing.'}

💡 **Suggestions:**
• ${trades.length < 10 ? 'Build more data for better analysis' : 'Consider keeping a trading journal for pattern recognition'}
• Monitor your emotional state in trade comments
• Review your best and worst performing trades`;
    }

    // Performance questions
    if (lowerMessage.includes('performance') || lowerMessage.includes('how am i doing')) {
      if (!trades.length) {
        return "You haven't recorded any trades yet in this session. Start adding your trades and I'll help you track your performance!";
      }

      const recentTrades = trades.slice(0, 5);
      const recentPL = recentTrades.reduce((sum, t) => sum + t.profit_loss, 0);
      
      return `Your recent performance looks ${recentPL > 0 ? 'positive' : 'challenging'}. ${recentPL > 0 ? 'Keep up the momentum!' : 'Consider taking a step back and reviewing your strategy.'} 

Your last ${recentTrades.length} trades show ${recentPL > 0 ? 'gains' : 'losses'} of $${Math.abs(recentPL).toFixed(2)}. ${recentTrades.length >= 3 ? 'I can see some patterns forming - would you like me to analyze them?' : 'Add more trades for better pattern analysis.'}`;
    }

    // Risk management
    if (lowerMessage.includes('risk') || lowerMessage.includes('management')) {
      return `Here are some key risk management principles:

🛡️ **Position Sizing:**
• Never risk more than 1-2% of your account per trade
• Use consistent position sizes based on your risk tolerance

📊 **Risk/Reward:**
• Aim for at least 1:2 risk-to-reward ratio
• Set stop losses before entering trades

🎯 **Diversification:**
• Don't put all capital in one trade or asset
• Spread risk across different opportunities

💭 **Psychology:**
• Stick to your trading plan
• Don't revenge trade after losses
• Take breaks when emotions run high`;
    }

    // General trading advice
    if (lowerMessage.includes('advice') || lowerMessage.includes('tips')) {
      const tips = [
        "Keep a detailed trading journal - your comments in trades are valuable for pattern recognition.",
        "Focus on process over profits. Good process leads to consistent results.",
        "Review your trades weekly to identify what's working and what isn't.",
        "Don't overtrade - quality over quantity always wins.",
        "Set daily/weekly loss limits to protect your capital.",
        "Celebrate small wins and learn from every loss.",
        "Stay disciplined with your entry and exit rules."
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      return `💡 **Trading Tip:** ${randomTip}

Remember, successful trading is about consistency and continuous improvement. I'm here to help you analyze your patterns and make better decisions!`;
    }

    // Default responses
    const responses = [
      "I'm here to help you improve your trading! Ask me about your performance, risk management, or trading strategies.",
      "I can analyze your trades, help you spot patterns, and provide personalized advice. What would you like to know?",
      "Let me know if you'd like me to review your recent trades or provide some trading insights!",
      "I'm Sydney, your AI trading assistant. I can help with analysis, session management, and trading advice. How can I assist you?",
      "Feel free to ask me about your trading performance, patterns in your trades, or general trading advice!"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  },

  async generateSessionSummary(session: any, trades: any[]): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!trades.length) {
      return `## ${session.name} - Session Summary

This session is just getting started! No trades have been recorded yet.

**Next Steps:**
- Add your first trade to begin tracking performance
- Set clear goals for this trading session
- Consider your risk management strategy

I'll provide detailed insights once you have some trading data to analyze.`;
    }

    const winningTrades = trades.filter(t => t.profit_loss > 0);
    const losingTrades = trades.filter(t => t.profit_loss < 0);
    const winRate = (winningTrades.length / trades.length) * 100;
    const totalPL = trades.reduce((sum, t) => sum + t.profit_loss, 0);
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.profit_loss, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.profit_loss, 0) / losingTrades.length) : 0;

    return `## ${session.name} - AI Generated Summary

**📊 Performance Overview**
- **Total Trades:** ${trades.length}
- **Win Rate:** ${winRate.toFixed(1)}% (${winningTrades.length}W / ${losingTrades.length}L)
- **Net P/L:** $${totalPL.toFixed(2)}
- **ROI:** ${((totalPL / session.initial_capital) * 100).toFixed(2)}%

**💰 Trade Analysis**
- **Average Win:** $${avgWin.toFixed(2)}
- **Average Loss:** $${avgLoss.toFixed(2)}
- **Risk/Reward Ratio:** ${avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : 'N/A'}

**🎯 Key Insights**
${winRate > 60 ? '✅ Strong win rate indicates good trade selection' : '⚠️ Win rate could be improved - review entry criteria'}
${totalPL > 0 ? '✅ Profitable session - maintaining positive momentum' : '⚠️ Session showing losses - consider risk management review'}
${trades.length > 10 ? '✅ Good sample size for reliable analysis' : '📈 Building trade history for better insights'}

**🔍 Behavioral Patterns**
${trades.some(t => t.comments?.toLowerCase().includes('revenge')) ? '⚠️ Possible revenge trading detected in comments' : ''}
${trades.filter(t => t.entry_side === 'Long').length > trades.length * 0.8 ? '📊 Heavy bias toward long positions' : ''}
${trades.filter(t => t.entry_side === 'Short').length > trades.length * 0.8 ? '📊 Heavy bias toward short positions' : ''}

**💡 Recommendations**
- ${winRate < 50 ? 'Focus on improving trade selection and entry timing' : 'Maintain current trade selection discipline'}
- ${avgLoss > avgWin ? 'Consider tighter stop losses or wider profit targets' : 'Good risk/reward management'}
- ${trades.length < 20 ? 'Continue building trade history for more reliable patterns' : 'Sufficient data for pattern analysis'}

*Generated by Sydney AI Assistant*`;
  }
};