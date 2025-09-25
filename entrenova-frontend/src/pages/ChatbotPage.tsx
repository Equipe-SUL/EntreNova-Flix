import React from 'react';
import ChatBot from '../components/ChatBot';

const ChatbotPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatbotPage;