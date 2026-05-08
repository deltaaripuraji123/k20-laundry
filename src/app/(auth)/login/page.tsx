"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, Lock, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        alert("Login Gagal! Periksa email dan password Anda.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f8f8] p-4 font-sans overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0ddff2]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0ddff2]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-[#0ddff2]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-100">
              <Sparkles className="w-8 h-8 text-[#0ddff2]" />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              K20<span className="text-[#0ddff2]">Laundry</span>
            </span>
          </Link>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-3 pt-10 px-10 text-center">
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium text-base">
              Masuk untuk mengelola cucian kesayangan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-widest text-[10px]"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0ddff2] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <Label
                    htmlFor="password"
                    className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]"
                  >
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-[10px] font-black text-[#0ddff2] hover:underline uppercase tracking-widest"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0ddff2] transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-[#0ddff2] text-slate-900 font-black text-lg hover:opacity-90 shadow-lg shadow-[#0ddff2]/20 transition-all border-none group mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-50 p-8 bg-slate-50/50"></CardFooter>
        </Card>

        <p className="text-center mt-10 text-slate-400 text-xs font-medium">
          © {new Date().getFullYear()} K20 Laundry. Clean with love.
        </p>
      </div>
    </div>
  );
}
