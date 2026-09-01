import { motion } from "motion/react";
import {
  ArrowUpRight,
  DoorOpen,
  Users,
  BedDouble,
  CircleDollarSign,
} from "lucide-react";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import OccupancyPanel from "../components/OccupancyPanel";
import RentPanel from "../components/RentPanel";
import ActivityPanel from "../components/ActivityPanel";

import {
  getRooms,
  getTenants,
  getRents,
  getRentSummary,
} from "../services/api";


function Dashboard() {

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rents, setRents] = useState([]);
  const [rentSummary, setRentSummary] = useState(null);


  // =====================================================
  // PAGE STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [dashboardActivity, setDashboardActivity] = useState(() => {

    const savedSettings =
      localStorage.getItem("pgms-settings");

    if (savedSettings) {

      try {

        const parsedSettings =
          JSON.parse(savedSettings);

        return parsedSettings.dashboardActivity ?? true;

      } catch (error) {

        console.error(
          "Failed to load dashboard settings:",
          error
        );

      }

    }

    return true;

  });


  // =====================================================
  // CURRENT MONTH
  // =====================================================

  const currentMonth =
    new Date().toISOString().slice(0, 7);


  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          roomData,
          tenantData,
          rentData,
          summaryData,
        ] = await Promise.all([

          getRooms(),

          getTenants(),

          getRents(),

          getRentSummary(currentMonth),

        ]);


        setRooms(roomData);

        setTenants(tenantData);

        setRents(rentData);

        setRentSummary(summaryData);


      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to load dashboard data"
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, [currentMonth]);


  // =====================================================
  // LISTEN FOR SETTINGS CHANGES
  // =====================================================

  useEffect(() => {

    const handleSettingsChange = () => {

      const savedSettings =
        localStorage.getItem("pgms-settings");

      if (!savedSettings) {
        return;
      }


      try {

        const parsedSettings =
          JSON.parse(savedSettings);

        setDashboardActivity(
          parsedSettings.dashboardActivity ?? true
        );

      } catch (error) {

        console.error(
          "Failed to read dashboard settings:",
          error
        );

      }

    };


    // Load current setting

    handleSettingsChange();


    // Listen for changes from another browser tab

    window.addEventListener(
      "storage",
      handleSettingsChange
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleSettingsChange
      );

    };

  }, []);


  // =====================================================
  // ROOM STATISTICS
  // =====================================================

  const totalRooms =
    rooms.length;


  const totalCapacity =
    rooms.reduce(
      (total, room) =>
        total +
        Number(room.capacity || 0),
      0
    );


  // =====================================================
  // TENANT / BED STATISTICS
  // =====================================================

  const totalTenants =
    tenants.length;


  const occupiedBeds =
    tenants.length;


  const availableBeds =
    Math.max(
      totalCapacity - occupiedBeds,
      0
    );


  const occupancyPercentage =
    totalCapacity > 0
      ? Math.round(
          (occupiedBeds /
            totalCapacity) *
            100
        )
      : 0;


  // =====================================================
  // FULLY OCCUPIED ROOMS
  // =====================================================

  const fullyOccupiedRooms =
    rooms.filter((room) => {

      const capacity =
        Number(room.capacity || 0);

      const occupied =
        Number(room.occupiedBeds || 0);

      return (
        capacity > 0 &&
        occupied >= capacity
      );

    }).length;


  // =====================================================
  // RENT STATISTICS
  // =====================================================

  const outstandingRent =
    Number(
      rentSummary?.totalOutstanding || 0
    );


  const pendingPayments =
    rents.filter((rent) => {

      if (
        rent.month !== currentMonth
      ) {
        return false;
      }

      return (
        rent.status?.toUpperCase() ===
        "PENDING"
      );

    }).length;


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // DATE / GREETING
  // =====================================================

  const now =
    new Date();


  const hour =
    now.getHours();


  let greeting =
    "Good evening";


  if (hour < 12) {

    greeting =
      "Good morning";

  } else if (hour < 17) {

    greeting =
      "Good afternoon";

  }


  const formattedDate =
    now.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    ).toUpperCase();


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="app-shell">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      <main className="main-content">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <Topbar />


        <section className="dashboard">


          {/* =================================================
              WELCOME
          ================================================= */}

          <motion.div
            className="welcome"

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.45,
            }}
          >

            <div>

              <span className="eyebrow">

                {formattedDate}

              </span>


              <h1>

                {greeting}, Admin{" "}

                <span>
                  👋
                </span>

              </h1>


              <p>
                Here's what's happening across your PG today.
              </p>

            </div>


            {/* =================================================
                VIEW ACTIVITY BUTTON
            ================================================= */}

            {dashboardActivity && (

              <button
                className="primary-button"

                onClick={() => {

                  document
                    .getElementById("activity")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });

                }}
              >

                <ArrowUpRight size={17} />

                View activity

              </button>

            )}

          </motion.div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <motion.div
              className="error-message"

              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              {error}

            </motion.div>

          )}


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">


            {/* TOTAL ROOMS */}

            <StatCard

              icon={
                <DoorOpen size={20} />
              }

              label="Total Rooms"

              value={
                loading
                  ? "--"
                  : String(
                      totalRooms
                    ).padStart(2, "0")
              }

              detail={
                loading
                  ? "Loading..."
                  : `${fullyOccupiedRooms} room${
                      fullyOccupiedRooms === 1
                        ? ""
                        : "s"
                    } fully occupied`
              }

              delay={0.05}

            />


            {/* TOTAL TENANTS */}

            <StatCard

              icon={
                <Users size={20} />
              }

              label="Total Tenants"

              value={
                loading
                  ? "--"
                  : String(
                      totalTenants
                    ).padStart(2, "0")
              }

              detail={
                loading
                  ? "Loading..."
                  : `${totalTenants} active tenant${
                      totalTenants === 1
                        ? ""
                        : "s"
                    }`
              }

              delay={0.1}

            />


            {/* BED OCCUPANCY */}

            <StatCard

              icon={
                <BedDouble size={20} />
              }

              label="Bed Occupancy"

              value={
                loading
                  ? "--"
                  : `${occupancyPercentage}%`
              }

              detail={
                loading
                  ? "Loading..."
                  : `${occupiedBeds} of ${totalCapacity} beds occupied`
              }

              delay={0.15}

            />


            {/* OUTSTANDING */}

            <StatCard

              icon={
                <CircleDollarSign size={20} />
              }

              label="Outstanding"

              value={
                loading
                  ? "--"
                  : formatCurrency(
                      outstandingRent
                    )
              }

              detail={
                loading
                  ? "Loading..."
                  : `${pendingPayments} pending payment${
                      pendingPayments === 1
                        ? ""
                        : "s"
                    }`
              }

              delay={0.2}

            />

          </div>


          {/* =================================================
              MAIN DASHBOARD PANELS
          ================================================= */}

          <div className="dashboard-grid">

            <OccupancyPanel />

            <RentPanel />

          </div>


          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          {dashboardActivity && (

            <ActivityPanel />

          )}


        </section>

      </main>

    </div>

  );

}


export default Dashboard;