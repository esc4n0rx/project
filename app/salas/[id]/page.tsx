"use client";

import { motion } from "framer-motion";
import { Film, UserX, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Room, User } from "@/lib/types";

export default function Sala() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        let storedUser = localStorage.getItem("user");
        let loggedUser = storedUser ? JSON.parse(storedUser) : null;
  
        // Verifica e obtém o ID do usuário pelo nickname, se necessário
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
  
        // Buscar detalhes da sala
        const res = await fetch(`http://localhost:4000/api/auth/room/${id}`);
        if (!res.ok) {
          throw new Error("Sala não encontrada");
        }
  
        const data = await res.json();
        setRoom(data.room);
        setParticipants(data.participants);
      } catch (err) {
        console.error("Erro ao carregar informações da sala:", err);
        router.push("/salas");
      }
    };
  
    fetchRoomDetails();
  }, [id, router]);
  

  const handleRemoveParticipant = async (participantId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/${id}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: participantId }),
      });

      if (res.ok) {
        setParticipants((prev) =>
          prev.filter((participant) => participant.id !== participantId)
        );
      } else {
        alert("Erro ao remover participante");
      }
    } catch (err) {
      console.error("Erro ao remover participante:", err);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/salas");
      } else {
        alert("Erro ao deletar sala");
      }
    } catch (err) {
      console.error("Erro ao deletar sala:", err);
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
            <Film className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
              {room?.name || "Sala"}
            </span>
          </motion.div>
          <div>
            {user && room?.created_by === user.id && (
              <Button variant="destructive" onClick={handleDeleteRoom}>
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
            {room?.is_private && (
              <p className="text-muted-foreground mb-4">
                Senha: <span className="font-bold">{room?.password}</span>
              </p>
            )}
          </div>
        </motion.div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Participantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="p-4 border rounded-lg bg-card flex items-center justify-between"
              >
                <span className="text-lg font-semibold">
                  {participant.nickname}
                </span>
                {room?.created_by === user?.id && participant.id !== user?.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.id)}
                  >
                    <UserX className="mr-2" /> Remover
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
