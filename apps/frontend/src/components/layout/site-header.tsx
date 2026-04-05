import Link from "next/link";

export default function SiteHeader() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,88,188,0.06)] h-20">
      <div className="flex justify-between items-center px-8 h-full max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-black text-blue-700 tracking-tighter">
          Adzek
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500 hover:scale-105 transition-transform duration-200" href="/catalog">
            Каталог
          </Link>
          <Link className="font-manrope tracking-tight font-semibold text-blue-700 border-b-2 border-blue-600 pb-1 hover:scale-105 transition-transform duration-200" href="/promotions">
            Эко-линейка
          </Link>
          <Link className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500 hover:scale-105 transition-transform duration-200" href="/about">
            О бренде
          </Link>
          <Link className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500 hover:scale-105 transition-transform duration-200" href="/support">
            Доставка
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
            <input className="bg-surface-container-lowest border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-surface-tint/20 text-sm" placeholder="Поиск чистоты..." type="text" />
          </div>
          <div className="flex gap-4">
            <Link href="/cart" className="material-symbols-outlined text-blue-700 cursor-pointer hover:scale-110 transition-transform" aria-label="Корзина">
              shopping_cart
            </Link>
            <Link href="/account" className="material-symbols-outlined text-blue-700 cursor-pointer hover:scale-110 transition-transform" aria-label="Аккаунт">
              person
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

