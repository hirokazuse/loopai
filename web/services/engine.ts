import type {
  EngineAskResponse,
  EngineStatusResponse,
  EngineStopResponse,
} from "@/types/conversation";

const ENGINE_BASE_URL = process.env.NEXT_PUBLIC_ENGINE_BASE_URL ?? "http://localhost:5000";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${ENGINE_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Engine request failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<T>;
}

export function askEngine(prompt: string): Promise<EngineAskResponse> {
  return requestJson<EngineAskResponse>("/ask", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

export function stopEngine(): Promise<EngineStopResponse> {
  return requestJson<EngineStopResponse>("/stop", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function getEngineStatus(): Promise<EngineStatusResponse> {
  return requestJson<EngineStatusResponse>("/status");
}
