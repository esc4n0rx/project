"use client";

import { motion } from "framer-motion";
import { Film, Users, MessageSquare, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Função de login
const handleLogin = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data)); // Salvar o usuário no localStorage
      window.location.reload(); // Atualizar a página para exibir o estado logado
    } else {
      alert(data.error || "Erro ao logar");
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao conectar ao servidor");
  }
};

// Função de registro
const handleRegister = async (
  name: string,
  email: string,
  password: string,
  nickname: string
) => {
  try {
    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, nickname }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data)); 
      window.location.reload(); 
    } else {
      alert(data.error || "Erro ao registrar");
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao conectar ao servidor");
  }
};

export default function Home() {
  const [user, setUser] = useState<any>(null); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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
              CineSync
            </span>
          </motion.div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <User className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{user.nickname}</span>
                </div>
                <div className="absolute right-0 mt-2 bg-card rounded shadow-md hidden group-hover:block">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
                  >
                    <LogOut className="inline-block mr-2" /> Sair
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                  Login
                </Button>
                <Button onClick={() => setShowRegisterModal(true)}>
                  Registrar
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"
          >
            Sincronize seus momentos, Assistam Juntos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12"
          >
            Desfrute de filmes e séries em perfeita sincronia com os seus amigos,
            independentemente do local onde se encontrem.
          </motion.p>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="text-lg"
                onClick={() => router.push("/salas")}
              >
                Vamos Começar
              </Button>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <div className="p-6 rounded-lg border bg-card">
            <Film className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reprodução sincronizada</h3>
            <p className="text-muted-foreground">
              Veja conteúdos em perfeita sincronia com os seus amigos, com
              coordenação automática de pausa e reprodução.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Virtual Watch Parties</h3>
            <p className="text-muted-foreground">
              Crie salas privadas e convide amigos para se juntarem à sua sessão
              de visualização.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <MessageSquare className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground">
              Partilhe reações e discuta em tempo real com as funcionalidades de
              chat integradas.
            </p>
          </div>
        </motion.div>
      </main>
     {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 p-2 w-full border rounded"
              id="login-email"
            />
            <input
              type="password"
              placeholder="Senha"
              className="mb-3 p-2 w-full border rounded"
              id="login-password"
            />
            <Button
              onClick={() =>
                handleLogin(
                  (document.getElementById("login-email") as HTMLInputElement).value,
                  (document.getElementById("login-password") as HTMLInputElement).value
                )
              }
            >
              Entrar
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLoginModal(false)}
              className="mt-2"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Registrar</h2>
            <input
              type="text"
              placeholder="Nome"
              className="mb-3 p-2 w-full border rounded"
              id="register-name"
            />
            <input
              type="text"
              placeholder="Nickname"
              className="mb-3 p-2 w-full border rounded"
              id="register-nickname"
            />
            <input
              type="email"
              placeholder="Email"
              className="mb-3 p-2 w-full border rounded"
              id="register-email"
            />
            <input
              type="password"
              placeholder="Senha"
              className="mb-3 p-2 w-full border rounded"
              id="register-password"
            />
            <Button
              onClick={() =>
                handleRegister(
                  (document.getElementById("register-name") as HTMLInputElement).value,
                  (document.getElementById("register-email") as HTMLInputElement).value,
                  (document.getElementById("register-password") as HTMLInputElement).value,
                  (document.getElementById("register-nickname") as HTMLInputElement).value
                )
              }
            >
              Registrar
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRegisterModal(false)}
              className="mt-2"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}