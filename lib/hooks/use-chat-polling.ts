"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getChatMessages, sendMessage, type ChatMessage } from "@/lib/api";

interface UseChatPollingOptions {
  chatId: string;
  enabled?: boolean;
  pollingInterval?: number; // in ms
}

interface UseChatPollingReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendNewMessage: (content: string, fileUrl?: string, fileType?: string) => Promise<void>;
  isSending: boolean;
  refetch: () => Promise<void>;
}

export function useChatPolling({
  chatId,
  enabled = true,
  pollingInterval = 5000, // Poll every 5 seconds
}: UseChatPollingOptions): UseChatPollingReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId || !enabled) return;

    try {
      const data = await getChatMessages(chatId);
      
      // Only update if there are new messages
      const newLastId = data[data.length - 1]?.id;
      if (newLastId !== lastMessageIdRef.current) {
        setMessages(data);
        lastMessageIdRef.current = newLastId;
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Nachrichten");
    } finally {
      setIsLoading(false);
    }
  }, [chatId, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Polling
  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(fetchMessages, pollingInterval);
    return () => clearInterval(intervalId);
  }, [enabled, pollingInterval, fetchMessages]);

  const sendNewMessage = useCallback(
    async (content: string, fileUrl?: string, fileType?: string) => {
      if (!chatId) return;

      setIsSending(true);
      try {
        const newMessage = await sendMessage(chatId, { content, fileUrl, fileType });
        setMessages((prev) => [...prev, newMessage]);
        lastMessageIdRef.current = newMessage.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Senden");
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [chatId]
  );

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendNewMessage,
    isSending,
    refetch,
  };
}

