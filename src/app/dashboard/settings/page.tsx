"use client";

import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Store, 
  Lock, 
  ShieldCheck,
  Save,
  Trash2,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Users,
  Plus,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StoreSettings {
  name: string;
  phone: string;
  address: string;
  website: string;
  tax: number;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Store state
  const [storeData, setStoreData] = useState<StoreSettings>({
    name: "K20 Laundry",
    phone: "081234567890",
    address: "Jl. pangllima polim",
    website: "",
    tax: 0,
  });

  // User management state
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "KASIR",
  });

  const isAdmin = session?.user?.role === "ADMIN";

  const tabs = [
    { id: "profile", label: "Profil Akun", icon: UserIcon },
    { id: "store", label: "Informasi Toko", icon: Store, adminOnly: true },
    { id: "security", label: "Keamanan", icon: Lock },
    { id: "users", label: "Manajemen User", icon: Users, adminOnly: true },
  ].filter(tab => !tab.adminOnly || isAdmin);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }

    if (isAdmin) {
      fetchStoreSettings();
      fetchUsers();
    }
  }, [session, isAdmin]);

  const fetchStoreSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setStoreData(data);
      }
    } catch (error) {
      console.error("Error fetching store settings:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: profileData.name,
            email: profileData.email,
          }
        });
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profil.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Kata sandi baru tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        alert("Kata sandi berhasil diperbarui!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await res.text();
        alert(error || "Gagal memperbarui kata sandi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });

      if (res.ok) {
        alert("Informasi toko berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui informasi toko.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("User berhasil ditambahkan!");
        setIsAddUserOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "KASIR" });
        fetchUsers();
      } else {
        const error = await res.text();
        alert(error || "Gagal menambahkan user.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-2">Kelola profil, informasi toko, dan preferensi akun Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-[#0ddff2] text-white shadow-lg shadow-[#0ddff2]/20"
                  : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Profil Akun</CardTitle>
                  <CardDescription>Perbarui informasi pribadi dan profil Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="name" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          placeholder="Nama Anda" 
                          className="pl-10" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          placeholder="email@contoh.com" 
                          className="pl-10" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-slate-100 mt-4 pt-6">
                  <Button type="submit" className="bg-[#0ddff2] hover:bg-[#0bcad8] text-white px-6" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {activeTab === "store" && isAdmin && (
            <form onSubmit={handleStoreSubmit}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Informasi Toko</CardTitle>
                  <CardDescription>Kelola informasi bisnis laundry Anda yang tampil di struk dan laporan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nama Toko</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="store-name" 
                          value={storeData.name}
                          onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                          placeholder="Nama Toko" 
                          className="pl-10" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Nomor Telepon Toko</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="store-phone" 
                          value={storeData.phone}
                          onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                          placeholder="0812-xxxx-xxxx" 
                          className="pl-10" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-address">Alamat Lengkap</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea 
                        id="store-address"
                        rows={3}
                        value={storeData.address}
                        onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ddff2] disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Alamat lengkap toko Anda..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-website">Website (Opsional)</Label>
                      <Input 
                        id="store-website" 
                        value={storeData.website || ""}
                        onChange={(e) => setStoreData({...storeData, website: e.target.value})}
                        placeholder="https://starlaundry.id" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-tax">Pajak / Biaya Admin (%)</Label>
                      <Input 
                        id="store-tax" 
                        type="number" 
                        value={storeData.tax}
                        onChange={(e) => setStoreData({...storeData, tax: parseFloat(e.target.value)})}
                        placeholder="0" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-slate-100 mt-4 pt-6">
                  <Button type="submit" className="bg-[#0ddff2] hover:bg-[#0bcad8] text-white px-6" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Informasi Toko
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Keamanan & Kata Sandi</CardTitle>
                  <CardDescription>Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="pl-10" 
                          required
                        />
                      </div>
                    </div>
                    
                    <hr className="border-slate-100" />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Kata Sandi Baru</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="pl-10" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="pl-10" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-slate-100 mt-4 pt-6">
                  <Button type="submit" className="bg-[#0ddff2] hover:bg-[#0bcad8] text-white px-6" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Perbarui Kata Sandi
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {activeTab === "users" && isAdmin && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manajemen User</CardTitle>
                  <CardDescription>Kelola siapa saja yang memiliki akses ke aplikasi ini.</CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0ddff2] hover:bg-[#0bcad8] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddUser}>
                      <DialogHeader>
                        <DialogTitle>Tambah User Baru</DialogTitle>
                        <DialogDescription>
                          Berikan akses kepada anggota tim Anda. Klik simpan setelah selesai.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="new-name">Nama Lengkap</Label>
                          <Input 
                            id="new-name" 
                            placeholder="John Doe" 
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-email">Email</Label>
                          <Input 
                            id="new-email" 
                            type="email" 
                            placeholder="john@example.com" 
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">Kata Sandi Awal</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-role">Peran / Role</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(val) => setNewUser({...newUser, role: val})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KASIR">Kasir</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[#0ddff2] hover:bg-[#0bcad8] text-white" disabled={loading}>
                          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Simpan User
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            )}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              disabled={user.email === session?.user?.email}
                              onClick={async () => {
                                if (confirm("Hapus user ini?")) {
                                  await fetch(`/api/users/${user.id}`, { method: "DELETE" });
                                  fetchUsers();
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
