import Image from "next/image";

export default function Avatar({ size }) {
  let width = "w-12";
  if (size === "lg") {
    width = "w-24";
  }

  return (
    <div className={`${width} rounded-full overflow-hidden`}>
      <Image src="/images/avatar.webp" alt="image" width={100} height={100} />
    </div>
  );
}
