export default function BrandLogo({ onPhoto = false }: { onPhoto?: boolean }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/${onPhoto ? 'escalae-primary.png' : 'escalae-horizontal.png'}`}
      alt="Escalaê"
      width={onPhoto ? 1167 : 2172}
      height={onPhoto ? 778 : 724}
      className={onPhoto
        ? 'relative z-10 h-auto w-44 max-w-full self-start lg:w-80'
        : 'h-auto w-32 shrink-0 sm:w-44'}
    />
  );
}
