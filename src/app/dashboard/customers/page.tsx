"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onDelete = async () => {
    if (!customerToDelete) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal menghapus pelanggan.");
      }

      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
      showToast("Pelanggan berhasil dihapus!", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
        <span className="text-slate-400 font-medium text-sm">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Custom Toast Message */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border-none ${
          toast.type === "success" ? "bg-slate-900 text-[#0ddff2]" : "bg-red-500 text-white"
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === "success" ? "bg-[#0ddff2]" : "bg-white"}`} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pelanggan</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola database pelanggan Anda.</p>
        </div>

        <Link href="/dashboard/customers/new">
          <Button className="bg-[#0ddff2] text-slate-900 hover:bg-[#0bcad8] font-bold rounded-xl h-11 px-5 shadow-sm transition-all border-none">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pelanggan
          </Button>
        </Link>

        {/* Delete Confirmation Dialog - Tetap menggunakan modal karena ini best practice UX */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 shadow-2xl border-none text-center">
            <DialogHeader className="space-y-3">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Hapus Pelanggan?
              </DialogTitle>
              <DialogDescription className="font-medium text-slate-500">
                Apakah Anda yakin ingin menghapus <strong>{customerToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-3 pt-6">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all border-none"
                onClick={onDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-slate-800">Daftar Pelanggan</CardTitle>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama atau telepon..."
                className="pl-10 h-10 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#0ddff2] font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-slate-100 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Data tidak ditemukan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider pl-6 py-4">Pelanggan</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Kontak</TableHead>
                  <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider py-4">Alamat</TableHead>
                  <TableHead className="text-right text-slate-400 font-bold text-[11px] uppercase tracking-wider pr-6 py-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-slate-50/50 transition-all border-slate-50 group">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                          {customer.name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <Phone className="h-3.5 w-3.5 text-slate-300" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 max-w-[250px]">
                      <div className="flex items-start gap-2 text-slate-500 text-sm truncate">
                        <MapPin className="h-3.5 w-3.5 text-slate-300 mt-0.5" />
                        <span className="truncate">{customer.address || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/customers/${customer.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#0ddff2] hover:bg-[#0ddff2]/5 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            setCustomerToDelete(customer);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
