"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle2, 
  Clock,
  Search,
  Calendar,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Stats {
  totalRevenue: number;
  totalPaid: number;
  totalUnpaid: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  totalPrice: number;
  createdAt: string;
  customer: { name: string };
  payment: { status: string } | null;
}

export default function ReportsPage() {
  const [data, setData] = useState<{ stats: Stats; orders: Order[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?startDate=${startDate}&endDate=${endDate}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleUpdatePayment = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === "LUNAS" ? "BELUM_BAYAR" : "LUNAS";
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status pembayaran");
      
      // Refresh data
      fetchReports();
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Gagal memperbarui status pembayaran");
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#0ddff2]" />
        <span className="text-slate-400 font-medium text-sm">Memuat laporan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 print:p-0 print-section">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <h1 className="text-3xl font-black text-slate-900">LAPORAN PENDAPATAN K20 LAUNDRY</h1>
        <div className="flex justify-between items-end mt-4 text-sm font-bold text-slate-500">
          <p>Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}</p>
          <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Print Summary Table - Only visible when printing */}
      <div className="hidden print:block mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Ringkasan Performa</h2>
        <table className="w-full border-collapse border border-slate-300">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold w-1/3 text-slate-700">Total Pendapatan (Gross)</td>
              <td className="border border-slate-300 p-3 text-xl font-black text-slate-900">Rp {data?.stats.totalRevenue.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold w-1/3 text-slate-700">Total Terbayar (Cash)</td>
              <td className="border border-slate-300 p-3 text-xl font-black text-emerald-600">Rp {data?.stats.totalPaid.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold w-1/3 text-slate-700">Total Tagihan</td>
              <td className="border border-slate-300 p-3 text-xl font-black text-rose-500">Rp {data?.stats.totalUnpaid.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold text-slate-700">Total Pesanan</td>
              <td className="border border-slate-300 p-3 font-bold">{data?.stats.totalOrders} Pesanan</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold text-slate-700">Pesanan Lunas</td>
              <td className="border border-slate-300 p-3 font-bold text-emerald-600">{data?.stats.paidOrders} Pesanan</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 bg-slate-100 font-bold text-slate-700">Pesanan Belum Bayar</td>
              <td className="border border-slate-300 p-3 font-bold text-amber-600">{data?.stats.pendingOrders} Pesanan</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Pendapatan</h1>
          <p className="text-slate-500 font-medium text-sm">Pantau performa bisnis Anda secara realtime.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-600 gap-2 h-11"
          >
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filter - Hidden on Print */}
      <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-card print:hidden">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Dari Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10 h-11 w-[200px] rounded-xl border-border bg-muted/50 focus-visible:ring-[#0ddff2] font-medium"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Sampai Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10 h-11 w-[200px] rounded-xl border-border bg-muted/50 focus-visible:ring-[#0ddff2] font-medium"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={fetchReports}
              className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Tampilkan Laporan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-card overflow-hidden group">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2] group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Total Pendapatan (Gross)</p>
              <h3 className="text-2xl font-black text-foreground leading-none">
                Rp {data?.stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-card overflow-hidden group">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Total Terbayar</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-foreground leading-none">
                  Rp {data?.stats.totalPaid.toLocaleString()}
                </h3>
                <p className="text-[10px] text-emerald-600/70 font-medium leading-tight">
                  Dari {data?.stats.paidOrders} transaksi yang sudah diceklis lunas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-card overflow-hidden group border-2 border-rose-500/20">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-rose-500 font-bold text-xs uppercase tracking-wider">Total Tagihan</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-rose-600 leading-none">
                  Rp {data?.stats.totalUnpaid.toLocaleString()}
                </h3>
                <p className="text-[10px] text-rose-400 font-medium leading-tight italic">
                  *Masuk ke sini jika status transaksi belum diceklis lunas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-muted/30 overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-lg font-black text-foreground">{data?.stats.totalOrders} <span className="text-xs font-medium opacity-50">Order</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-muted/30 overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Pesanan Lunas</p>
              <h3 className="text-lg font-black text-foreground">{data?.stats.paidOrders} <span className="text-xs font-medium opacity-50">Order</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-muted/30 overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Pesanan Belum Bayar</p>
              <h3 className="text-lg font-black text-foreground">{data?.stats.pendingOrders} <span className="text-xs font-medium opacity-50">Order</span></h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[32px] bg-card overflow-hidden">
        <CardHeader className="p-8 border-b border-border bg-muted/30 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Detail Transaksi</CardTitle>
            <CardDescription className="font-medium text-muted-foreground">Menampilkan {data?.orders.length} pesanan dalam periode ini.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tgl Transaksi</th>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">No. Order</th>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Pelanggan</th>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status Bayar</th>
                  <th className="px-8 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center print:hidden">Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-muted-foreground font-medium">
                      Tidak ada transaksi ditemukan untuk periode ini.
                    </td>
                  </tr>
                ) : (
                  data?.orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-medium text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-foreground">{order.orderNumber}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-medium text-muted-foreground">{order.customer.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-[#0ddff2]">Rp {order.totalPrice.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          order.payment?.status === "LUNAS" 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {order.payment?.status || "BELUM_BAYAR"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center print:hidden">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md border-slate-200 text-[#0ddff2] focus:ring-[#0ddff2] cursor-pointer accent-[#0ddff2]"
                            checked={order.payment?.status === "LUNAS"}
                            onChange={() => handleUpdatePayment(order.id, order.payment?.status || "BELUM_BAYAR")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
