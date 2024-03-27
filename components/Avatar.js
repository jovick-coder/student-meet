import Image from "next/image";

export default function Avatar({ size }) {
  let width = "w-12";
  if (size === "lg") {
    width = "w-24";
  }

  return (
    <div className={`${width} rounded-full overflow-hidden`}>
      <Image src="/images/profile.jpg" alt="image" width={10} height={10} />
    </div>
  );
}
