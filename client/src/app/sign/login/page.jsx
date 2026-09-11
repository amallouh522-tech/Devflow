"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { getSession } from "@/lib/auth";

export default function LoginPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // إذا المستخدم مسجل دخول أصلاً، رجّعه عالرئيسية
  useEffect(() => {
    if (getSession()) router.replace("/");
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  // axios بيرمي خطأ على أي رد غير 2xx، فالخطأ لازم ينمسك بالـ catch
  const login = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, formData);
      localStorage.setItem("token", response.data.token);
      router.replace("/");
    } catch (error) {
      const message = error.response
        ? error.response.data?.error || "Invalid username or password!"
        : "Can't reach the server. Please try again.";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <div className={styles.splitCard}>
        
        {/* Left Side: Code Image & DevFlow Logo */}
        <div className={styles.leftSection}>
          <div className={styles.leftOverlay}></div>
          
          <div className={styles.brandHeader}>
            <div className={styles.logo}>
              Dev<span>Flow</span>
            </div>
          </div>

          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              Welcome back, Developer!
            </h2>
            <p className={styles.heroSubtitle}>
              Log in to manage your projects and workflows.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className={styles.rightSection}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Log in to account</h1>
            <p className={styles.formSubtitle}>
              Don't have an account?{" "}
              <Link href="/sign/register" className={styles.link}>
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className={styles.actionsRow}>
              <Link href="#" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>Or log in with</span>
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.socialBtn} type="button">
              Google
            </button>
            <button className={styles.socialBtn} type="button">
              GitHub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}