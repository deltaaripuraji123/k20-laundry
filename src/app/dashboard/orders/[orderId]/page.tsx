"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Loader2, 
  Printer, 
  ShoppingBag, 
  User, 
  Calendar, 
  Clock, 
  Package,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  note?: string;
  createdAt: string;
  pickupDate: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    subtotal: number;
    service: {
      name: string;
    };
  }[];
  payment?: {
    status: string;
    method: string;
  };
}

const statusColors: Record<string, string> = {
  DITERIMA: "bg-blue-50 text-blue-600 border-blue-100",
  DICUCI: "bg-indigo-50 text-indigo-600 border-indigo-100",
  DIKERINGKAN: "bg-amber-50 text-amber-600 border-amber-100",
  DISETRIKA: "bg-purple-50 text-purple-600 border-purple-100",
  SELESAI: "bg-emerald-50 text-emerald-600 border-emerald-100",
  DIAMBIL: "bg-slate-50 text-slate-600 border-slate-100",
};

interface PageProps {
  params: Promise<{ orderId: string }>;
}

interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string | null;
}

export default function OrderDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${orderId}`),
          fetch("/api/settings")
        ]);

        if (!orderRes.ok) throw new Error("Gagal mengambil data pesanan.");
        if (!settingsRes.ok) throw new Error("Gagal mengambil pengaturan toko.");

        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();

        setOrder(orderData);
        setSettings(settingsData);
      } catch (error: any) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
        <span className="text-slate-400 font-medium text-sm">Memuat detail pesanan...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">Pesanan tidak ditemukan</p>
        <Link href="/dashboard/orders" className="mt-4 inline-block text-[#0ddff2] font-bold hover:underline">
          Kembali ke Daftar Pesanan
        </Link>
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
              <ChevronLeft className="h-5 w-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{order.orderNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                statusColors[order.status]
              )}>
                {order.status}
              </div>
              <span className="text-slate-400 font-medium text-xs">•</span>
              <span className="text-slate-500 font-medium text-xs">Dibuat pada {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={handlePrint}
          className="bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl h-11 px-5 shadow-sm transition-all border-none"
        >
          <Printer className="mr-2 h-4 w-4" />
          Cetak Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Kolom Kiri: Info Pelanggan & Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
                  <User className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">Pelanggan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama</p>
                <p className="font-bold text-slate-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Telepon</p>
                <p className="font-medium text-slate-700">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alamat</p>
                <p className="font-medium text-slate-600 text-sm leading-relaxed">{order.customer.address || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">Waktu</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masuk</p>
                    <p className="text-xs font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimasi</p>
                    <p className="text-xs font-bold text-emerald-600">{new Date(order.pickupDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Rincian Layanan */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2]">
                  <Package className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">Rincian Layanan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Layanan</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Jumlah</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.orderItems.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <span className="font-bold text-slate-800">{item.service.name}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="font-medium text-slate-600">{item.quantity}</span>
                        </td>
                        <td className="px-8 py-5 font-medium text-slate-600 text-sm">
                          Rp {item.price.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 font-bold text-slate-900 text-right">
                          Rp {item.subtotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Ringkasan Total */}
              <div className="p-8 space-y-4">
                {order.note && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Catatan Pesanan</p>
                      <p className="text-sm text-amber-700 font-medium">{order.note}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-400 text-sm font-medium">Subtotal Layanan</span>
                    <span className="text-slate-700 font-bold">Rp {order.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-6 rounded-2xl bg-slate-900 text-white mt-4">
                    <div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Bayar</span>
                      <h3 className="text-3xl font-bold text-[#0ddff2]">Rp {order.totalPrice.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <CreditCard className="w-4 h-4 text-[#0ddff2]" />
                        <span className="text-xs font-bold text-[#0ddff2] uppercase tracking-widest">Status Bayar</span>
                      </div>
                      <span className="inline-flex px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                        {order.payment?.status || "BELUM BAYAR"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Section - Only visible when printing */}
      <div className="hidden print:block p-8 bg-white text-slate-900 min-h-screen invoice-print-container print-section">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">{settings?.name || "K20 LAUNDRY"}</h1>
            <p className="text-sm font-bold text-slate-500 max-w-xs">{settings?.address}</p>
            <p className="text-sm font-bold text-slate-500">{settings?.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-widest">INVOICE</h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No. Pesanan</p>
            <p className="text-lg font-black text-slate-900">{order.orderNumber}</p>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Ditagihkan Kepada</p>
            <h3 className="text-xl font-black text-slate-900 mb-1">{order.customer.name}</h3>
            <p className="text-sm font-bold text-slate-500 mb-1">{order.customer.phone}</p>
            <p className="text-sm font-bold text-slate-500 max-w-xs">{order.customer.address || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tgl. Masuk</p>
              <p className="text-sm font-black text-slate-900">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tgl. Selesai</p>
              <p className="text-sm font-black text-slate-900">{new Date(order.pickupDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status Bayar</p>
              <p className="text-sm font-black text-slate-900">{order.payment?.status || "BELUM BAYAR"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Metode</p>
              <p className="text-sm font-black text-slate-900">{order.payment?.method || "-"}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Layanan</th>
              <th className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Qty</th>
              <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Harga</th>
              <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.orderItems.map((item) => (
              <tr key={item.id}>
                <td className="py-6 font-black text-slate-900">{item.service.name}</td>
                <td className="py-6 text-center font-bold text-slate-500">{item.quantity}</td>
                <td className="py-6 text-right font-bold text-slate-500">Rp {item.price.toLocaleString()}</td>
                <td className="py-6 text-right font-black text-slate-900">Rp {item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900">
              <td colSpan={3} className="py-6 text-right text-sm font-black uppercase tracking-widest text-slate-400">Total Keseluruhan</td>
              <td className="py-6 text-right text-2xl font-black text-[#0bbdc9]">Rp {order.totalPrice.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        {/* Note & Footer */}
        <div className="grid grid-cols-2 gap-12 pt-12">
          <div>
            {order.note && (
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Catatan</p>
                <p className="text-sm font-bold text-slate-600 italic">"{order.note}"</p>
              </div>
            )}
          </div>
          <div className="text-center flex flex-col items-center justify-end">
            <p className="text-sm font-bold text-slate-400 mb-20 uppercase tracking-[0.2em]">Hormat Kami,</p>
            <div className="w-48 border-b-2 border-slate-900 mb-2"></div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{settings?.name || "K20 LAUNDRY"}</p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Terima kasih telah mempercayakan cucian Anda kepada kami</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
