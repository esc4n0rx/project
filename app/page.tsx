"use client";

import { motion } from "framer-motion";
import { Film, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
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
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Registrar</Button>
            </Link>
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
            Sincronize seus momentos,Assistam Juntos
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12"
          >
            Desfrute de filmes e series em perfeita sincronia com os seus amigos, independentemente do local onde se encontrem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/auth/register">
              <Button size="lg" className="text-lg">
                Vamos Começar
              </Button>
            </Link>
          </motion.div>
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
              Veja conteúdos em perfeita sincronia com os seus amigos, com coordenação automática de pausa e reprodução.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Virtual Watch Parties</h3>
            <p className="text-muted-foreground">
            Crie salas privadas e convide amigos para se juntarem à sua sessão de visualização.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <MessageSquare className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground">
              Partilhe reacções e discuta em tempo real com as funcionalidades de chat integradas.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}