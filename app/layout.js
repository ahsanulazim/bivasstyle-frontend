import { DM_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";
import QueryProvider from "@/query/QueryProvider";
import MyProvider from "@/context/MyProvider";
import SocketProvider from "@/context/SocketProvider";
import { ToastContainer } from "react-toastify";

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
  title: "Oiki",
  description: "Muslim Fashion",
  icons: {
    icon: "/assets/oiki-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dm_sans.variable} ${hind_siliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full font-dm-sans">
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
