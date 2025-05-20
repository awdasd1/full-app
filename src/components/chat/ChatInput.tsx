import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperclipIcon, SendIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => Promise<void>;
  conversationId: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, conversationId, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await onFileUpload(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t bg-background">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-10 resize-none"
        disabled={disabled}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={!message.trim() || disabled}
        size="icon"
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
