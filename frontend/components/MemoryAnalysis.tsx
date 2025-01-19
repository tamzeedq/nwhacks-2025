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

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Separate ChatContent into a memoized component
const ChatContent = memo(({ 
  messages, 
  loading, 
  inputMessage, 
  setInputMessage, 
  handleSendMessage,
  messagesEndRef,
  inputRef 
}: {
  messages: Message[];
  loading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
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

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Alert className={`max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-neutral-700'
            }`}>
              <AlertDescription className="whitespace-pre-line">
                {message.text}
              </AlertDescription>
            </Alert>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <Alert className="max-w-[80%] bg-gray-100 dark:bg-neutral-700">
              <AlertDescription className="flex items-center gap-2">
                <div className="animate-bounce">•</div>
                <div className="animate-bounce delay-100">•</div>
                <div className="animate-bounce delay-200">•</div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
        <Input
          ref={inputRef}
          value={inputMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={loading || !inputMessage.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Send
        </Button>
      </form>
    </>
  );
});

ChatContent.displayName = 'ChatContent';

const MemoryAnalysis = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-500" />
            Memory Analysis
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(true)}
            className="h-8 w-8"
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
          />
        </CardContent>
      </Card>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
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
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemoryAnalysis;