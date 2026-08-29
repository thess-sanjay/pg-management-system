import { useEffect, useState } from "react";

import {
  UserPlus,
  CircleCheck,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

import {
  getTenants,
  getRents,
} from "../services/api";


function ActivityPanel() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD ACTIVITY
  // ==========================================

  async function loadActivity() {

    try {

      const [tenants, rents] = await Promise.all([
        getTenants(),
        getRents(),
      ]);

      const activityList = [];


      // ==========================================
      // TENANT ACTIVITIES
      // ==========================================

      tenants.forEach((tenant) => {

        if (tenant.joiningDate) {

          activityList.push({
            type: "tenant",
            title: "New tenant joined",

            description: tenant.room
              ? `${tenant.name} • Room ${tenant.room.roomNumber}`
              : tenant.name,

            date: new Date(tenant.joiningDate),
          });

        }

      });


      // ==========================================
      // RENT ACTIVITIES
      // ==========================================

      rents.forEach((rent) => {

        const tenantName =
          rent.tenant?.name || "Tenant";


        // ------------------------------------------
        // PAID RENT
        // ------------------------------------------

        if (
          rent.status?.toUpperCase() === "PAID" &&
          rent.paidDate
        ) {

          activityList.push({
            type: "paid",

            title: "Rent payment received",

            description:
              `${tenantName} • ₹${rent.rentAmount}`,

            date: new Date(rent.paidDate),
          });

        }


        // ------------------------------------------
        // PENDING RENT
        // ------------------------------------------

        if (
          rent.status?.toUpperCase() === "PENDING" &&
          rent.dueDate
        ) {

          activityList.push({
            type: "pending",

            title: "Rent payment pending",

            description:
              `${tenantName} • ₹${rent.rentAmount}`,

            date: new Date(rent.dueDate),
          });

        }

      });


      // ==========================================
      // REMOVE INVALID DATES
      // ==========================================

      const validActivities =
        activityList.filter(
          (activity) =>
            activity.date &&
            !isNaN(activity.date.getTime())
        );


      // ==========================================
      // LATEST FIRST
      // ==========================================

      validActivities.sort(
        (a, b) => b.date - a.date
      );


      // ==========================================
      // SHOW LATEST 6
      // ==========================================

      setActivities(
        validActivities.slice(0, 6)
      );

    } catch (error) {

      console.error(
        "Failed to load activity:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // LOAD + AUTO REFRESH
  // ==========================================

useEffect(() => {

  // Initial load
  const initialLoad = setTimeout(() => {
    loadActivity();
  }, 0);


  // Refresh every 10 seconds
  const interval = setInterval(() => {
    loadActivity();
  }, 10000);


  // Refresh when returning to dashboard
  const handleFocus = () => {
    loadActivity();
  };

  window.addEventListener(
    "focus",
    handleFocus
  );


  return () => {

    clearTimeout(initialLoad);

    clearInterval(interval);

    window.removeEventListener(
      "focus",
      handleFocus
    );

  };

}, []);


  // ==========================================
  // ICON
  // ==========================================

  function getIcon(type) {

    switch (type) {

      case "tenant":
        return <UserPlus size={18} />;

      case "paid":
        return <CircleCheck size={18} />;

      case "pending":
        return <Clock3 size={18} />;

      default:
        return <ArrowUpRight size={18} />;

    }

  }


  // ==========================================
  // DATE FORMAT
  // ==========================================

  function formatDate(date) {

    if (!date || isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      id="activity"
      className="panel activity-panel"
    >

      {/* HEADER */}

      <div className="activity-header">

        <div>

          <span className="eyebrow">
            RECENT ACTIVITY
          </span>

          <h2>
            Activity
          </h2>

        </div>

        <ArrowUpRight size={20} />

      </div>


      {/* CONTENT */}

      {loading ? (

        <div className="activity-empty">
          Loading activity...
        </div>

      ) : activities.length === 0 ? (

        <div className="activity-empty">
          No recent activity
        </div>

      ) : (

        <div className="activity-list">

          {activities.map(
            (activity, index) => (

              <div
                className="activity-item"
                key={`${activity.type}-${activity.title}-${index}`}
              >

                {/* ICON */}

                <div
                  className={`activity-icon ${activity.type}`}
                >
                  {getIcon(activity.type)}
                </div>


                {/* DETAILS */}

                <div className="activity-details">

                  <h3>
                    {activity.title}
                  </h3>

                  <p>
                    {activity.description}
                  </p>

                </div>


                {/* DATE */}

                <span className="activity-date">
                  {formatDate(activity.date)}
                </span>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


export default ActivityPanel;