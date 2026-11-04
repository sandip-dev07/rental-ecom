import { notFound } from "next/navigation";
import RentalStorefront from "@/components/rental-storefront";
import { products } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);
  return {
    title: product
      ? `${product.name} on rent | Rento`
      : "Product not found | Rento",
    description: product?.description,
  };
}
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);
  if (!product) notFound();
  return <RentalStorefront product={product} />;
}
