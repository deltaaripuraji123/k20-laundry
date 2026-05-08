"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  Eye,
  MoreVertical,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  pickupDate: string;
  customer: {
    name: string;
    phone: string;
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

const nextStatus: Record<string, string> = {
  DITERIMA: "DICUCI",
  DICUCI: "DIKERINGKAN",
  DIKERINGKAN: "DISETRIKA",
  DISETRIKA: "SELESAI",
  SELESAI: "DIAMBIL",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, currentStatus: string) => {
    const status = nextStatus[currentStatus];
    if (!status) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Gagal update status");
      
      fetchOrders();
      showToast(`Status diperbarui ke ${status}`, "success");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const deleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/orders/${orderToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus pesanan");
      }

      setOrderToDelete(null);
      fetchOrders();
      showToast("Pesanan berhasil dihapus", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
        <span className="text-slate-400 font-medium text-sm">Memuat data pesanan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 border-none ${
          toast.type === "success" ? "bg-slate-900 text-[#0ddff2]" : "bg-red-500 text-white"
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === "success" ? "bg-[#0ddff2]" : "bg-white"}`} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pesanan</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola transaksi dan status cucian pelanggan.</p>
        </div>

        <Link href="/dashboard/orders/new">
          <Button className="bg-[#0ddff2] text-slate-900 hover:bg-[#0bcad8] font-bold rounded-xl h-11 px-5 shadow-sm transition-all border-none">
            <Plus className="mr-2 h-4 w-4" />
            Buat Pesanan
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-slate-800">Daftar Transaksi</CardTitle>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nomor invoice atau nama..."
                className="pl-10 h-10 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-slate-100 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Belum ada pesanan masuk</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider pl-6 py-4">Invoice & Pelanggan</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Tanggal Masuk</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Estimasi Selesai</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Total</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-right text-slate-400 font-bold text-[11px] uppercase tracking-wider pr-6 py-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-all border-slate-50 group">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm tracking-tight">{order.orderNumber}</span>
                        <span className="text-slate-500 text-xs font-medium">{order.customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" />
                        {new Date(order.pickupDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-bold text-slate-700 text-sm">
                        Rp {order.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                        statusColors[order.status]
                      )}>
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl p-1">
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aksi Cepat</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            {nextStatus[order.status] && (
                              <DropdownMenuItem 
                                className="cursor-pointer rounded-lg p-2.5 focus:bg-[#0ddff2]/5 transition-colors group"
                                onClick={() => updateStatus(order.id, order.status)}
                              >
                                <RefreshCw className="mr-2.5 h-4 w-4 text-slate-400 group-hover:text-[#0ddff2]" />
                                <span className="font-medium text-slate-700">Update: {nextStatus[order.status]}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/orders/${order.id}`} className="cursor-pointer rounded-lg p-2.5 flex items-center focus:bg-slate-50 transition-colors group">
                                <Eye className="mr-2.5 h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                                <span className="font-medium text-slate-700">Lihat Detail</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem 
                              className="cursor-pointer rounded-lg p-2.5 focus:bg-red-50 text-red-500 transition-colors group"
                              onClick={() => setOrderToDelete(order)}
                            >
                              <Trash2 className="mr-2.5 h-4 w-4 text-red-400 group-hover:text-red-500" />
                              <span className="font-bold">Hapus Pesanan</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 shadow-2xl border-none text-center">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Hapus Pesanan?
            </DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Apakah Anda yakin ingin menghapus pesanan <strong>{orderToDelete?.orderNumber}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3 pt-6">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50"
              onClick={() => setOrderToDelete(null)}
            >
              Batal
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all border-none"
              onClick={deleteOrder}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
