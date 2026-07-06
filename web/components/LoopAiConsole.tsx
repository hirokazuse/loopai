"use client";

import { useConversation } from "@/hooks/useConversation";
import styles from "./LoopAiConsole.module.css";

export function LoopAiConsole() {
  const {
    ask,
    connectorId,
    connectors,
    error,
    isAskDisabled,
    isStopDisabled,
    prompt,
    response,
    setConnectorId,
    setPrompt,
    statusLabel,
    statusLog,
    stop,
  } = useConversation();

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <h1>LoopAI</h1>
      </header>

      <section className={styles.section}>
        <label className={styles.label} htmlFor="connector">
          Connector
        </label>
        <select
          className={styles.select}
          id="connector"
          value={connectorId}
          onChange={(event) => setConnectorId(event.target.value as typeof connectorId)}
        >
          {connectors.map((connector) => (
            <option disabled={connector.disabled} key={connector.id} value={connector.id}>
              {connector.label}
            </option>
          ))}
        </select>
      </section>

      <section className={styles.section}>
        <h2>Conversation Status</h2>
        <p className={styles.status}>{statusLabel}</p>
      </section>

      <section className={styles.section}>
        <label className={styles.label} htmlFor="prompt">
          Prompt
        </label>
        <textarea
          className={styles.prompt}
          id="prompt"
          rows={6}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className={styles.actions}>
          <button className={styles.primaryButton} disabled={isAskDisabled} onClick={ask} type="button">
            Ask
          </button>
          <button className={styles.secondaryButton} disabled={isStopDisabled} onClick={stop} type="button">
            Stop
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Response</h2>
        <div className={styles.response}>{response || " "}</div>
      </section>

      <section className={styles.section}>
        <h2>Status Log</h2>
        {error ? <p className={styles.error}>{error}</p> : null}
        <ol className={styles.log}>
          {statusLog.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
