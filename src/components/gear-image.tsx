export function GearImage({
  name,
  alt,
  className = "",
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const images: Record<string, string> = {
    "camera.webp":
      "https://images.sharepal.in/misc/hard-coded/sharepal/dslr-title2.webp",
    "gopro.webp": "https://images.sharepal.in/misc/hard-coded/gopro13.webp",
    "backpack.webp":
      "https://images.sharepal.in/misc/hard-coded/sharepal/bag-tilt.webp",
    "camp.webp":
      "https://images.sharepal.in/misc/hard-coded/sharepal/camp-tilt.webp",
    "photography.webp":
      "https://images.sharepal.in/super-categories/Category+Card+Image.webp",
    "outdoor.webp":
      "https://images.sharepal.in/super-categories/Category+Card+Image+(3).webp",
    "bike.png":
      "https://images.sharepal.in/categories/riding-gear/bikes/original/himalayan-450-on-rent-sharepal-1.png",
    "phone.png": "https://pngimg.com/uploads/iphone/iphone_PNG5735.png",
  };
  // Remote reference assets keep this demo independent of downloaded files.
  // biome-ignore lint/performance/noImgElement: Direct remote assets for this presentation demo.
  return (
    <img
      src={images[name]}
      alt={alt}
      width={560}
      height={440}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
