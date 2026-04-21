'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-on-surface text-white mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-headline font-bold text-lg">PureLab</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Чистота от природы — экологичные средства для вашего дома
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">facebook</span>
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">language</span>
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">mail</span>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-6">Товары</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  Каталог товаров
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Новинки
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Скидки и акции
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Бестселлеры
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-lg mb-6">Информация</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Условия доставки
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Способы оплаты
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Возврат товара
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6">Поддержка</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2024 PureLab. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Лицензия
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Карта сайта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
