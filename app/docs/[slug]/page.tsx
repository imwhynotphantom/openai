import { notFound } from "next/navigation";
import DocPage from "@/components/screens/DocPage";
import { docSlugs } from "@/lib/docs";

export function generateStaticParams() {
  return docSlugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  if (!docSlugs.includes(params.slug)) notFound();
  return <DocPage slug={params.slug} />;
}
