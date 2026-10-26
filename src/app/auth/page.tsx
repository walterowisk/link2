"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
              full_name: fullName || username,
            },
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({
            type: "success",
            text: "Cadastro realizado com sucesso! Redirecionando para o seu dashboard...",
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Ocorreu um erro ao conectar ao Supabase.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950 relative overflow-hidden">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-3 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Link2 Platform
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isSignUp ? "Crie sua conta Link2" : "Bem-vindo de volta"}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {isSignUp
              ? "Monte sua página de links personalizada em poucos minutos."
              : "Acesse seu painel para gerenciar seus links e temas."}
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  !isSignUp
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  isSignUp
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Cadastrar
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {message && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  message.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                    : "bg-rose-950/80 border border-rose-800 text-rose-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Nome Completo</Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                      <Input
                        type="text"
                        placeholder="Ex: Ana Clara"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-9"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Username desejado</Label>
                    <div className="relative">
                      <span className="text-xs text-zinc-500 absolute left-3 top-3.5 font-mono">
                        @
                      </span>
                      <Input
                        type="text"
                        placeholder="anaclara"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-7 font-mono"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">E-mail</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <Input
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Senha</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/25 mt-2"
              >
                {loading
                  ? "Carregando..."
                  : isSignUp
                  ? "Criar Minha Conta"
                  : "Acessar Conta"}
              </Button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <span className="relative px-3 bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider">
                Ou teste sem login
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDemoAccess}
              className="w-full h-11 border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> Acessar Dashboard em Modo Demonstração
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
