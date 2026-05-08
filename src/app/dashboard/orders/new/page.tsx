"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Loader2, 
  Save, 
  ShoppingBag, 
  User, 
  Trash2, 
  Plus,
  Package
} from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  type: string;
}

const formSchema = z.object({
  customerId: z.string().min(1, "Pilih pelanggan"),
  pickupDate: z.string().min(1, "Pilih tanggal ambil"),
  note: z.string().optional(),
});

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orderItems, setOrderItems] = useState<{serviceId: string, quantity: number, price: number, name: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Default H+2
      note: "",
    },
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, servRes] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/services")
        ]);
        const custData = await custRes.json();
        const servData = await servRes.json();
        setCustomers(custData);
        setServices(servData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setOrderItems([...orderItems, { 
      serviceId: service.id, 
      name: service.name, 
      price: service.price, 
      quantity: 1 
    }]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = qty;
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (orderItems.length === 0) {
      showToast("Pilih minimal satu layanan", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: orderItems.map(item => ({
            ...item,
            subtotal: item.price * item.quantity
          })),
          totalPrice: calculateTotal()
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat pesanan.");

      showToast("Pesanan berhasil dibuat!", "success");
      setTimeout(() => {
        router.push("/dashboard/orders");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      showToast(error.message, "error");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
        <span className="text-slate-400 font-medium text-sm">Menyiapkan form pesanan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
          toast.type === "success" ? "bg-slate-900 text-[#0ddff2]" : "bg-red-500 text-white"
        }`}>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Buat Pesanan Baru</h1>
          <p className="text-slate-500 font-medium text-sm">Input detail cucian dan layanan pelanggan.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Info Pelanggan & Tanggal */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
                    <User className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Pelanggan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs uppercase tracking-wider ml-1">Nama Pelanggan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-[#0ddff2] font-medium">
                            <SelectValue placeholder="Pilih Pelanggan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          {customers.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="rounded-lg">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs uppercase tracking-wider ml-1">Estimasi Ambil</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-[#0ddff2] font-medium px-4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 font-bold text-xs uppercase tracking-wider ml-1">Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jangan campur baju luntur" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-[#0ddff2] font-medium px-4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Daftar Item Layanan */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Daftar Layanan</CardTitle>
                    <CardDescription className="font-medium text-slate-400">Pilih layanan yang akan diproses.</CardDescription>
                  </div>
                </div>
                <Select onValueChange={addItem}>
                  <SelectTrigger className="w-[180px] h-10 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase">
                    <SelectValue placeholder="Tambah Item" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Layanan</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Jumlah (Kg/Pcs)</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Harga</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subtotal</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orderItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                            Belum ada layanan yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        orderItems.map((item, index) => (
                          <tr key={index} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-5">
                              <span className="font-bold text-slate-800">{item.name}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <Input 
                                  type="number" 
                                  value={item.quantity} 
                                  onChange={(e) => updateQuantity(index, Number(e.target.value))}
                                  className="w-20 h-9 rounded-lg border-slate-100 text-center font-bold"
                                />
                              </div>
                            </td>
                            <td className="px-8 py-5 font-medium text-slate-600">
                              Rp {item.price.toLocaleString()}
                            </td>
                            <td className="px-8 py-5 font-bold text-slate-900">
                              Rp {(item.price * item.quantity).toLocaleString()}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-slate-300 hover:text-red-500"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Ringkasan Total */}
                <div className="p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 rounded-b-[32px]">
                  <div>
                    <span className="text-slate-400 text-sm font-medium">Total Pembayaran</span>
                    <h3 className="text-3xl font-bold text-[#0ddff2]">Rp {calculateTotal().toLocaleString()}</h3>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto h-12 px-10 rounded-xl bg-[#0ddff2] text-slate-900 font-bold hover:bg-[#0bcad8] transition-all border-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Proses Pesanan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
