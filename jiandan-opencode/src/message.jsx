import { createContext, useContext, useState, useCallback } from 'react';
import DivMessage from '@nce/eview-react/DivMessage';

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const showMessage = useCallback((type, text) => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [...prev, { id, type, text }]);
    setTimeout(() => removeMessage(id), 3000);
  }, [removeMessage]);

  const message = {
    success: (text) => showMessage("success", text),
    error: (text) => showMessage("error", text),
    warn: (text) => showMessage("warn", text),
    info: (text) => showMessage("default", text),
  };

  return (
    <MessageContext.Provider value={{ message }}>
      {children}
      <div className="app-message-container">
        {messages.map((m) => (
          <DivMessage key={m.id} display type={m.type}>
            {m.text}
          </DivMessage>
        ))}
      </div>
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const ctx = useContext(MessageContext);
  return ctx ? ctx.message : { success: () => {}, error: () => {}, warn: () => {}, info: () => {} };
}
