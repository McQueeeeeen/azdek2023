import Link from "next/link";

const products = [
  {
    tag: "Ecolabel",
    title: 'Гель для посуды "Мята и Лайм"',
    subtitle: "Гипоаллергенно, 500мл",
    price: "380 ₽",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsspaP0PkRZ-pTK3yjwYtvXzF74xpeEfUKO5EpKcRmwLtpdjneeInLhP9SSiQbEHuUBzSqCAkcT_prcXWR0gc5fUUNEFdS7KoJtGGPWesRNjfZXdy5LVi-SC29Nt9pBbdrob3siSiLi8MuPV_qP8Q16vMcB_J6dj4bBEEY5NgYpy0kVhlqJoLxHRLL8A4-T7e33CyzQIlH9ucIhM6leugVWM27224EKhwspw1xV0wOji7MaTFd4GBHFvfhlTcYh3Ry_YB2wxe7sNYQ",
  },
  {
    tag: "Organic",
    title: "Спрей для поверхностей",
    subtitle: "Масло чайного дерева, 450мл",
    price: "450 ₽",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxSaNBip9fDJmkBQgxXw4sPLj_0ONn71kOJKOGYVVHXbpGNAk7YOtfh3ytQDu82QHRDN4V9fg7OM9ilM_JcGsXhIzLbp_ph52mNmK8JVRfk6VulZDPEWRq8hlo5k_a9HGdkFX5cbk0h3M05qEiu_4Dc7aTXVVs76ayJdvTi5WC9eEJuT2reXlqrr8Ld0XySJkTjrQUSjXWeGZMd9miBEY_7i70J5S9SLYtXz5L8t4GPEFW6o_J8TEXXMjAljFiVEQV4WewFVRDKuKY",
  },
  {
    tag: "Zero Waste",
    title: "Жидкое средство для стирки",
    subtitle: "Лаванда и Хлопок, 1000мл",
    price: "820 ₽",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJqDGw4JKcgmif_ctAKr0xYQnwOqKK1rY9sKLC9DPb5jlZ0woWGdmD_s9cCt_KRhM_8_qHOZVG016fDoGFO2B-Oh04S6HYBj8QxdLsZPiU3PLiQMgmGcIz7qDVDnAyEp_lAovRIiIcCgjVye43BaKWDm0ZWALibw1t1oCPXvlpjpjReQBL9HRKLvjxlG-qsjYo_houUElSTGIXfzqm1vH1on-2nLEevBjAMtub_o0vTYBdOPUvDiwn-fshCWj803n-wwoXlO6kcApH",
  },
  {
    tag: "100% Bio",
    title: "Универсальное мыло-концентрат",
    subtitle: "Хвоя и Эвкалипт, 250г",
    price: "590 ₽",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYt5KP5WAWX-e4Sph1Iar_aylbPtjEbpKBStm5FLzJ9ekKWGR_DG5i_TVuPMd098FWtgsyIN5ypljoMgOGN1LBJBY4Ta_7IRwDy8lP_twnpWfKsp3FpxvCuUkBBKAzmOYulV2oW7dsf1YE4vGFJVOjeZog4h8OAcozOuEXhhNYg3AEjHWAoFRafTf-tHwJ5UOOyfaja7pqengkB3-2W7jxwfNvKqhSvBnfD3TBkjVdLGCmh1VFCARrEKgaJ5PE_7z1hGtkQNwfnlz4",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Чистота от природы"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNtWgIdBmGvUxUJD-VfQUZOEIXayQP2Y5y-wgfaSlsm9jM8aBigJR2okstBWGuQ5u-fLr66qxa1amTB1fe3B3LTrgezZYtFS4xZavVIbeIGWsFIUZ-auDtftBoY1uq_JaCxj6XuwvegDAEDY7rBs6IIkElgWFlXm6ecl0pXpXZNChQjGimy2N4E8P19Z1m3t8QVf-hMXKrFNb2BzlKhOugD76oVbMwATEy6W-p_xt8I_qlxC09soJH68gaHBligKf8JFDI_mjLo84H"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/35 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-sm font-semibold mb-6">
              100% Биоразлагаемо
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-on-surface tracking-tighter mb-6 leading-tight">Чистота от природы</h1>
            <p className="text-xl text-on-surface-variant mb-10 leading-relaxed font-body">
              Создаем безупречную чистоту в вашем доме, используя только силу растений и минералов. Безопасно для семьи, бережно к планете.
            </p>
            <div className="flex gap-4">
              <Link
                href="/catalog"
                className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                Смотреть каталог
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/promotions" className="bg-secondary-fixed text-on-secondary-fixed px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                Эко-линейка
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-lowest p-12 rounded-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Стандарт PureLab Green</h2>
                <p className="text-on-surface-variant max-w-md">Каждый наш продукт проходит строгую сертификацию. Мы исключили фосфаты, хлор и агрессивные ПАВ.</p>
              </div>
              <div className="flex gap-4 mt-8 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                      eco
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Vegan</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                      water_drop
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Water Safe</span>
                </div>
              </div>
              <img
                className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity"
                alt="Текстуры переработки"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtaOka7VU3zqjLnJEpzPciWBO-GN_UjWUBZ_UQG3f_A4MjZnEOfpLYkDXSidjAvXX6shNZTCirRsWjvALTSQD7h-zMNdGLipMU_mY6sZ3QuiVyj0W0qNEnBS9fSozqkBX2Ht822SUGUqKouhI9a7KUM6OffWgRKKbV6wA27WUHVNiupKyxBwUBICPUaJTzMQZG4GiBkt0VHyYk8WaTh9ttSc_9zlZD0evF1vTkRieBA2QlAk2IhD-CsKS1psD2i71qLXeggYtv_XWg"
              />
            </div>

            <div className="bg-primary text-white p-12 rounded-xl flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-6xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
                science
              </span>
              <h3 className="text-2xl font-bold mb-2">Лабораторный контроль</h3>
              <p className="text-primary-fixed/80 text-sm">Протестировано дерматологами и экспертами по экологии.</p>
            </div>

            <div className="md:col-span-3 bg-surface-container-lowest rounded-xl overflow-hidden grid md:grid-cols-2 items-center">
              <div className="p-12">
                <div className="flex items-center gap-2 text-secondary font-bold mb-4">
                  <span className="material-symbols-outlined">recycling</span>
                  Вторая жизнь пластика
                </div>
                <h2 className="text-4xl font-bold mb-6 tracking-tighter">Мы зациклили производство</h2>
                <p className="text-on-surface-variant mb-8 text-lg">
                  Каждая упаковка PureLab на 100% состоит из переработанного океанического пластика. Принесите пустую тару в наши пункты приема и получите скидку 15%.
                </p>
                <button className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                  Найти пункт приема
                </button>
              </div>
              <div className="h-80 md:h-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Переработанный пластик"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5u28x-EGNlSIWJiS1en3F5MB_NqlhtrYYYVmCnEKdW8FoKKetUFLe53dyNCoiNTyTgXGnZ16f0zM6zGKqctW_2K9cmQfXI0pDeQRswtYxret87IzfwS8ZiIPvhqEg0eld1xL_hAnk5O5v8qNORGdAe_Gl_Wj1HOcS0S2k05D73K5pNLYl8FIhhNGPTFkvVZY_eNiojglp-Fhts2F163hds6rOzyI0w0CLGB3pqV4eMrTFZatfkoUVv4P_LMPlx_IYZ04eNxHU7F3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Натуральные бестселлеры</h2>
              <p className="text-on-surface-variant">Средства, которые выбирают осознанные потребители</p>
            </div>
            <Link href="/catalog" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Весь каталог <span className="material-symbols-outlined">east</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div className="group" key={product.title}>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden mb-6 relative aspect-square flex items-center justify-center p-8 transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">{product.tag}</span>
                  </div>
                  <img alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" src={product.image} />
                </div>
                <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{product.subtitle}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-on-surface">{product.price}</span>
                  <button className="bg-surface-container-high p-3 rounded-full hover:bg-primary hover:text-white transition-all" type="button" aria-label={`Добавить ${product.title} в корзину`}>
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Зеленый фон"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC1fBGxBQk0qL3475z1em3zXZNs3Ql_0l0IgT9BltcpKCTmSTVpNjTLwm32CdAXvRKIRG3wd4Yo1vWw96B5KyBuOeBTbf4aTzyHChbsfXM7Hi0hJRtYySJD05B3PGJjHkdNrtWD2gpj_6JA-BBU1UUSU1ZdY-Qh-dAIsrL9CDFRmkt_Q7_wnuW1P8t18zMKPsd8DFoNE_7WFjf9yL1vAxwcmb3ya_iWSVkCyGyJreS_JJHVxplWbr3mEL1QDZz5hJetUZsD_03mZgf"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <div className="bg-white/30 backdrop-blur-xl p-16 rounded-xl border border-white/40 text-center">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Станьте частью PureLab</h2>
            <p className="text-lg mb-10 text-on-surface">Подпишитесь на наши советы по экологичной уборке и получайте персональные предложения.</p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                className="flex-grow px-6 py-4 rounded-xl bg-white/60 border-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-600"
                placeholder="Ваш e-mail"
                type="email"
              />
              <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all" type="submit">
                Подписаться
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
