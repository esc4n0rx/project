"use client";

import { motion } from "framer-motion";
import { Plus, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Room, User } from "@/lib/types";

export type CreateRoomResponse = {
  room_id?: number;
  error?: string;
};

export default function Salas() {
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [roomCode, setRoomCode] = useState<string>("");
  const [privateRoomName, setPrivateRoomName] = useState<string>("");
  const [publicRoomName, setPublicRoomName] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/public");
        const data: Room[] = await res.json();
        setPublicRooms(data);
      } catch (err) {
        console.error("Erro ao carregar salas públicas:", err);
      }
    };
    fetchRooms();
  }, []);

  const getUserIdByNickname = async (nickname: string): Promise<number | null> => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/user-by-nickname?nickname=${nickname}`);
      const data = await res.json();
      if (res.ok && data.id) {
        return data.id;
      } else {
        alert(data.error || "Erro ao buscar ID do usuário");
        return null;
      }
    } catch (err) {
      console.error("Erro ao buscar ID do usuário:", err);
      return null;
    }
  };
  
  const handleCreateRoom = async (
    isPrivate: boolean,
    roomName: string,
    password?: string
  ) => {
    try {
      const storedUser = localStorage.getItem("user");
      const user: { nickname: string } | null = storedUser ? JSON.parse(storedUser) : null;
  
      if (!user) {
        alert("Usuário não autenticado!");
        return;
      }
  
      const userId = await getUserIdByNickname(user.nickname);
      if (!userId) {
        return; 
      }
  
      if (!roomName.trim()) {
        alert("Digite um nome para a sala!");
        return;
      }
  
      const res = await fetch("http://localhost:4000/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName,
          is_private: isPrivate,
          password: isPrivate ? password : null,
          created_by: userId, 
        }),
      });
  
      const data: CreateRoomResponse = await res.json();
      if (res.ok && data.room_id) {
        router.push(`/salas/${data.room_id}`);
      } else {
        alert(data.error || "Erro ao criar sala");
      }
    } catch (err) {
      console.error("Erro ao criar sala:", err);
    }
  };
  

  const handleJoinRoom = async () => {
    try {
      if (!roomCode.trim()) {
        alert("Digite um código de sala válido!");
        return;
      }
  
      const storedUser = localStorage.getItem("user");
      const user: { nickname: string } | null = storedUser ? JSON.parse(storedUser) : null;
  
      if (!user) {
        alert("Usuário não autenticado!");
        return;
      }
  
      const userId = await getUserIdByNickname(user.nickname);
      if (!userId) {
        return; 
      }
  
      console.log("Tentando entrar na sala:", { room_id: roomCode, user_id: userId });
  
      const res = await fetch("http://localhost:4000/api/auth/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomCode,
          user_id: userId,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        console.log("Entrada bem-sucedida na sala:", data);
        router.push(`/salas/${roomCode}`);
      } else {
        console.error("Erro ao entrar na sala:", data);
        alert(data.error || "Erro ao entrar na sala");
      }
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <nav className="fixed w-full z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
              CineSync - Salas
            </span>
          </motion.div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"
          >
            Escolha sua experiência
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            Crie ou entre em salas e compartilhe momentos com seus amigos!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-lg border bg-card text-center"
          >
            <input
              type="text"
              placeholder="Nome da Sala Privada"
              value={privateRoomName}
              onChange={(e) => setPrivateRoomName(e.target.value)}
              className="mb-4 p-2 w-full border rounded"
            />
            <input
              type="password"
              placeholder="Senha (opcional)"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="mb-4 p-2 w-full border rounded"
            />
            <Button
              onClick={() => handleCreateRoom(true, privateRoomName, roomPassword)}
            >
              Criar Sala Privada
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-lg border bg-card text-center"
          >
            <input
              type="text"
              placeholder="Nome da Sala Pública"
              value={publicRoomName}
              onChange={(e) => setPublicRoomName(e.target.value)}
              className="mb-4 p-2 w-full border rounded"
            />
            <Button
              onClick={() => handleCreateRoom(false, publicRoomName)}
            >
              Criar Sala Pública
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-lg border bg-card text-center"
          >
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Código da Sala"
              className="w-full mb-4 p-2 border rounded"
            />
            <Button onClick={handleJoinRoom}>Entrar</Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
