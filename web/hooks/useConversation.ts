"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { askEngine, getEngineStatus, stopEngine } from "@/services/engine";
import type { ConnectorOption, ConversationStatus, StatusLabel } from "@/types/conversation";

const POLL_INTERVAL_MS = 1500;

const STATUS_LABELS: Record<ConversationStatus, StatusLabel> = {
  idle: "Idle",
  generating: "Generating",
  interrupted: "Interrupted",
  waitingUser: "WaitingUser",
};

export function useConversation() {
  const [connectorId, setConnectorId] = useState<ConnectorOption["id"]>("chatgpt");
  const [status, setStatus] = useState<ConversationStatus>("idle");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [statusLog, setStatusLog] = useState<string[]>(["Idle"]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const connectors = useMemo<ConnectorOption[]>(
    () => [
      {
        id: "chatgpt",
        label: "ChatGPT",
      },
    ],
    []
  );

  const pushLog = useCallback((message: string) => {
    setStatusLog((current) => {
      const next = [`${new Date().toLocaleTimeString()} ${message}`, ...current];
      return next.slice(0, 20);
    });
  }, []);

  const applyStatus = useCallback(
    (nextStatus: ConversationStatus, text?: string) => {
      setStatus((current) => {
        if (current !== nextStatus) {
          pushLog(`Status: ${STATUS_LABELS[nextStatus]}`);
        }
        return nextStatus;
      });

      if (typeof text === "string") {
        setResponse(text);
      }
    },
    [pushLog]
  );

  const refreshStatus = useCallback(async () => {
    try {
      const result = await getEngineStatus();
      applyStatus(result.status, result.text);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to read engine status";
      setError(message);
    }
  }, [applyStatus]);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void refreshStatus();
    }, 0);
    const timer = window.setInterval(() => {
      void refreshStatus();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refreshStatus]);

  const ask = useCallback(async () => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt || isSubmitting || status === "generating") return;

    setIsSubmitting(true);
    setError(null);
    pushLog("Ask requested");

    try {
      const result = await askEngine(nextPrompt);
      applyStatus(result.status);
      setPrompt("");
      await refreshStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ask failed";
      setError(message);
      pushLog(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyStatus, isSubmitting, prompt, pushLog, refreshStatus, status]);

  const stop = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    pushLog("Stop requested");

    try {
      const result = await stopEngine();
      applyStatus(result.status, result.partial);
      await refreshStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Stop failed";
      setError(message);
      pushLog(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyStatus, isSubmitting, pushLog, refreshStatus]);

  return {
    ask,
    connectorId,
    connectors,
    error,
    isAskDisabled: !prompt.trim() || isSubmitting || status === "generating",
    isStopDisabled: isSubmitting || status !== "generating",
    prompt,
    response,
    setConnectorId,
    setPrompt,
    statusLabel: STATUS_LABELS[status],
    statusLog,
    stop,
  };
}
