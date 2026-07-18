export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-stone-600 sm:px-6 lg:px-8">
        <p>© {currentYear} Nome da Marca. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
