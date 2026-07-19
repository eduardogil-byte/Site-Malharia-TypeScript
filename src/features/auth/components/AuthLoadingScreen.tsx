export function AuthLoadingScreen() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-stone-100 px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="mx-auto size-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-900"
          aria-hidden="true"
        />

        <p className="mt-4 text-sm font-medium text-stone-600">
          Verificando acesso...
        </p>
      </div>
    </main>
  );
}
