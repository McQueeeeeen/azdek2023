import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Azure Clean | The Editorial of Home Care",
  description: "The Clinical Editorial of Home Care",
};

const HOME_HTML = `
<nav class="fixed top-4 left-0 right-0 z-50">
  <div class="mx-auto max-w-5xl rounded-full bg-white/70 backdrop-blur-md shadow-xl shadow-cyan-900/5 px-8 py-3 flex justify-between items-center w-full">
    <div class="text-2xl font-headline text-cyan-800 italic">Azure Clean</div>
    <div class="hidden md:flex items-center space-gap-8 gap-x-8">
      <a class="text-cyan-900 font-bold border-b-2 border-cyan-600 transition-colors py-1" href="#">Laundry</a>
      <a class="text-slate-500 font-medium hover:text-cyan-600 transition-colors py-1" href="#">Kitchen</a>
      <a class="text-slate-500 font-medium hover:text-cyan-600 transition-colors py-1" href="#">Bathroom</a>
      <a class="text-slate-500 font-medium hover:text-cyan-600 transition-colors py-1" href="#">Bundles</a>
    </div>
    <div class="flex items-center gap-6">
      <button class="text-cyan-700 hover:scale-95 transition-all duration-200 ease-in-out">
        <span class="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
      </button>
      <button class="text-cyan-700 hover:scale-95 transition-all duration-200 ease-in-out">
        <span class="material-symbols-outlined" data-icon="person">person</span>
      </button>
    </div>
  </div>
</nav>

<main>
  <section class="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img alt="Minimalist laundry room" class="w-full h-full object-cover" data-alt="Minimalist bright laundry room with natural light, clean white walls, marble surfaces, and simple glass jars of clear liquid soap" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKxy7M5t2SSpJLL_Vw2NIc5Q22ORohDeMGBeS_sfgI3HzhS8XdaF9AF67FqsE175VxcQxj4K-0eVKM9-JlH9ST4ojD2Fq5oEVi5XMQKImxd2uLRIVQ4BdeEeHPkiWhDM0LplBQDsEiAmnXVewr7lDHrlW2cZV3GSTaG4lWffh-lNvBtdPQ0Tdm1BLgsyzccbFyoeJr-pHWfGOg5DYDk6Vq0V94vg1tRERdEOzezk5seB-XRwurpmE0XI_5jtNoJ95HEOV-raYfw8" />
      <div class="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent"></div>
    </div>
    <div class="container mx-auto px-8 relative z-10">
      <div class="max-w-2xl">
        <span class="block text-tertiary font-bold tracking-widest text-sm mb-4 uppercase">Clinical Precision. Editorial Grace.</span>
        <h1 class="text-7xl md:text-8xl font-headline text-primary mb-8 leading-tight">The Editorial of Home Care</h1>
        <p class="text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed font-body">
          Elevating daily rituals through a curated collection of effective, botanical-infused cleaning essentials. Where clinical efficacy meets high-design.
        </p>
        <a class="inline-flex items-center liquid-gradient text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-lg transition-all group" href="#new-arrivals">
          Shop New Arrivals
          <span class="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>

  <section class="py-24 bg-surface">
    <div class="container mx-auto px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 h-[600px]">
        <div class="md:col-span-7 bg-surface-container-low rounded-xl overflow-hidden relative group">
          <img alt="Laundry category" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="High-end textile textures, white cotton fabrics stacked neatly in a sunlit airy room, soft morning shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Gf5FXnqRBP7nRknDNXNkq3vz08Ydqd9kCBQsRofehj3gFstJk6BQ2XjxfazWNU3jywd5TBu-4NqkgFfN6nrqdpby2o52s9TMaX76jedIt1AwQNqMjp3Xet1s0X8Tj81YMoMlfBY6WFiwyi1N_yKQppQiIXAvj1guRASAy5Kys9Td-fSK61f1A3fzq4Txss1QEOrHb_saodsY8klNyFdFiTU2A2v20Kgw1VZlL1KpYOJ4Xq_akvjCLqHIG88Zm7DKGVcA7pEgfoI" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          <div class="absolute bottom-8 left-8">
            <h2 class="text-4xl font-headline text-white mb-2">Laundry</h2>
            <p class="text-white/90 font-label">The science of fabric care.</p>
          </div>
        </div>
        <div class="md:col-span-5 flex flex-col gap-8">
          <div class="h-1/2 bg-surface-container-low rounded-xl overflow-hidden relative group">
            <img alt="Kitchen category" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Sleek modern kitchen island with minimalist glassware and a single sprig of eucalyptus in a clear vase" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4UR0sZxs7I-xeNKbcegLVUulb7m-gF1gYc-gors5qG4fe33eQW7bJPEKG9KYvQYzLMzinq09C_ZB8u6pq2l3WV4tWtLNLJR4xqMK7J3Wd23w09V_1Iukvdj2Yp9ROXztJN7QthbjOvmvUuD2bW_ZQid0qiUiHDzxFvnlAOwtibbCVJN5XKCwztk_kNcdhBZszQ7yVIGwZD8ftQBdRynImOZjwZvRCZadoy_DI-uVTlBTe5w1X2wAqyr8TEwTSxnNoMyfuBh7hN0o" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div class="absolute bottom-8 left-8">
              <h2 class="text-3xl font-headline text-white mb-1">Kitchen</h2>
              <p class="text-white/80 font-label">Culinary-grade hygiene.</p>
            </div>
          </div>
          <div class="h-1/2 bg-surface-container-low rounded-xl overflow-hidden relative group">
            <img alt="Bathroom category" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Spa-like bathroom with white ceramic tiles and a stack of fresh neutral towels, minimalist glass soap dispenser" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkyhnABUpQd6m1bl57ugsUGUYqZqqfhZDQj-7AaEbbG9jvdE0AqJiJh5nkxyk1HbPBR6QqKPVqoYR4ZGou_9iJQdj9UwHYMhGkoWzE7H6sDVzZn-QQfPCO23gMpmVOzCyVxzYqmzbbCAw0J2yWoKDnrmR9afo1qJKp_ey1wmN2-EyjbeEja3h2pqvVnhlsSWXW0xI6DcGhXpO_AWrL1t31uCE0FRqoMVwoUe6b_gDdY1HBRb-CAIz2WL1qDgAuP2LW1cI05mWOEMM" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div class="absolute bottom-8 left-8">
              <h2 class="text-3xl font-headline text-white mb-1">Bathroom</h2>
              <p class="text-white/80 font-label">The sanctuary edit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-24 bg-white" id="new-arrivals">
    <div class="container mx-auto px-8">
      <div class="flex justify-between items-end mb-16">
        <div>
          <h2 class="text-5xl font-headline text-primary mb-4">The Best Sellers</h2>
          <p class="text-on-surface-variant font-body">Our most-loved formulas for a pristine home.</p>
        </div>
        <a class="text-tertiary font-bold tracking-wider uppercase border-b-2 border-tertiary pb-1 hover:text-on-tertiary-container transition-colors" href="#">View All Products</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        <div class="group">
          <div class="aspect-[4/5] bg-surface-container-low rounded-xl mb-6 overflow-hidden relative flex items-center justify-center p-8">
            <img alt="Azure Laundry Detergent" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" data-alt="Elegant glass bottle of laundry detergent with a minimalist white label and black serif typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB269GCOa2tApPWrWU6Tyh3bCVYVbSvDsb430KeDTtbokR0VufmlDzhoMgBgnB92W5gP5tPLNt0nJ1is7SCcadBwXpbQgBHlPu_V382je6D94kzdcVYMWtlKI0mo50woqnAMKGfuvRGRfXQnPjlzGEj2oRq_834BRiUBiFT3A6HXa9YqPXJr1TnJQQUvftBuvw0vRoIT0FZjS2TLX0cuOBJiNJqs3kkmRKUt_WC9rL-iWCBuMTVxT9BIi5EcDyy36z3AiYQ142W3PY" />
            <button class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold py-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Quick Add - $32</button>
            <span class="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Eco-Friendly</span>
          </div>
          <h3 class="text-2xl font-headline mb-1">Laundry Detergent</h3>
          <p class="text-sm text-on-surface-variant font-label mb-2 uppercase tracking-widest">No 01 - White Tea & Linen</p>
          <p class="text-lg font-medium text-primary">$32.00</p>
        </div>
        <div class="group">
          <div class="aspect-[4/5] bg-surface-container-low rounded-xl mb-6 overflow-hidden relative flex items-center justify-center p-8">
            <img alt="Azure Dish Soap" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" data-alt="Minimalist dish soap bottle with amber glass and a sleek black pump dispenser, editorial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNMdwV02HN0LSBOchOhSVeKVSPVBaezHE12xXY1aACzkw9Ar9jsRBmuY6WtfDlEVkAn2_kFLwMwuSoBH3UUvmq1_NYl-oyk6oSrxqEdYoPkYFxR16iHB_XBnxVg0sLJGFXWZZ97Lv8Styz9cO42JzlagiWPwRA8JQTiN1kqoRq0eTjLaS2ESa-544RAvzmYEqITNDKaDHAwMVwo5ZMVdZXUOmYgYl0UajFRecP0MfEUQn81KPGyhruSg_0927EoxQRhpiOleETrmI" />
            <button class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold py-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Quick Add - $24</button>
          </div>
          <h3 class="text-2xl font-headline mb-1">Dish Soap</h3>
          <p class="text-sm text-on-surface-variant font-label mb-2 uppercase tracking-widest">No 04 - Bergamot & Sea Salt</p>
          <p class="text-lg font-medium text-primary">$24.00</p>
        </div>
        <div class="group">
          <div class="aspect-[4/5] bg-surface-container-low rounded-xl mb-6 overflow-hidden relative flex items-center justify-center p-8">
            <img alt="Fabric Softener" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" data-alt="Soft frosted glass bottle containing milky white fabric softener, focused soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsN4hdSkZo75RsjJN2HBBZY-lHRO7I1o5Th7ouR5PWJ2Qd63JP1Fr2CGavfBGDuhmO15gUZM11a9VUXacg3sn_hqm2Bm_1Yz4iBsbEbAm1Vh8PwiJSrZNnNxBsysGy-2eYwaNmBTJIArjK_3bpuQG0tqC2b3_IMYCgh0hoTxItdlRiopSsb53lARD7U-FdoqCTaIlpJmVmgaitherUjN4jo8y3t1JH4v8bRh6fDzbz8l4VSzQZJh2Sf8dVMK1MDidN5oRsr4OzWLA" />
            <button class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold py-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Quick Add - $28</button>
          </div>
          <h3 class="text-2xl font-headline mb-1">Fabric Softener</h3>
          <p class="text-sm text-on-surface-variant font-label mb-2 uppercase tracking-widest">No 07 - Santal & Cedar</p>
          <p class="text-lg font-medium text-primary">$28.00</p>
        </div>
        <div class="group">
          <div class="aspect-[4/5] bg-surface-container-low rounded-xl mb-6 overflow-hidden relative flex items-center justify-center p-8">
            <img alt="Surface Cleaner" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" data-alt="Clear spray bottle with high-end trigger mechanism, showcasing transparent blue liquid against a white marble background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwyOyAl2Jfno206p0glxQWUXAIjZJeX4KD7CToIHh2U7TJk5UQ4DAu_DB2TUIebRgSLaiSm2Xi-Ni05rt2MXteJ_PjR9wK13GoTwVWd3N6FgrRGasqiTlxe1j-N24ygTNgOGwrPVEXLC5vZT_zSdAQifXbvGo1yNbA20Ajkajuo7rNQYgL075DqbwzrR6Ei8ZUaLCbJxj5FfoN8R2vniot3lnn31gJbuGbB7J2FtmkSevL-rt8u_EeRj1fIp-3RxW-J0S9PUwKj7g" />
            <button class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold py-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Quick Add - $22</button>
            <span class="absolute top-4 right-4 bg-primary-container text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">New Arrival</span>
          </div>
          <h3 class="text-2xl font-headline mb-1">Surface Cleaner</h3>
          <p class="text-sm text-on-surface-variant font-label mb-2 uppercase tracking-widest">No 12 - Eucalyptus Mint</p>
          <p class="text-lg font-medium text-primary">$22.00</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="bg-slate-100 pt-20 pb-10">
  <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-slate-200/50 pt-16">
    <div>
      <div class="font-headline italic text-2xl text-cyan-800 mb-6">Azure Clean</div>
      <p class="text-slate-600 font-body text-sm max-w-sm mb-8 leading-relaxed">The Clinical Editorial of Home Care. Curating a pristine environment through botanical science and intentional design.</p>
      <div class="flex space-x-6">
        <a class="text-slate-400 hover:text-cyan-600 transition-colors" href="#">Instagram</a>
        <a class="text-slate-400 hover:text-cyan-600 transition-colors" href="#">Pinterest</a>
        <a class="text-slate-400 hover:text-cyan-600 transition-colors" href="#">Journal</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-8">
      <div>
        <h4 class="font-bold text-xs uppercase tracking-[0.2em] text-cyan-800 mb-6">Collection</h4>
        <ul class="space-y-4 text-sm font-label">
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Laundry</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Kitchen</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Bathroom</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Fragrances</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-xs uppercase tracking-[0.2em] text-cyan-800 mb-6">Information</h4>
        <ul class="space-y-4 text-sm font-label">
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Sustainability</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Wholesale</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Contact</a></li>
          <li><a class="text-slate-600 hover:text-cyan-500 transition-colors" href="#">Terms</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-slate-200/30 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide text-slate-400">
    <span>© 2024 Azure Clean. The Clinical Editorial of Home Care.</span>
    <div class="mt-4 md:mt-0 space-x-6">
      <span>Designed for a Greener World.</span>
      <span>Crafted in Switzerland.</span>
    </div>
  </div>
</footer>
`;

