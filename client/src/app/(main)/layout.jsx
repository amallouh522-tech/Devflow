import AppShell from "@/components/AppShell";
import SideProfile from "@/components/SideProfile";

// كل صفحات التصفّح: نافبار + سايدبار الهوم + عمود البروفايل
// الـ layout ما بينعاد رسمه عند التنقل، فالسايدبار والنافبار بيضلوا ثابتين
export default function MainLayout({ children }) {
  return <AppShell aside={<SideProfile />}>{children}</AppShell>;
}
