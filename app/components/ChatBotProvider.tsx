'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { ChatBot, ChatToggle } from './ChatBot';

export function ChatBotProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && <ChatBot isOpen={isChatOpen} onToggle={toggleChat} />}
      </AnimatePresence>

      <ChatToggle onClick={toggleChat} isOpen={isChatOpen} />
    </>
  );
}
