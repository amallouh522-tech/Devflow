import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Dashboard",
};

// كل صفحات الداشبورد: نافبار + سايدبار الداشبورد
export default function DashboardLayout({ children }) {
  return <AppShell variant="dashboard">{children}</AppShell>;
}
