"use client"

import React, { useState, useEffect, useRef, memo } from 'react';
import { MessageCircle, Maximize2, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { memoryTypes } from '../constants/constants';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

interface MemoryAnalysisProps {
  type: keyof typeof memoryTypes;
}

const ChatContent = memo(({ 
  messages, 
  loading, 
  inputMessage, 
  setInputMessage, 
  handleSendMessage,
  messagesEndRef,
  inputRef,
  accentColor
}: {
  messages: Message[];
  loading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  accentColor: string;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Convert hex to RGB for opacity handling
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(accentColor);
  const rgbaColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ` : 'rgba(37, 99, 235, ';

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Alert 
              className={`max-w-[80%] ${
                message.sender === 'user' 
                  ? 'border dark:border-opacity-30'
                  : 'bg-gray-100/10 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
              style={{
                backgroundColor: message.sender === 'user' ? `${rgbaColor}0.2)` : undefined,
                borderColor: message.sender === 'user' ? accentColor : undefined,
                color: message.sender === 'user' ? accentColor : undefined
              }}
            >
              <AlertDescription className="whitespace-pre-line">
                {message.text}
              </AlertDescription>
            </Alert>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <Alert className="max-w-[80%] bg-gray-100/10 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <AlertDescription className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className={`animate-bounce delay-${i}00`}
                    style={{ color: accentColor }}
                  >
                    •
                  </div>
                ))}
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
        <Input
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-transparent dark:bg-gray-800/50 dark:border-gray-700 focus:ring-0 dark:focus:border-opacity-50"
          style={{ 
            '--tw-ring-color': accentColor,
            borderColor: inputMessage ? accentColor : undefined
          } as React.CSSProperties}
        />
        <Button 
          type="submit" 
          disabled={loading || !inputMessage.trim()}
          className="transition-colors duration-200"
          style={{
            backgroundColor: `${rgbaColor}0.2)`,
            color: accentColor,
            borderColor: accentColor,
          }}
        >
          Send
        </Button>
      </form>
    </>
  );
});

ChatContent.displayName = 'ChatContent';

const MemoryAnalysis = ({ type }: MemoryAnalysisProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const memType = memoryTypes[type];
  const accentColor = memType.color;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { 
      text: inputMessage, 
      sender: 'user',
      timestamp: new Date()
    }]);

    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "This is a sample response from the bot.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setLoading(false);
    }, 1000);

    setInputMessage('');
    inputRef.current?.focus();
  };

  return (
    <>
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <BrainCircuit style={{ color: accentColor }} className="w-5 h-5" />
            Memory Analysis
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(true)}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ color: accentColor }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[300px] p-0 flex flex-col">
          <ChatContent 
            messages={messages}
            loading={loading}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
            inputRef={inputRef}
            accentColor={accentColor}
          />
        </CardContent>
      </Card>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-4xl h-[80vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BrainCircuit style={{ color: accentColor }} className="w-5 h-5" />
              Memory Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[72vh]">
            <ChatContent 
              messages={messages}
              loading={loading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
              inputRef={inputRef}
              accentColor={accentColor}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemoryAnalysis;