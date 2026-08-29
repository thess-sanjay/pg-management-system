import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  DoorOpen,
  Users,
  WalletCards,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {

  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();


  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {

    setProfileOpen(false);

    navigate("/profile");

  };


  // =====================================================
  // SETTINGS
  // =====================================================

  const handleSettings = () => {

    setProfileOpen(false);

    navigate("/settings");

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    // Remove authentication data if stored
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");

    sessionStorage.clear();

    setProfileOpen(false);

    navigate("/");

  };


  return (

    <aside className="sidebar">


      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="brand">

        <div className="brand-mark">
          P
        </div>

        <div>

          <h2>
            PGMS
          </h2>

          <span>
            Management System
          </span>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="nav-section">

        <p className="nav-label">
          WORKSPACE
        </p>


        {/* OVERVIEW */}

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >

          <LayoutDashboard size={19} />

          <span>
            Overview
          </span>

        </NavLink>


        {/* ROOMS */}

        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >

          <DoorOpen size={19} />

          <span>
            Rooms
          </span>

        </NavLink>


        {/* TENANTS */}

        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >

          <Users size={19} />

          <span>
            Tenants
          </span>

        </NavLink>


        {/* RENT */}

        <NavLink
          to="/rent"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >

          <WalletCards size={19} />

          <span>
            Rent
          </span>

        </NavLink>

      </div>


      {/* =====================================================
          SIDEBAR BOTTOM
      ===================================================== */}

      <div className="sidebar-bottom">


        {/* SYSTEM STATUS */}

        <div className="sidebar-status">

          <span className="status-dot"></span>

          <div>

            <strong>
              System online
            </strong>

            <small>
              All services operational
            </small>

          </div>

        </div>


        {/* =====================================================
            PROFILE CONTROLLER
        ===================================================== */}

        <div className="profile-wrapper">


          <button
            type="button"
            className="profile-mini"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
          >

            <div className="avatar">
              S
            </div>


            <div className="profile-info">

              <strong>
                Sanjay
              </strong>

              <small>
                Administrator
              </small>

            </div>


            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "profile-arrow-open"
                  : ""
              }
            />

          </button>


          {/* =====================================================
              PROFILE DROPDOWN
          ===================================================== */}

          {profileOpen && (

            <div className="profile-dropdown">


              {/* PROFILE */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleProfile}
              >

                <User size={17} />

                <span>
                  Profile
                </span>

              </button>


              {/* SETTINGS */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleSettings}
              >

                <Settings size={17} />

                <span>
                  Settings
                </span>

              </button>


              <div className="profile-dropdown-divider"></div>


              {/* LOGOUT */}

              <button
                type="button"
                className="profile-dropdown-item logout"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>


            </div>

          )}

        </div>

      </div>

    </aside>

  );

}

export default Sidebar;