import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";

export const metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DashboardLayout({ children }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
