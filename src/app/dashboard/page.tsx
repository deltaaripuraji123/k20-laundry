import { prisma } from "@/lib/prisma";
import { Users, ShoppingBag, Tags, TrendingUp, Calendar, ArrowUpRight, Sparkles, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div />;
  }
  
  const totalCustomers = await prisma.customer.count();
  const totalOrders = await prisma.order.count();
  const totalServices = await prisma.service.count();
  
  // Hitung total pendapatan dari semua pesanan
  const aggregate = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });
  
  const totalRevenue = aggregate._sum.totalPrice || 0;

  // Ambil 5 pesanan terbaru
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
        }
      },
      orderItems: {
        include: {
          service: true
        }
      }
    }
  });

  const stats = [
    {
      title: "Total Pelanggan",
      value: totalCustomers.toLocaleString('id-ID'),
      icon: Users,
      trend: "+12%",
      colorClass: "text-sky-500",
      bgClass: "bg-sky-50"
    },
    {
      title: "Pesanan Aktif",
      value: totalOrders.toLocaleString('id-ID'),
      icon: ShoppingBag,
      trend: "+5%",
      colorClass: "text-orange-500",
      bgClass: "bg-orange-50"
    },
    {
      title: "Total Layanan",
      value: totalServices.toLocaleString('id-ID'),
      icon: Tags,
      trend: "Stabil",
      colorClass: "text-purple-500",
      bgClass: "bg-purple-50"
    },
    {
      title: "Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      trend: "+8%",
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-50"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Selamat datang kembali di K20Laundry.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari ini</p>
            <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
          </div>
          <Link href="/dashboard/orders/new">
            <Button className="bg-[#0ddff2] text-slate-900 hover:bg-[#0bcad8] font-bold rounded-xl h-11 px-5 shadow-sm transition-all border-none">
              <Plus className="w-4 h-4 mr-2" />
              Pesanan Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-white group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${stat.bgClass} flex items-center justify-center ${stat.colorClass}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Pesanan Terbaru</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Monitoring aktivitas terkini.</CardDescription>
            </div>
            <Button variant="ghost" className="text-[#0ddff2] font-bold hover:bg-[#0ddff2]/5 rounded-lg text-sm">Lihat Semua</Button>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-1">
              {recentOrders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 font-medium">Belum ada pesanan.</p>
                </div>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                        {order.orderNumber.split('-').pop()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{order.customer.name}</p>
                        <p className="text-xs text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                          {order.orderItems.map((item: any) => item.service.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-slate-900">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                        order.status === "DITERIMA" ? "text-blue-500 bg-blue-50" :
                        order.status === "SELESAI" ? "text-emerald-500 bg-emerald-50" :
                        "text-orange-500 bg-orange-50"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            <Link href="/dashboard/orders/new" className="block w-full">
              <Button className="w-full flex items-center justify-start gap-4 p-6 h-auto rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all border-none group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5 text-[#0ddff2]" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Buat Pesanan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Input transaksi baru</p>
                </div>
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/customers">
                <Button variant="outline" className="w-full flex flex-col items-start gap-3 p-5 h-auto rounded-2xl border-slate-100 hover:bg-slate-50 transition-all group">
                  <Users className="w-5 h-5 text-slate-400 group-hover:text-[#0ddff2]" />
                  <span className="font-bold text-sm text-slate-700">Pelanggan</span>
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button variant="outline" className="w-full flex flex-col items-start gap-3 p-5 h-auto rounded-2xl border-slate-100 hover:bg-slate-50 transition-all group">
                  <Tags className="w-5 h-5 text-slate-400 group-hover:text-[#0ddff2]" />
                  <span className="font-bold text-sm text-slate-700">Layanan</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
