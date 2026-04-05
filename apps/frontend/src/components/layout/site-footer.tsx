import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-50 w-full pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-slate-900 mb-6">Adzek</div>
          <p className="text-slate-500 text-sm leading-relaxed">Совершенство чистоты в гармонии с природой. Инновационные формулы для вашего комфорта.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Покупателям</h4>
          <ul className="flex flex-col gap-4 text-slate-500 text-sm">
            <li><Link className="hover:text-blue-500 transition-colors" href="/catalog">Каталог</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/support">Доставка и оплата</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/support">Условия возврата</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/about">Сертификаты</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">О компании</h4>
          <ul className="flex flex-col gap-4 text-slate-500 text-sm">
            <li><Link className="hover:text-blue-500 transition-colors" href="/about">О бренде</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/promotions">Эко-инициативы</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/support">Контакты</Link></li>
            <li><Link className="hover:text-blue-500 transition-colors" href="/about">Политика конфиденциальности</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Связь</h4>
          <p className="text-slate-500 text-sm mb-4">8 (800) 555-35-35</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">public</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">chat</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-xs antialiased">
        <span>© 2024 Adzek. Совершенство чистоты.</span>
        <div className="flex gap-6">
          <span>Сделано с любовью к планете</span>
        </div>
      </div>
    </footer>
  );
}

