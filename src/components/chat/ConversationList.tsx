import { useState, useEffect } from 'react';
import { Conversation } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4">
        <Button onClick={onNewConversation} className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
                onDelete={() => onDeleteConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
  const formattedDate = formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent group ${
        isActive ? 'bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <MessageSquareIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="overflow-hidden">
          <div className="font-medium truncate">{conversation.title}</div>
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100"
        onClick={handleDelete}
      >
        <Trash2Icon className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
