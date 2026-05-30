import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Weight, 
  Shirt, 
  Baby, 
  Timer, 
  Zap, 
  Leaf, 
  Star, 
  MapPin, 
  Clock, 
  Smartphone, 
  Send,
  Menu,
  Footprints
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#0ddff2] w-8 h-8" />
              <h1 className="text-xl font-bold tracking-tight">K20 Laundry</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#layanan" className="text-sm font-medium hover:text-[#0ddff2] transition-colors">Layanan</Link>
              <Link href="#keunggulan" className="text-sm font-medium hover:text-[#0ddff2] transition-colors">Keunggulan</Link>
              <Link href="#kontak" className="text-sm font-medium hover:text-[#0ddff2] transition-colors">Kontak</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button className="bg-[#0ddff2] text-slate-900 font-bold hover:bg-[#0ddff2]/90">
                  Masuk
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ddff2]/10 border border-[#0ddff2]/20 text-[#0ddff2] text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Laundry No. 1 di Kota Anda
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                  Cucian Bersih,<br/>
                  <span className="text-[#0ddff2]">Hidup Lebih Happy</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  Solusi laundry modern untuk pakaian kesayangan Anda. Cepat, bersih, dan wangi sepanjang hari dengan teknologi pembersihan terkini.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/login">
                    <Button size="lg" className="bg-[#0ddff2] text-slate-900 font-bold hover:bg-[#0ddff2]/90 h-14 px-8 text-lg rounded-2xl">
                      Mulai Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="#layanan">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-border">
                      Lihat Layanan
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[#0ddff2]/10 mix-blend-multiply"></div>
                  <img 
                    className="w-full h-full object-cover" 
                    alt="K20 Laundry Front View" 
                    src="/fotodepan.jpeg"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-border">
                    <div className="w-12 h-12 rounded-full bg-[#0ddff2] flex items-center justify-center">
                      <Check className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">Selesai dalam 24 Jam</p>
                      <p className="text-sm opacity-70">Layanan ekspres tersedia setiap hari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section (Catalog) */}
        <section className="py-20 bg-muted/30" id="layanan">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Layanan Kami</h2>
              <p className="text-muted-foreground">Berikut dibawah ini beberapa layanan kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Self service */}
              <div className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#0ddff2]/10 text-[#0ddff2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shirt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Self Service</h3>
                <p className="text-[#0ddff2] font-bold text-lg mb-4">Mulai dari Rp 10.000-13.000</p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Pilihan tepat untuk pakaian sehari-hari. Tersedia layanan Reguler (1-2 jam).</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Cuci Saja (MAX 12Kg)</li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Kering Saja (MAX 7Kg)</li>
                </ul>
              </div>

              {/* Cuci Kering lipat */}
              <div className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#0ddff2]/10 text-[#0ddff2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shirt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cuci Kering Lipat</h3>
                <p className="text-[#0ddff2] font-bold text-lg mb-4">Mulai dari Rp 25.000-30.000</p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Cuci kering lipat tanpa di setrika, 3 hari selesai.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Cuci kering lipat 5Kg </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Cuci kering lipat 7Kg</li>
                </ul>
              </div>

              {/* Sepatu & Tas */}
              <div className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#0ddff2]/10 text-[#0ddff2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shirt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cuci Kering Setrika Uap</h3>
                <p className="text-[#0ddff2] font-bold text-lg mb-4">Mulai Rp 25.000-45.000</p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Cuci Keirng Setrika Uap 3Kg-7Kg, pakaian anda di jamin rapih dan wangi</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Wangi </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Rapih</li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Anti-Bakteri</li>
                </ul>
              </div>

              {/* SETRIKA UAP SAJA */}
              <div className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#0ddff2]/10 text-[#0ddff2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shirt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2"> Setrika UAP Saja</h3>
                <p className="text-[#0ddff2] font-bold text-lg mb-4">Mulai Rp 5.000/Kg</p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Layanan ini hanya setrika UAP saja .</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Wangi</li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-[#0ddff2] w-4 h-4" /> Rapih</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 overflow-hidden" id="keunggulan">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-8 leading-tight">Mengapa Memilih <span className="text-[#0ddff2]">K20 Laundry</span>?</h2>
                <div className="grid gap-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ddff2] flex items-center justify-center text-slate-900">
                      <Timer className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Kilat & Tepat Waktu</h4>
                      <p className="text-muted-foreground">Kami menghargai waktu Anda. Layanan ekspres kami menjamin cucian bersih dalam hitungan jam.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ddff2] flex items-center justify-center text-slate-900">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Hasil Bersih Maksimal</h4>
                      <p className="text-muted-foreground">Teknik pembersihan profesional yang efektif menghilangkan noda membandel tanpa merusak kain.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ddff2] flex items-center justify-center text-slate-900">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Ramah Lingkungan</h4>
                      <p className="text-muted-foreground">Menggunakan deterjen biodegradable yang aman untuk kulit sensitif dan menjaga kelestarian alam.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0ddff2]/20 rounded-full blur-3xl"></div>
                <div className="relative bg-card p-4 rounded-3xl shadow-2xl">
                  <img 
                    className="rounded-2xl w-full" 
                    alt="K20 Laundry Room Interior" 
                    src="/fotoroom.jpeg"
                  />                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="kontak">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Kunjungi Kami</h2>
                  <p className="text-muted-foreground">Hubungi kami melalui WhatsApp atau kunjungi outlet kami secara langsung.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <MapPin className="text-[#0ddff2] w-6 h-6" />
                    <div>
                      <p className="font-bold">Alamat Utama</p>
                      <p className="text-muted-foreground">Jl. Panglima Polim No.51, Segala Mider, Kec. Tj. Karang Bar., Kota Bandar Lampung, Lampung 35124</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <Clock className="text-[#0ddff2] w-6 h-6" />
                    <div>
                      <p className="font-bold">Jam Operasional</p>
                      <p className="text-muted-foreground">Senin - Minggu: 06.00 - 21.00 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <Smartphone className="text-[#0ddff2] w-6 h-6" />
                    <div>
                      <p className="font-bold">WhatsApp</p>
                      <p className="text-muted-foreground">+62 851-2158-5692</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="h-[500px] w-full bg-muted rounded-3xl overflow-hidden border-4 border-border shadow-2xl relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!4v1777881368230!6m8!1m7!1sGwO_Txil17-gUi24zlqwNQ!2m2!1d-5.392546138196421!2d105.2492706241489!3f212.65!4f-15.879999999999995!5f0.7820865974627469" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="K20 Laundry Street View"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 dark:bg-black dark:border-t dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="text-[#0ddff2] w-6 h-6" />
                <h2 className="text-xl font-bold tracking-tight">K20 Laundry</h2>
              </div>
              <p className="text-sm leading-relaxed">Penyedia jasa laundry terpercaya dengan teknologi modern dan layanan sepenuh hati untuk kebersihan maksimal.</p>
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0ddff2] hover:text-slate-900 transition-colors cursor-pointer">
                    <Send className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Layanan Cepat</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-[#0ddff2]">Self Service</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Cuci Kering Lipat</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Cuci kering setrika UAP</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Setrika UAP saja</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Informasi</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-[#0ddff2]">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Daftar Harga</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Ketentuan Layanan</Link></li>
                <li><Link href="#" className="hover:text-[#0ddff2]">Kebijakan Privasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Dapatkan info promo menarik setiap minggunya.</p>
              <div className="flex gap-2">
                <input className="bg-slate-800 border-none rounded-lg text-sm flex-1 p-3 text-white focus:ring-1 focus:ring-[#0ddff2]" placeholder="Email Anda" type="email"/>
                <Button className="bg-[#0ddff2] text-slate-900 p-3 rounded-lg border-none">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-xs opacity-50 text-white">
            © {new Date().getFullYear()} K20 Laundry. All Rights Reserved. Clean with love.
          </div>
        </div>
      </footer>
    </div>
  );
}
