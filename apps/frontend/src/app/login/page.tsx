"use client";

export default function LoginPage() {
  return (
    <div className="pt-20 pb-10 min-h-screen bg-surface flex items-center">
      <div className="max-w-md mx-auto px-6 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-surface-variant">
          <h1 className="text-3xl font-bold mb-8 text-center">Вход</h1>
          <button className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-container transition-colors">
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}