import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Send, Sparkles } from 'lucide-react';
import './App.css';

const PsychologyChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "您好！我是您的心理健康助手。我可以为您提供情绪支持、压力管理建议，或者只是一个可以倾诉的空间。今天您感觉如何？",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedResponses = {
    greeting: ["你好！很高兴见到你。", "您好！今天过得怎么样？", "欢迎！我在这里倾听。"],
    anxiety: [
      "焦虑是很常见的感觉。深呼吸可以帮助：吸气4秒，屏住4秒，呼气6秒。重复几次，感受身体的放松。",
      "当感到焦虑时，可以试试5-4-3-2-1技巧：说出你看到的5样东西，触摸的4样东西，听到的3种声音，闻到的2种气味，尝到的1种味道。",
      "焦虑时，记住这种感觉是暂时的。你曾经度过这样的时刻，这次也一定可以。"
    ],
    depression: [
      "情绪低落时，记得对自己温柔一些。每一天都是新的开始，即使是很小的一步也值得庆祝。",
      "当感到沮丧时，试着做一件让你感到有成就感的小事，比如整理房间或者给朋友发消息。",
      "你的感受是真实且重要的。如果这种情绪持续很久，考虑寻求专业帮助是非常勇敢的选择。"
    ],
    stress: [
      "压力很大时，试着停下来问问自己：这件事一年后还重要吗？这有助于我们重新审视优先级。",
      "运动是很好的减压方式。即使是短暂的散步也能释放内啡肽，改善心情。",
      "记得给自己充电的时间。休息不是懒惰，而是为了更好地前进。"
    ],
    sleep: [
      "良好的睡眠对心理健康很重要。试着建立规律的睡眠时间，睡前避免电子设备。",
      "如果睡不着，不要强迫自己。起来做些轻松的活动，比如阅读或听轻音乐，直到感到困倦。",
      "睡前冥想或深呼吸练习可以帮助身心放松，更容易入睡。"
    ],
    general: [
      "谢谢你的分享。继续告诉我你的想法。",
      "我理解你的感受。还有什么想说的吗？",
      "你的勇气令人敬佩。我在这里支持你。",
      "每个人都有自己的节奏。给自己一些时间和耐心。"
    ]
  };

  const getKeywordResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
    } else if (lowerMessage.includes('焦虑') || lowerMessage.includes('紧张') || lowerMessage.includes('担心')) {
      return predefinedResponses.anxiety[Math.floor(Math.random() * predefinedResponses.anxiety.length)];
    } else if (lowerMessage.includes('抑郁') || lowerMessage.includes('沮丧') || lowerMessage.includes('难过') || lowerMessage.includes('悲伤')) {
      return predefinedResponses.depression[Math.floor(Math.random() * predefinedResponses.depression.length)];
    } else if (lowerMessage.includes('压力') || lowerMessage.includes('累') || lowerMessage.includes('疲惫')) {
      return predefinedResponses.stress[Math.floor(Math.random() * predefinedResponses.stress.length)];
    } else if (lowerMessage.includes('睡眠') || lowerMessage.includes('失眠') || lowerMessage.includes('睡不着')) {
      return predefinedResponses.sleep[Math.floor(Math.random() * predefinedResponses.sleep.length)];
    } else {
      return predefinedResponses.general[Math.floor(Math.random() * predefinedResponses.general.length)];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      const botResponse = getKeywordResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="psychology-chat">
      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1>心理健康助手</h1>
          </div>
          <div className="header-status">
            <span className="status-dot online"></span>
            <span>在线</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>对话记录</h2>
          </div>
          <div className="chat-history">
            <div className="history-item active">
              <div className="history-avatar">
                <MessageCircle size={16} />
              </div>
              <div className="history-content">
                <h3>今天的对话</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="sidebar-footer">
            <button className="new-chat-btn">
              <MessageCircle size={16} />
              新对话
            </button>
          </div>
        </aside>

        {/* Chat Messages */}
        <section className="chat-container">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <Sparkles size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="message-input-container">
            <div className="input-wrapper">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您想说的话..."
                className="message-input"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="send-button"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="input-footer">
              <small>这是一个AI助手，不能替代专业心理咨询。如需专业帮助，请寻求心理医生。</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PsychologyChat;