type SkipLinkProps = {
  targetId?: string;
  label?: string;
};

export function SkipLink({
  targetId = "main-content",
  label = "Pular para o conteúdo",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
    >
      {label}
    </a>
  );
}
