import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import NewArrival from "@/components/home/NewArrival";

export const metadata = {
  title: "Bivas Style | Modest Muslim Fashion, Saree & Kurti in Bangladesh",
  description:
    "Discover handcrafted Bengali sarees, designer kurtis, two-piece and three-piece suits at Bivas Style. Authentic modest fashion crafted with ethical excellence.",
  alternates: {
    canonical: "/",
  },
};

const page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://bivasstyle.com/#organization",
        name: "Bivas Style",
        url: "https://bivasstyle.com",
        logo: "https://bivasstyle.com/assets/logo.svg",
        sameAs: ["https://www.facebook.com/bivasstyle"],
      },
      {
        "@type": "WebSite",
        "@id": "https://bivasstyle.com/#website",
        url: "https://bivasstyle.com",
        name: "Bivas Style",
        publisher: {
          "@id": "https://bivasstyle.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://bivasstyle.com/products?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Categories />
      <NewArrival />
    </>
  );
};

export default page;
