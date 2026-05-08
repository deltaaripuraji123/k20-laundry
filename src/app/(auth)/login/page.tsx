"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Loader2,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        alert("Login gagal, periksa email dan password.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8f8] px-4 py-8 sm:px-6">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-[-20%] top-[-10%] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl sm:h-[500px] sm:w-[500px]" />

        <div className="absolute bottom-[-10%] right-[-20%] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl sm:h-[500px] sm:w-[500px]" />
      </div>

      {/* CONTAINER */}
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="mb-8 flex flex-col items-center sm:mb-10">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
              <Sparkles className="h-6 w-6 text-cyan-400 sm:h-7 sm:w-7" />
            </div>

            <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              K20
              <span className="text-cyan-400">Laundry</span>
            </span>
          </Link>
        </div>

        {/* CARD */}
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <CardHeader className="space-y-2 px-6 pb-4 pt-8 text-center sm:px-10 sm:pt-10">
            <CardTitle className="text-2xl font-black text-slate-900 sm:text-3xl">
              Selamat Datang
            </CardTitle>

            <CardDescription className="text-sm font-medium text-slate-500 sm:text-base">
              Masuk untuk mengelola laundry Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700"
                >
                  Email Address
                </Label>

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-400" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/70 pl-12 text-base focus-visible:ring-2 focus-visible:ring-cyan-400 sm:h-14"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700"
                  >
                    Password
                  </Label>

                  <button
                    type="button"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>

                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-400" />

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/70 pl-12 text-base focus-visible:ring-2 focus-visible:ring-cyan-400 sm:h-14"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-12 w-full rounded-2xl border-none bg-cyan-400 text-base font-black text-slate-900 shadow-lg shadow-cyan-400/20 transition-all hover:opacity-90 sm:h-14 sm:text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk Sekarang

                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs font-medium text-slate-400 sm:mt-8">
          © {new Date().getFullYear()} K20 Laundry.
          Clean with love.
        </p>
      </div>
    </div>
  );
}