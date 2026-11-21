export default function BrandLogo({ onPhoto = false }: { onPhoto?: boolean }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}escalae-logo.png`}
      alt="Escalaê"
      width={875}
      height={320}
      className={onPhoto
        ? 'relative z-10 h-auto w-44 max-w-full self-start lg:w-64'
        : 'h-10 w-32 shrink-0 rounded-xl bg-brand-surface object-cover sm:h-11 sm:w-36'}
    />
  );
}