export default function HomePage() {
  return (
    <>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="afterInteractive" />
      <Script id="tailwind-config" strategy="afterInteractive">{`
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface-dim": "#dadada",
                "surface-container": "#eeeeee",
                "on-surface": "#1a1c1c",
                "tertiary-fixed": "#fae500",
                "surface-container-lowest": "#ffffff",
                "inverse-primary": "#6ed5e8",
                "on-tertiary-fixed-variant": "#4f4800",
                "inverse-surface": "#2f3131",
                "secondary-fixed": "#d6e4f2",
                "on-surface-variant": "#3e494b",
                "error": "#ba1a1a",
                "tertiary-fixed-dim": "#dbc900",
                "outline": "#6e797c",
                "primary-fixed": "#9fefff",
                "surface-container-low": "#f4f3f3",
                "on-tertiary-fixed": "#1f1c00",
                "on-primary-fixed-variant": "#004e59",
                "surface-tint": "#006876",
                "primary-fixed-dim": "#6ed5e8",
                "on-secondary": "#ffffff",
                "secondary-fixed-dim": "#bac8d6",
                "secondary-container": "#d3e1ef",
                "tertiary": "#695f00",
                "tertiary-container": "#bdad00",
                "surface-variant": "#e2e2e2",
                "secondary": "#53606c",
                "surface-container-high": "#e8e8e8",
                "background": "#f9f9f9",
                "surface-container-highest": "#e2e2e2",
                "error-container": "#ffdad6",
                "primary": "#006673",
                "on-primary-fixed": "#001f25",
                "on-error": "#ffffff",
                "on-secondary-container": "#576470",
                "on-background": "#1a1c1c",
                "on-primary-container": "#f8feff",
                "surface": "#f9f9f9",
                "on-secondary-fixed-variant": "#3b4854",
                "on-tertiary-container": "#474000",
                "on-error-container": "#93000a",
                "on-secondary-fixed": "#101d27",
                "on-primary": "#ffffff",
                "surface-bright": "#f9f9f9",
                "primary-container": "#008091",
                "inverse-on-surface": "#f1f1f1",
                "outline-variant": "#bdc9cb",
                "on-tertiary": "#ffffff"
              },
              fontFamily: {
                headline: ["Newsreader", "serif"],
                body: ["Manrope", "sans-serif"],
                label: ["Manrope", "sans-serif"]
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" }
            }
          }
        };
      `}</Script>

      <div dangerouslySetInnerHTML={{ __html: HOME_HTML }} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap");
            @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

            .site-header,
            .site-footer,
            .mobile-bottom-nav {
              display: none !important;
            }

            .site-main {
              padding: 0 !important;
            }

            .material-symbols-outlined {
              font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
            }

            .glass-nav {
              backdrop-filter: blur(12px);
            }

            .liquid-gradient {
              background: linear-gradient(135deg, #006673 0%, #008091 100%);
            }
          `,
        }}
      />
    </>
  );
}
