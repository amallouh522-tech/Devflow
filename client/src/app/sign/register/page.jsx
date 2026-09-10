"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./register.module.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
    console.log("Register payload:", formData);
  };

  const register = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      if (response.status === 200 || response.data.status === 200) {
        toast.success("Registered successfully!");
      } else if (response.data.status === 422) {
        toast.error("Username or email already exists!");
      }
      
      else {
        toast.error("An error occurred while registering the account!");
      }
    } catch (error) {
      // التعامل مع أخطاء السيرفر أو الاتصال
      const errorMessage =
        error.response?.data?.message || "An error occurred while registering!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 🟢 إضافة حاوية التنبيهات هنا لكي تظهر الـ Toasts */}
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
            <h2 className={styles.heroTitle}>Welcome back, Developer!</h2>
            <p className={styles.heroSubtitle}>
              Create a new account to manage your projects and workflows.
            </p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className={styles.rightSection}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create a new account</h1>
            <p className={styles.formSubtitle}>
              Already have an account?{" "}
              <Link href="/sign/login" className={styles.link}>
                Log in
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
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
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

            <button type="submit" className={styles.submitBtn}>
              Create Account
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