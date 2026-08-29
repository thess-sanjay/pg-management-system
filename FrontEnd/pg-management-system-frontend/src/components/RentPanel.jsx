import { motion } from "motion/react";
import {
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getRents,
  getRentSummary,
} from "../services/api";


function RentPanel() {

  // =====================================================
  // CURRENT MONTH
  // =====================================================

  const [selectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );


  // =====================================================
  // DATA
  // =====================================================

  const [summary, setSummary] = useState(null);
  const [rents, setRents] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD RENT DATA
  // =====================================================

  useEffect(() => {

    const loadRentData = async () => {

      try {

        setLoading(true);

        const [
          summaryData,
          rentData,
        ] = await Promise.all([

          getRentSummary(selectedMonth),

          getRents(),

        ]);


        setSummary(summaryData);

        // Only show records for current month
        const monthlyRents = rentData.filter(
          (rent) =>
            rent.month === selectedMonth
        );

        setRents(monthlyRents);

      } catch (error) {

        console.error(
          "Failed to load dashboard rent data:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadRentData();

  }, [selectedMonth]);


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // MONTH NAME
  // =====================================================

  const formattedMonth = new Date(
    `${selectedMonth}-01`
  ).toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );


  // =====================================================
  // PENDING RENTS
  // =====================================================

  const pendingRents = rents.filter(
    (rent) =>
      rent.status?.toUpperCase() ===
      "PENDING"
  );


  // =====================================================
  // PAID RENTS
  // =====================================================

  const paidRents = rents.filter(
    (rent) =>
      rent.status?.toUpperCase() ===
      "PAID"
  );


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="panel rent-panel">

        <div className="rent-panel-loading">
          Loading rent data...
        </div>

      </div>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <motion.div
      className="panel rent-panel"
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rent-panel-header">

        <div>

          <span className="eyebrow">
            RENT OVERVIEW
          </span>

          <h2>
            Rent
          </h2>

          <p>
            {formattedMonth}
          </p>

        </div>

        <div className="rent-panel-icon">
          <IndianRupee size={20} />
        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="rent-panel-summary">


        {/* Expected */}

        <div className="rent-stat">

          <div className="rent-stat-icon">
            <IndianRupee size={16} />
          </div>

          <div>

            <span>
              Expected
            </span>

            <strong>
              {formatCurrency(
                summary?.totalRentExpected
              )}
            </strong>

          </div>

        </div>


        {/* Received */}

        <div className="rent-stat">

          <div className="rent-stat-icon">
            <CheckCircle size={16} />
          </div>

          <div>

            <span>
              Received
            </span>

            <strong>
              {formatCurrency(
                summary?.totalRentReceived
              )}
            </strong>

          </div>

        </div>


        {/* Outstanding */}

        <div className="rent-stat">

          <div className="rent-stat-icon">
            <AlertCircle size={16} />
          </div>

          <div>

            <span>
              Outstanding
            </span>

            <strong>
              {formatCurrency(
                summary?.totalOutstanding
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          PAYMENT STATUS
      ================================================= */}

      <div className="rent-payment-status">

        <div className="payment-status-item">

          <CheckCircle size={16} />

          <span>
            Paid tenants
          </span>

          <strong>
            {paidRents.length}
          </strong>

        </div>


        <div className="payment-status-item">

          <Clock size={16} />

          <span>
            Pending tenants
          </span>

          <strong>
            {pendingRents.length}
          </strong>

        </div>

      </div>


      {/* =================================================
          PENDING TENANTS
      ================================================= */}

      <div className="pending-rent-section">

        <div className="pending-rent-header">

          <span className="eyebrow">
            PAYMENT PENDING
          </span>

          <h3>
            Pending tenants
          </h3>

        </div>


        {pendingRents.length === 0 ? (

          <div className="no-pending-rent">

            <CheckCircle size={18} />

            <span>
              All tenants have paid
            </span>

          </div>

        ) : (

          <div className="pending-rent-list">

            {pendingRents.map(
              (rent) => (

                <div
                  className="pending-rent-item"
                  key={rent.id}
                >

                  <div className="pending-rent-icon">

                    <Users size={16} />

                  </div>


                  <div className="pending-rent-info">

                    <strong>
                      {rent.tenant?.name ||
                        "Unknown tenant"}
                    </strong>

                    <span>

                      Room{" "}
                      {rent.tenant?.room
                        ?.roomNumber ||
                        "N/A"}

                    </span>

                  </div>


                  <div className="pending-rent-amount">

                    <strong>
                      {formatCurrency(
                        rent.rentAmount
                      )}
                    </strong>

                    <span>
                      {rent.dueDate
                        ? `Due ${rent.dueDate}`
                        : "Due date not set"}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </motion.div>

  );

}


export default RentPanel;