"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Nomor telepon harus minimal 10 digit.",
    })
    .max(15, {
      message: "Nomor telepon tidak boleh lebih dari 15 digit.",
    })
    .regex(/^\+?[0-9\s-]+$/, {
      message: "Nomor telepon tidak valid.",
    }),
  address: z.string().optional(),
});

export default function NewCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambah pelanggan.");
      }

      showToast("Pelanggan berhasil ditambahkan!", "success");
      
      // Tunggu sebentar agar user bisa melihat toast sukses, lalu pindah halaman
      setTimeout(() => {
        router.push("/dashboard/customers");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      showToast(error.message, "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Custom Toast Message */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border-none ${
          toast.type === "success" ? "bg-slate-900 text-[#0ddff2]" : "bg-red-500 text-white"
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === "success" ? "bg-[#0ddff2]" : "bg-white"}`} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tambah Pelanggan</h1>
          <p className="text-slate-500 font-medium text-sm">Lengkapi data pelanggan baru Anda.</p>
        </div>
      </div>

      <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Data Personal</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs ml-1 uppercase tracking-wider">Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Budi Santoso" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] font-medium px-4" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs ml-1 uppercase tracking-wider">Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="0812xxxxxx" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] font-medium px-4" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs ml-1 uppercase tracking-wider">Alamat Lengkap (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Jl. Raya No. 123..." className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] font-medium px-4" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 h-12 rounded-xl bg-[#0ddff2] text-slate-900 font-bold hover:bg-[#0bcad8] transition-all border-none shadow-lg shadow-[#0ddff2]/20" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Pelanggan
                    </>
                  )}
                </Button>
                <Link href="/dashboard/customers" className="flex-1">
                  <Button variant="outline" type="button" className="w-full h-12 rounded-xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
