"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    console.log("Login payload:", formData);
  };

  const login = async () => {
    const response = await axios.post("http://localhost:5000/api/login", formData);
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      router.push("/"); // Redirect to dashboard after successful login
      // Handle successful login
    }else{
      toast.error("Invalid username or password!");
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

            <button type="submit" className={styles.submitBtn}>
              Log in
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