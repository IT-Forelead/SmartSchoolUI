"use client";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function WebSocketDemo() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState("ws://25-school.uz/school/api/v1/ws");
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("wss://25-school.uz/school/api/v1/ws"),
    []
  );

  const handleClickSendMessage = useCallback(
    () => sendMessage("Hello Surojiddin"),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <div className="bg-slate-400">
        <button
          className="block cursor-pointer"
          onClick={handleClickChangeSocketUrl}
        >
          Click Me to change Socket Url
        </button>
        <button
          className="block"
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : ""}
        {lastMessage ? <span>Data: {JSON.parse(lastMessage.data).barcodeId}</span> : ""}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message?.data : ""}</span>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        
      </div>
    </div>
  );
}
