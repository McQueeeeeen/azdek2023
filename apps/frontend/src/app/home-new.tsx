'use client';

import Link from 'next/link';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Гель для посуды «Мята»',
    description: '99.8% натуральных компонентов',
    price: 590,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTjY8wS3hCya3EC4v7PEY1ORdupHjr0-jz_bhduuXcdEZQo1d-q_eXk9YhMpuTFj2UG2Xdh_f5mua1id68CUzfOdyuRSAF89slMXoK65AXMEJeDEC-OQrjwkxrcTKx6pkVLlu-yb3uqNVo00gN95c0dCyXEV6twOsHsWuvhCLn5nOYCa3K3gtd2sgrfFFusc1Qv4gaf4oOoCcZnrcspA1hIFA15MvjRwWpbW87mcBxi-VNb2bi48hJis2IQSSBERyuLTpbRzFuqDJm',
  },
  {
    id: '2',
    name: 'Антижир Bio-Force',
    description: 'Без агрессивных ПАВ и хлора',
    price: 750,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEs7al3xa-MU8ObJfiyQKlGz5vyz4A0wuWod-VErwsGcp-MYgvKe7N8sMzMXfcS5xBKeRY20DrhdrBVB17TppudQrQJ5Fkf8q_Cq73uI6nU6KjfpbxpfpkoKJyQjpvbPZXGm8R-ZEhyDVrlvvAzWHOAB1J0ejymHOFMQutlZ34UQcJAvXFcvC8TJg73z2ep8pS8niMrRKJ-2yYM_dowcz8r_P7UrYkS--NVNYdP9FV1YGyebVJlFzZty4u0d6E2w5vyQixI-0sGmP7',
  },
  {
    id: '3',
    name: 'Набор Эко-губок',
    description: '100% биоразлагаемая целлюлоза',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9es75yFtdrCT2I_Ng9igTy2GwDfbL1cQIWX8B-ovmR3Tt0uyZglWzFlYko0AGGk8JuNXV0AbnVirztktq1kZt8i9DVXCuwqy4JRfZhnc911J0UoS7bhvjG3u5I_U4sRozNAbYieOip5TjX_pPgKyIqGxyTgqaUk8OWw27h3Oarhb0sc9E_Paxh2aCEXNiB53qu24F5el-YO84tWdVn5a_L4sRFJuLUf1OQtB7PBpJ6R35cPBM49_g8P4v7V6zSq70tQZuctNaIdeH',
  },
  {
    id: '4',
    name: 'Стиральный гель',
    description: 'Концентрат для всех типов тканей',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=400&q=80',
  },
];

export default function HomeNew() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SiteHeaderNew />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-8 max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-surface-container-low rounded-2xl overflow-hidden p-8 md:p-16">
            <div>
              <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold mb-6 tracking-wider">
                PURE ETHOS
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface text-authoritative leading-tight mb-8">
                Эстетика <br />
                <span className="text-primary">чистой</span> среды
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md mb-10 leading-relaxed">
                Мы создаем средства, которые работают как профессиональные лабораторные формулы, оставаясь
                полностью безопасными для природы.
              </p>
              <Link
                href="/catalog"
                className="inline-block bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                Смотреть каталог
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-container/30">
                <img
                  alt="Product"
                  className="w-full h-full object-cover mix-blend-multiply"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmrveIJx5Yz0htxW20jOksQFm7pK4LtDtaFB74CN5t-t6n579T49tSQjGnGFrQkbIWcsmTyd4c63iyagfSe1MsO4JPZ7AlgebgYCUusFaXgeJvt76w6B0agqNWYjMDvtnjDJMJvs5FCeE6DT3zsbwUnGGdKjJ_SgwhWeIoQhcjciijA6sIvWsbrZ5ofRr2DXpunVuv2VLsbDX6eD9qR2nsK5IRdNUtiXbBhvuy4nK1456tqeD06aMMbs-QCx5cfV5ywoXCjDIDZloD"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-8 max-w-7xl mx-auto mb-16">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-headline text-3xl font-extrabold text-on-surface text-authoritative">
              Хиты продаж
            </h2>
            <Link
              href="/catalog"
              className="text-primary font-semibold flex items-center gap-2 hover:underline"
            >
              Все товары{' '}
              <span className="material-symbols-outlined text-5 w-5 h-5">arrow_forward</span>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <Link key={product.id} href={`/catalog/${product.id}`}>
                <div className="bg-surface-container-lowest p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0px_20px_40px_rgba(0,88,188,0.1)] group cursor-pointer h-full">
                  {/* Product Image */}
                  <div className="aspect-square bg-secondary-container rounded-xl mb-6 overflow-hidden">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      src={product.image}
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-lg text-on-surface">{product.name}</h3>
                    <p className="text-on-surface-variant text-sm">{product.description}</p>

                    {/* Price and Add Button */}
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xl font-black text-on-surface">{product.price} ₽</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="bg-surface-container-high p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-on-surface hover:text-white"
                      >
                        <span className="material-symbols-outlined text-5 w-5 h-5">
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
