import { useState } from 'react';
import { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon, UserIcon, BotIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  attachments?: { id: string; file_name: string; file_path: string }[];
}

export function ChatMessage({ message, attachments = [] }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.created_at);
  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true });
  
  const messageAttachments = attachments.filter(
    attachment => attachment.id === message.id
  );

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <BotIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {messageAttachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {messageAttachments.map((file) => (
                <div key={file.id} className="flex items-center gap-2 p-2 rounded bg-background/20">
                  <FileIcon className="h-4 w-4" />
                  <a 
                    href={file.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline truncate max-w-[200px]"
                  >
                    {file.file_name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
        <span className="text-xs text-muted-foreground mt-1">{formattedTime}</span>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary">
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
