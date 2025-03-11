'use client';
import React from 'react';
import ChatbotButton from '../ChatbotButton';
import { ChatbotContextProvider } from '@/contexts/ChatbotContext';

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
    return (
        <ChatbotContextProvider>
            {children}
            <ChatbotButton />
        </ChatbotContextProvider>
    );
}

export default ChatbotProvider;