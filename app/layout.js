import { DM_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";
import QueryProvider from "@/query/QueryProvider";
import MyProvider from "@/context/MyProvider";
import SocketProvider from "@/context/SocketProvider";
import { ToastContainer } from "react-toastify";
import FacebookPixel from "@/components/analytics/FacebookPixel";

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const hind_siliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bivasstyle.com",
  ),
  title: {
    default: "Bivas Style | Muslim Fashion & Handcrafted Clothing",
    template: "%s | Bivas Style",
  },
  description:
    "Explore authentic Muslim fashion, handcrafted sarees, elegant kurtis, and traditional wear at Bivas Style. Premium fabrics with nationwide delivery in Bangladesh.",
  keywords: [
    "Bivas Style",
    "Muslim fashion",
    "Bangladeshi clothing",
    "handcrafted saree",
    "kurti",
    "three piece",
    "two piece",
    "modest clothing online",
  ],
  authors: [{ name: "Bivas Style" }],
  creator: "Bivas Style",
  publisher: "Bivas Style",
  openGraph: {
    title: "Bivas Style | Muslim Fashion & Handcrafted Clothing",
    description:
      "Explore authentic Muslim fashion, handcrafted sarees, elegant kurtis, and traditional wear at Bivas Style.",
    url: "https://bivasstyle.com",
    siteName: "Bivas Style",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/logo.svg",
        width: 1200,
        height: 630,
        alt: "Bivas Style - Muslim Fashion & Handcrafted Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bivas Style | Muslim Fashion & Handcrafted Clothing",
    description:
      "Explore authentic Muslim fashion, handcrafted sarees, elegant kurtis, and traditional wear at Bivas Style.",
    images: ["/assets/logo.svg"],
  },
  icons: {
    icon: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dm_sans.variable} ${hind_siliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full font-dm-sans">
        <FacebookPixel />
        <QueryProvider>
          <SocketProvider>
            <MyProvider>
              <ToastContainer />
              {children}
            </MyProvider>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
