import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Party {
  id: string;
  name: string;
  seats: number;
  color: string;
  visible: boolean;
}

interface RecentResult {
  constituency: string;
  result: string;
  partyColor: string;
  partyId: string;
}

interface ElectionData {
  theme: string;
  headline: string;
  subheadline: string;
  breaking: boolean;
  mode: string;
  tickerMode: string;
  primaryColor: string;
  darkColor: string;
  logoTitle: string;
  logoTextClass: string;
  bbcBoxesClass: string;
  crystalUrl?: string;
  parties: Party[];
  majorityTarget: number;
  tickerItems: string[];
  recentResults: RecentResult[];
}

export function useElectionData() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetch("/api/data")
      .then((res) => res.json())
      .then((initialData) => setData(initialData));

    // Connect to websocket
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("data_update", (updatedData: ElectionData) => {
      setData(updatedData);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const updateData = async (newData: Partial<ElectionData>) => {
      await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
  };

  return { data, updateData };
}
