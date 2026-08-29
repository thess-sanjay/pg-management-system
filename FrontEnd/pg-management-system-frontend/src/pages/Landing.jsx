import { useNavigate } from "react-router-dom";

import {
  Home,
  Users,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react";

import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="landing-navbar">

        <div
          className="landing-logo"
          onClick={() => navigate("/")}
        >
          <span className="logo-mark">PG</span>
          <span>PGMS</span>
        </div>

        <div className="navbar-actions">

          <button
            className="landing-register-btn"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Admin Login
            <ArrowRight size={17} />
          </button>

        </div>

      </nav>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <main>

        <section className="landing-hero">

          {/* Background image */}

          <div className="hero-image"></div>

          {/* Dark gradient overlay */}

          <div className="hero-overlay"></div>


          {/* Green ambient glow */}

          <div className="hero-glow"></div>


          {/* Hero content */}

          <div className="hero-content">

            <div className="hero-badge">

              <span className="badge-dot"></span>

              Smart PG Management

            </div>


            <h1>

              Manage your PG Hostel
              <br />

              <span>Simply.</span>

            </h1>


            <p className="hero-description">

              A centralized platform to manage rooms,
              tenants and rent payments with ease.

            </p>


            <div className="hero-actions">

              <button
                className="hero-primary-btn"
                onClick={() => navigate("/login")}
              >

                Get Started

                <ArrowRight size={19} />

              </button>


              <button
                className="hero-secondary-btn"
                onClick={() => navigate("/register")}
              >

                Create Admin Account

              </button>

            </div>


            {/* Small trust information */}

            <div className="hero-trust">

              <div className="trust-item">

                <CheckCircle2 size={15} />

                Secure authentication

              </div>


              <div className="trust-item">

                <CheckCircle2 size={15} />

                Easy management

              </div>


              <div className="trust-item">

                <CheckCircle2 size={15} />

                Real-time tracking

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section className="features-section">

          <div className="section-heading">

            <div className="section-label">

              <span></span>

              FEATURES

            </div>


            <h2>

              Everything you need

              <br />

              <span>in one place.</span>

            </h2>


            <p>

              Powerful tools designed to make managing
              your PG property simple and efficient.

            </p>

          </div>


          <div className="features-grid">


            {/* ROOM MANAGEMENT */}

            <div className="feature-card">

              <div className="feature-icon">

                <Home size={23} />

              </div>


              <div className="feature-number">
                01
              </div>


              <h3>
                Room Management
              </h3>


              <p>

                Keep track of rooms, availability
                and occupancy from one dashboard.

              </p>

            </div>


            {/* TENANT MANAGEMENT */}

            <div className="feature-card">

              <div className="feature-icon">

                <Users size={23} />

              </div>


              <div className="feature-number">
                02
              </div>


              <h3>
                Tenant Management
              </h3>


              <p>

                Manage tenant information and
                keep your resident records organized.

              </p>

            </div>


            {/* RENT TRACKING */}

            <div className="feature-card">

              <div className="feature-icon">

                <IndianRupee size={23} />

              </div>


              <div className="feature-number">
                03
              </div>


              <h3>
                Rent Tracking
              </h3>


              <p>

                Track paid, pending and overdue
                rent payments effortlessly.

              </p>

            </div>


            {/* SECURITY */}

            <div className="feature-card">

              <div className="feature-icon">

                <ShieldCheck size={23} />

              </div>


              <div className="feature-number">
                04
              </div>


              <h3>
                Secure Access
              </h3>


              <p>

                JWT authentication and protected
                APIs keep your management system secure.

              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            MANAGEMENT SECTION
        ===================================================== */}

        <section className="management-section">

          <div className="management-content">

            <div className="section-label">

              <span></span>

              BUILT FOR PG ADMINS

            </div>


            <h2>

              Less paperwork.

              <br />

              <span>More control.</span>

            </h2>


            <p>

              PGMS gives administrators a centralized
              place to manage their entire property,
              from room allocation to monthly rent tracking.

            </p>


            <div className="management-points">

              <div>

                <CheckCircle2 size={18} />

                Manage rooms and occupancy

              </div>


              <div>

                <CheckCircle2 size={18} />

                Maintain tenant records

              </div>


              <div>

                <CheckCircle2 size={18} />

                Track monthly rent payments

              </div>


              <div>

                <CheckCircle2 size={18} />

                Monitor pending and overdue payments

              </div>

            </div>


            <button
              className="management-btn"
              onClick={() => navigate("/login")}
            >

              Go to Dashboard

              <ArrowRight size={18} />

            </button>

          </div>


          {/* Visual card */}

          <div className="management-visual">

            <div className="visual-glow"></div>


            <div className="dashboard-preview">

              <div className="preview-header">

                <div className="preview-title">

                  <Building2 size={17} />

                  PG Overview

                </div>


                <span className="preview-status">
                  Live
                </span>

              </div>


              <div className="preview-stats">

                <div className="preview-stat">

                  <span>Rooms</span>

                  <strong>24</strong>

                  <small>12 available</small>

                </div>


                <div className="preview-stat">

                  <span>Tenants</span>

                  <strong>38</strong>

                  <small>2 new this month</small>

                </div>


                <div className="preview-stat">

                  <span>Rent</span>

                  <strong>₹42K</strong>

                  <small>Collected this month</small>

                </div>

              </div>


              <div className="preview-bar">

                <div className="bar-label">

                  <span>Occupancy</span>

                  <strong>78%</strong>

                </div>

                <div className="bar-track">

                  <div className="bar-fill"></div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="landing-cta">

          <div className="cta-glow"></div>


          <div className="cta-content">

            <div className="section-label">

              <span></span>

              GET STARTED

            </div>


            <h2>

              Ready to manage your PG

              <br />

              <span>smarter?</span>

            </h2>


            <p>

              Start managing your rooms, tenants and
              rent payments from one powerful dashboard.

            </p>


            <div className="cta-actions">

              <button
                className="cta-primary"
                onClick={() => navigate("/register")}
              >

                Create Admin Account

                <ArrowRight size={18} />

              </button>


              <button
                className="cta-secondary"
                onClick={() => navigate("/login")}
              >

                Admin Login

              </button>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">

        <div className="footer-brand">

          <div className="landing-logo">

            <span className="logo-mark">
              P
            </span>

            <span>
              PGMS
            </span>

          </div>


          <p>
            PG Management System
          </p>

        </div>


        <div className="footer-links">

          <button
            onClick={() => navigate("/")}
          >
            Home
          </button>


          <button
            onClick={() => navigate("/login")}
          >
            Admin Login
          </button>


          <button
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>


        <span className="footer-copy">

          © 2026 PGMS

        </span>

      </footer>

    </div>
  );
}

export default Landing;