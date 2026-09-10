"use client";
import "./css/home.css";

import { useEffect } from "react";

export default function Login() {

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/sign/login";
    }
  })


  return (
    <div className="HomePage">
      <h2>Welcome to DevFlow</h2>
    </div>
  )
}
