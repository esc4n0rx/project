"use client";

import { motion } from "framer-motion";
import { Film, UserX, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Room, User } from "@/lib/types";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });


interface PlayerEventData {
  timestamp: number;
  content_url?: string;
  content_type?: string;
}

export default function Sala() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [contentUrl, setContentUrl] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(0);

  const playerRef = useRef<any>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    const fetchRoomDetails = async () => {
      try {
        let storedUser = localStorage.getItem("user");
        let loggedUser = storedUser ? JSON.parse(storedUser) : null;

        if (loggedUser && !loggedUser.id) {
          const res = await fetch(
            `http://localhost:4000/api/auth/user-by-nickname?nickname=${loggedUser.nickname}`
          );
          const data = await res.json();

          if (res.ok && data.id) {
            loggedUser = { ...loggedUser, id: data.id };
            localStorage.setItem("user", JSON.stringify(loggedUser));
          } else {
            throw new Error(data.error || "Erro ao buscar ID do usuário");
          }
        }

        setUser(loggedUser);

        const res = await fetch(`http://localhost:4000/api/auth/room/${id}`);
        if (!res.ok) {
          throw new Error("Sala não encontrada");
        }

        const data = await res.json();
        setRoom(data.room);
        setParticipants(data.participants);
        setContentUrl(data.room.content_url || "");
        setContentType(data.room.content_type || "");
        setTimestamp(data.room.current_timestamp || 0);
        setIsPaused(data.room.is_paused || true);
      } catch (err) {
        console.error("Erro ao carregar informações da sala:", err);
        router.push("/salas");
      }
    };

    fetchRoomDetails();

    return () => {
      socket.current.disconnect();
    };
  }, [id, router]);

  const handleSetContent = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/salas/${id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          content_url: contentUrl,
          content_type: contentType,
          current_timestamp: 0,
        }),
      });

      if (res.ok) {
        socket.current.emit("setContent", { room: id, contentUrl, contentType, timestamp: 0 });
      } else {
        alert("Erro ao configurar conteúdo");
      }
    } catch (err) {
      console.error("Erro ao configurar conteúdo:", err);
    }
  };

  const handlePlay = () => {
    setIsPaused(false);
    socket.current.emit("play", { room: id, timestamp: playerRef.current.getCurrentTime() });
  };

  const handlePause = () => {
    setIsPaused(true);
    socket.current.emit("pause", { room: id, timestamp: playerRef.current.getCurrentTime() });
  };

  const handleSeek = (seconds: number) => {
    playerRef.current.seekTo(seconds, "seconds");
    setTimestamp(seconds);
    socket.current.emit("seek", { room: id, timestamp: seconds });
  };

  useEffect(() => {
    socket.current.on("playerPlay", (data: PlayerEventData) => {
      setIsPaused(false);
      setTimestamp(data.timestamp);
    });

    socket.current.on("playerPause", (data: PlayerEventData) => {
      setIsPaused(true);
      setTimestamp(data.timestamp);
    });
    
    socket.current.on("playerSeek", (data: PlayerEventData) => {
      setTimestamp(data.timestamp);
    });

    socket.current.on("updateContent", (data: PlayerEventData) => {
      setContentUrl(data.content_url || "");
      setContentType(data.content_type || "");
      setTimestamp(data.timestamp);
    });


  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <nav className="fixed w-full z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Film className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
              {room?.name || "Sala"}
            </span>
          </motion.div>
          <div>
            {user && room?.created_by === user.id && (
              <Button variant="destructive" onClick={() => router.push("/salas")}>
                <Trash2 className="mr-2" /> Excluir Sala
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-card p-6 rounded-lg shadow-lg mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">{room?.name}</h1>
            <p className="text-muted-foreground mb-4">
              {room?.is_private ? "Sala Privada" : "Sala Pública"} - Limite de 5
              pessoas
            </p>
          </div>
        </motion.div>

        {room?.created_by === user?.id && (
          <div className="mt-8 text-center">
            <input
              type="text"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              placeholder="URL do conteúdo"
              className="border p-2 rounded w-1/2 mb-2"
            />
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="border p-2 rounded w-1/2 mb-2"
            >
              <option value="">Selecione o tipo</option>
              <option value="youtube">YouTube</option>
              <option value="hls">HLS</option>
            </select>
            <Button onClick={handleSetContent}>Configurar Conteúdo</Button>
          </div>
        )}

        <div className="mt-8">
          <ReactPlayer
            ref={playerRef}
            url={contentUrl}
            playing={!isPaused}
            controls={true}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            className="mx-auto"
          />
        </div>
      </main>
    </div>
  );
}
