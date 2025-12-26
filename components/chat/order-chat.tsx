"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Play,
  Pause,
  Download,
  File,
  Image as ImageIcon,
  Music,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  fileUrl?: string;
  fileType?: "audio" | "image" | "document";
  fileName?: string;
  isSystemMessage?: boolean;
  createdAt: Date;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

interface OrderChatProps {
  orderId: string;
  currentUserId: string;
  participants: Participant[];
  messages: Message[];
  onSendMessage: (content: string) => void;
  onFileUpload?: (file: File) => void;
  className?: string;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Heute";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Gestern";
  } else {
    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
    }).format(date);
  }
}

function MessageBubble({
  message,
  isOwn,
  showAvatar,
}: {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (message.isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 mb-4", isOwn && "flex-row-reverse")}
    >
      {/* Avatar */}
      {showAvatar ? (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {message.senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8" />
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[70%] space-y-1",
          isOwn && "items-end"
        )}
      >
        {showAvatar && !isOwn && (
          <p className="text-xs text-muted-foreground ml-1">
            {message.senderName}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted rounded-bl-sm"
          )}
        >
          {/* File Attachment */}
          {message.fileUrl && (
            <div className="mb-2">
              {message.fileType === "audio" && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/10">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="h-8 flex items-center gap-0.5">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-current opacity-60"
                          style={{
                            height: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs opacity-70">{message.fileName}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="w-8 h-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {message.fileType === "image" && (
                <img
                  src={message.fileUrl}
                  alt={message.fileName}
                  className="rounded-lg max-w-full"
                />
              )}
              {message.fileType === "document" && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/10">
                  <File className="w-8 h-8" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message.fileName}</p>
                    <p className="text-xs opacity-70">Dokument</p>
                  </div>
                  <Button size="icon" variant="ghost" className="w-8 h-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Text */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Time & Status */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground px-1",
            isOwn && "justify-end"
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && message.status && (
            <>
              {message.status === "sending" && (
                <Clock className="w-3 h-3" />
              )}
              {message.status === "sent" && <Check className="w-3 h-3" />}
              {message.status === "delivered" && (
                <CheckCheck className="w-3 h-3" />
              )}
              {message.status === "read" && (
                <CheckCheck className="w-3 h-3 text-primary" />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function OrderChat({
  orderId,
  currentUserId,
  participants,
  messages,
  onSendMessage,
  onFileUpload,
  className,
}: OrderChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  messages.forEach((message) => {
    const dateStr = formatDate(message.createdAt);
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      groupedMessages.push({ date: dateStr, messages: [message] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  // Check if should show avatar (different sender than previous)
  const shouldShowAvatar = (message: Message, index: number, group: Message[]) => {
    if (index === 0) return true;
    return group[index - 1].senderId !== message.senderId;
  };

  return (
    <div className={cn("flex flex-col h-full bg-card rounded-xl border border-border", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {participants.slice(0, 2).map((participant) => (
              <Avatar key={participant.id} className="w-8 h-8 border-2 border-background">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {participant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div>
            <p className="font-medium text-sm">
              {participants.map((p) => p.name).join(", ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {participants.some((p) => p.isOnline) ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Medien anzeigen</DropdownMenuItem>
            <DropdownMenuItem>Suchen</DropdownMenuItem>
            <DropdownMenuItem>Chat stummschalten</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <AnimatePresence>
          {groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{group.date}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Messages */}
              {group.messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  showAvatar={shouldShowAvatar(message, index, group.messages)}
                />
              ))}
            </div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span>tippt...</span>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="audio/*,image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nachricht schreiben..."
              className="pr-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
            >
              <Smile className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            size="icon"
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

