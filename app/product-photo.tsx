import Image from "next/image";

export function ProductPhoto({
  nama,
  fotoUrl,
  soldOut = false,
  priority = false,
  sizes,
}: {
  nama: string;
  fotoUrl: string;
  soldOut?: boolean;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <>
      <Image
        src={fotoUrl}
        alt={nama}
        fill
        sizes={sizes}
        unoptimized={/^https?:\/\//i.test(fotoUrl) || fotoUrl.startsWith("/foto-unggahan/")}
        preload={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
      />
      {soldOut && (
        <span className="absolute left-3 top-3 rounded-sm bg-[#a13532] px-2.5 py-1.5 text-xs font-bold tracking-wider text-white">
          SOLD OUT
        </span>
      )}
    </>
  );
}
