
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import {
  IndianRupee,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BedDouble,
} from "lucide-react";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getRents,
  getTenants,
  createRent,
  updateRent,
  getRentSummary,
} from "../services/api";


function Rent() {

  const [searchParams] = useSearchParams();

  // =====================================================
  // DATA
  // =====================================================

  const [rents, setRents] = useState([]);
  const [tenants, setTenants] = useState([]);

  // =====================================================
  // PAGE STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =====================================================
  // MONTH
  // =====================================================

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const [summary, setSummary] = useState(null);

  // =====================================================
  // MENU
  // =====================================================

  const [openMenu, setOpenMenu] = useState(null);

  // =====================================================
  // ADD RENT MODAL
  // =====================================================

  const [showAddRent, setShowAddRent] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState("");
  const [rentAmount, setRentAmount] = useState("");

  const [rentMonth, setRentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [rentStatus, setRentStatus] = useState("PENDING");
  const [dueDate, setDueDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // =====================================================
  // EDIT RENT MODAL
  // =====================================================

  const [showEditRent, setShowEditRent] = useState(false);
  const [editingRent, setEditingRent] = useState(null);

  const [editRentAmount, setEditRentAmount] = useState("");
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editDueDate, setEditDueDate] = useState("");

  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const [rentData, tenantData] = await Promise.all([
        getRents(),
        getTenants(),
      ]);

      setRents(rentData);
      setTenants(tenantData);

    } catch (err) {

      console.error(err);

      setError(
        err.message || "Unable to load rent records"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD SUMMARY
  // =====================================================

  const loadSummary = async () => {

    try {

      const summaryData =
        await getRentSummary(selectedMonth);

      setSummary(summaryData);

    } catch (err) {

      console.error(err);

      setSummary(null);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const fetchInitialData = async () => {

      try {

        setLoading(true);
        setError("");

        const [rentData, tenantData] = await Promise.all([
          getRents(),
          getTenants(),
        ]);

        setRents(rentData);
        setTenants(tenantData);

      } catch (err) {

        console.error(err);

        setError(
          err.message || "Unable to load rent records"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchInitialData();

  }, []);


  // =====================================================
  // LOAD MONTH SUMMARY
  // =====================================================

  useEffect(() => {

    const fetchSummary = async () => {

      try {

        const summaryData =
          await getRentSummary(selectedMonth);

        setSummary(summaryData);

      } catch (err) {

        console.error(err);

        setSummary(null);

      }

    };

    fetchSummary();

  }, [selectedMonth]);


  // =====================================================
  // FILTER RENTS
  // =====================================================

  const filteredRents = rents.filter((rent) => {

    const search = searchTerm.toLowerCase();

    const tenantName =
      rent.tenant?.name?.toLowerCase() || "";

    const roomNumber =
      rent.tenant?.room?.roomNumber?.toLowerCase() || "";

    const month =
      rent.month?.toLowerCase() || "";

    const matchesSearch =
      tenantName.includes(search) ||
      roomNumber.includes(search) ||
      month.includes(search);


    // =================================================
    // STATUS FILTER
    // =================================================

    if (statusFilter === "ALL") {

      return matchesSearch;

    }


    if (statusFilter === "OVERDUE") {

      return (
        matchesSearch &&
        isOverdue(rent)
      );

    }


    return (
      matchesSearch &&
      rent.status?.toUpperCase() === statusFilter
    );

  });


  // =====================================================
  // RESET ADD FORM
  // =====================================================

  const resetAddForm = () => {

    setSelectedTenant("");
    setRentAmount("");
    setRentMonth(selectedMonth);
    setRentStatus("PENDING");
    setDueDate("");
    setFormError("");

  };


  // =====================================================
  // OPEN ADD RENT
  // =====================================================

  const openAddRentModal = () => {

    resetAddForm();

    setShowAddRent(true);

  };


  // =====================================================
  // CLOSE ADD RENT
  // =====================================================

  const closeAddRentModal = () => {

    if (saving) {

      return;

    }

    setShowAddRent(false);

    resetAddForm();

  };


  // =====================================================
  // CREATE RENT
  // =====================================================

  const handleAddRent = async (event) => {

    event.preventDefault();

    setFormError("");


    // -----------------------------------------------
    // Tenant validation
    // -----------------------------------------------

    if (!selectedTenant) {

      setFormError(
        "Please select a tenant"
      );

      return;

    }


    // -----------------------------------------------
    // Amount validation
    // -----------------------------------------------

    if (!rentAmount) {

      setFormError(
        "Rent amount is required"
      );

      return;

    }


    if (Number(rentAmount) <= 0) {

      setFormError(
        "Rent amount must be greater than 0"
      );

      return;

    }


    // -----------------------------------------------
    // Month validation
    // -----------------------------------------------

    if (!rentMonth) {

      setFormError(
        "Rent month is required"
      );

      return;

    }


    // -----------------------------------------------
    // Find tenant
    // -----------------------------------------------

    const tenant = tenants.find(
      (item) =>
        String(item.id) ===
        String(selectedTenant)
    );


    if (!tenant) {

      setFormError(
        "Selected tenant not found"
      );

      return;

    }


    // -----------------------------------------------
    // Duplicate check
    // -----------------------------------------------

    const duplicate = rents.some(
      (rent) =>
        String(rent.tenant?.id) ===
          String(selectedTenant) &&
        rent.month === rentMonth
    );


    if (duplicate) {

      setFormError(
        "Rent record already exists for this tenant and month"
      );

      return;

    }


    try {

      setSaving(true);


      await createRent({

        rentAmount:
          Number(rentAmount),

        month:
          rentMonth,

        status:
          rentStatus,

        dueDate:
          dueDate || null,

        tenant: {
          id:
            Number(selectedTenant),
        },

      });


      setShowAddRent(false);

      resetAddForm();

      await loadData();

      await loadSummary();

    } catch (err) {

      console.error(err);

      setFormError(
        err.message ||
        "Unable to create rent record"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // OPEN EDIT RENT
  // =====================================================

  const openEditRentModal = (rent) => {

    setEditingRent(rent);

    setEditRentAmount(
      rent.rentAmount || ""
    );

    setEditStatus(
      rent.status || "PENDING"
    );

    setEditDueDate(
      rent.dueDate || ""
    );

    setEditError("");

    setOpenMenu(null);

    setShowEditRent(true);

  };


  // =====================================================
  // CLOSE EDIT RENT
  // =====================================================

  const closeEditRentModal = () => {

    if (editSaving) {

      return;

    }

    setShowEditRent(false);

    setEditingRent(null);

    setEditError("");

  };


  // =====================================================
  // UPDATE RENT
  // =====================================================

  const handleEditRent = async (event) => {

    event.preventDefault();

    setEditError("");


    // -----------------------------------------------
    // Amount validation
    // -----------------------------------------------

    if (!editRentAmount) {

      setEditError(
        "Rent amount is required"
      );

      return;

    }


    if (Number(editRentAmount) <= 0) {

      setEditError(
        "Rent amount must be greater than 0"
      );

      return;

    }


    // -----------------------------------------------
    // Status validation
    // -----------------------------------------------

    if (
      editStatus !== "PAID" &&
      editStatus !== "PENDING"
    ) {

      setEditError(
        "Invalid rent status"
      );

      return;

    }


    try {

      setEditSaving(true);


      await updateRent(
        editingRent.id,
        {
          rentAmount:
            Number(editRentAmount),

          status:
            editStatus,

          dueDate:
            editDueDate || null,
        }
      );


      setShowEditRent(false);

      setEditingRent(null);

      await loadData();

      await loadSummary();

    } catch (err) {

      console.error(err);

      setEditError(
        err.message ||
        "Unable to update rent"
      );

    } finally {

      setEditSaving(false);

    }

  };


  // =====================================================
  // MARK RENT AS PAID
  // =====================================================

  const markAsPaid = async (rent) => {

    try {

      await updateRent(
        rent.id,
        {
          rentAmount:
            Number(rent.rentAmount),

          status:
            "PAID",

          dueDate:
            rent.dueDate || null,
        }
      );


      setOpenMenu(null);

      await loadData();

      await loadSummary();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to update rent"
      );

    }

  };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };
useEffect(() => {

  const tenantId = searchParams.get("tenantId");

  if (!tenantId || rents.length === 0) {
    return;
  }

  const targetRent = rents.find(
    (rent) =>
      String(rent.tenant?.id) === String(tenantId)
  );

  if (!targetRent) {
    return;
  }

  setTimeout(() => {

    const element = document.getElementById(
      `rent-${targetRent.id}`
    );

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    }

  }, 300);

}, [rents, searchParams]);

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="app-shell">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <section className="rent-page">


          {/* =================================================
              HEADER
          ================================================= */}

          <motion.div
            className="page-header"
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

            <div>

              <span className="eyebrow">
                RENT MANAGEMENT
              </span>

              <h1>
                Rent
              </h1>

              <p>
                Track monthly rent payments,
                outstanding amounts and due dates.
              </p>

            </div>


            <button
              className="primary-button"
              onClick={openAddRentModal}
            >

              <Plus size={17} />

              Add rent

            </button>

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
              MONTH SELECTOR
          ================================================= */}

          <div className="rent-month-toolbar">

            <div>

              <span className="eyebrow">
                MONTH
              </span>

              <input
                type="month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="rent-summary">


            <RentSummaryCard
              icon={<Users size={19} />}
              label="Total tenants"
              value={
                summary?.totalTenants ?? 0
              }
            />


            <RentSummaryCard
              icon={<IndianRupee size={19} />}
              label="Rent expected"
              value={formatCurrency(
                summary?.totalRentExpected
              )}
            />


            <RentSummaryCard
              icon={<CheckCircle size={19} />}
              label="Rent received"
              value={formatCurrency(
                summary?.totalRentReceived
              )}
            />


            <RentSummaryCard
              icon={<AlertCircle size={19} />}
              label="Outstanding"
              value={formatCurrency(
                summary?.totalOutstanding
              )}
            />

          </div>


          {/* =================================================
              STATUS SUMMARY
          ================================================= */}

          <div className="rent-status-summary">


            <button
              className={
                statusFilter === "ALL"
                  ? "rent-filter active"
                  : "rent-filter"
              }
              onClick={() =>
                setStatusFilter("ALL")
              }
            >

              <Users size={16} />

              All

              <strong>
                {rents.length}
              </strong>

            </button>


            <button
              className={
                statusFilter === "PAID"
                  ? "rent-filter active"
                  : "rent-filter"
              }
              onClick={() =>
                setStatusFilter("PAID")
              }
            >

              <CheckCircle size={16} />

              Paid

              <strong>
                {
                  rents.filter(
                    (rent) =>
                      rent.status?.toUpperCase() ===
                      "PAID"
                  ).length
                }
              </strong>

            </button>


            <button
              className={
                statusFilter === "PENDING"
                  ? "rent-filter active"
                  : "rent-filter"
              }
              onClick={() =>
                setStatusFilter("PENDING")
              }
            >

              <Clock size={16} />

              Pending

              <strong>
                {
                  rents.filter(
                    (rent) =>
                      rent.status?.toUpperCase() ===
                      "PENDING"
                  ).length
                }
              </strong>

            </button>


            <button
              className={
                statusFilter === "OVERDUE"
                  ? "rent-filter active"
                  : "rent-filter"
              }
              onClick={() =>
                setStatusFilter("OVERDUE")
              }
            >

              <AlertCircle size={16} />

              Overdue

              <strong>
                {
                  rents.filter(
                    (rent) =>
                      isOverdue(rent)
                  ).length
                }
              </strong>

            </button>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="rent-toolbar">

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search tenant, room or month..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="rent-loading">
              Loading rent records...
            </div>

          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            filteredRents.length === 0 && (

              <motion.div
                className="rent-empty"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >

                <IndianRupee size={35} />

                <h3>
                  No rent records found
                </h3>

                <p>
                  Add a rent record to start
                  tracking payments.
                </p>

              </motion.div>

            )}


          {/* =================================================
              RENT CARDS
          ================================================= */}

          {!loading &&
            filteredRents.length > 0 && (

              <div className="rent-grid">

                {filteredRents.map(
                  (rent, index) => {

                    const overdue =
                      isOverdue(rent);

                    const paid =
                      rent.status?.toUpperCase() ===
                      "PAID";


                    return (

                   <motion.div
  id={`rent-${rent.id}`}
  key={rent.id}
  className="rent-card"
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.4,
                          delay:
                            index * 0.06,
                        }}
                        whileHover={{
                          y: -4,
                        }}
                      >


                        {/* Card Header */}

                        <div className="rent-card-header">

                          <div>

                            <span className="tenant-label">
                              RENT RECORD
                            </span>

                            <h2>
                              {rent.tenant?.name ||
                                "Unknown tenant"}
                            </h2>

                          </div>


                          <div className="tenant-menu-wrapper">

                            <button
                              className="more-button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    rent.id
                                    ? null
                                    : rent.id
                                )
                              }
                            >

                              <MoreHorizontal
                                size={19}
                              />

                            </button>


                            {openMenu ===
                              rent.id && (

                              <div className="room-menu">

                                <button
                                  onClick={() =>
                                    openEditRentModal(
                                      rent
                                    )
                                  }
                                >
                                  Edit Rent
                                </button>


                                {!paid && (

                                  <button
                                    onClick={() =>
                                      markAsPaid(
                                        rent
                                      )
                                    }
                                  >
                                    Mark as Paid
                                  </button>

                                )}

                              </div>

                            )}

                          </div>

                        </div>


                        {/* Amount */}

                        <div className="rent-amount">

                          <span>
                            Rent amount
                          </span>

                          <strong>
                            {formatCurrency(
                              rent.rentAmount
                            )}
                          </strong>

                        </div>


                        {/* Tenant Info */}

                        <div className="tenant-info">

                          <div>

                            <BedDouble size={15} />

                            <span>
                              Room{" "}
                              {rent.tenant?.room
                                ?.roomNumber ||
                                "Not assigned"}
                            </span>

                          </div>


                          <div>

                            <Users size={15} />

                            <span>
                              {rent.month}
                            </span>

                          </div>

                        </div>


                        {/* Dates */}

                        <div className="rent-dates">

                          <div>

                            <span>
                              Due date
                            </span>

                            <strong
                              className={
                                overdue
                                  ? "overdue-text"
                                  : ""
                              }
                            >

                              {rent.dueDate ||
                                "Not provided"}

                            </strong>

                          </div>


                          <div>

                            <span>
                              Paid date
                            </span>

                            <strong>
                              {rent.paidDate ||
                                "Not paid"}
                            </strong>

                          </div>

                        </div>


                        {/* Status */}

                        <div className="rent-card-footer">

                          <span
                            className={
                              paid
                                ? "rent-status paid"
                                : overdue
                                ? "rent-status overdue"
                                : "rent-status pending"
                            }
                          >

                            {paid
                              ? "PAID"
                              : overdue
                              ? "OVERDUE"
                              : "PENDING"}

                          </span>

                        </div>

                      </motion.div>

                    );

                  }
                )}

              </div>

            )}


          {/* =================================================
              ADD RENT MODAL
          ================================================= */}

          {showAddRent && (

            <div className="modal-overlay">

              <motion.div
                className="room-modal"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >

                <div className="modal-header">

                  <div>

                    <span className="eyebrow">
                      RENT MANAGEMENT
                    </span>

                    <h2>
                      Add Rent
                    </h2>

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={closeAddRentModal}
                  >
                    ×
                  </button>

                </div>


                <form onSubmit={handleAddRent}>


                  {/* Tenant */}

                  <div className="form-group">

                    <label>
                      Tenant
                    </label>

                    <select
                      value={selectedTenant}
                      onChange={(event) =>
                        setSelectedTenant(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select tenant
                      </option>

                      {tenants.map(
                        (tenant) => (

                          <option
                            key={tenant.id}
                            value={tenant.id}
                          >

                            {tenant.name}
                            {" — Room "}
                            {tenant.room
                              ?.roomNumber ||
                              "N/A"}

                          </option>

                        )
                      )}

                    </select>

                  </div>


                  {/* Amount */}

                  <div className="form-group">

                    <label>
                      Rent Amount
                    </label>

                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 8000"
                      value={rentAmount}
                      onChange={(event) =>
                        setRentAmount(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* Month */}

                  <div className="form-group">

                    <label>
                      Month
                    </label>

                    <input
                      type="month"
                      value={rentMonth}
                      onChange={(event) =>
                        setRentMonth(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* Due Date */}

                  <div className="form-group">

                    <label>
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) =>
                        setDueDate(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* Status */}

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      value={rentStatus}
                      onChange={(event) =>
                        setRentStatus(
                          event.target.value
                        )
                      }
                    >

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="PAID">
                        Paid
                      </option>

                    </select>

                  </div>


                  {formError && (

                    <div className="form-error">
                      {formError}
                    </div>

                  )}


                  <div className="modal-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={closeAddRentModal}
                      disabled={saving}
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="primary-button"
                      disabled={saving}
                    >

                      {saving
                        ? "Adding..."
                        : "Add Rent"}

                    </button>

                  </div>

                </form>

              </motion.div>

            </div>

          )}


          {/* =================================================
              EDIT RENT MODAL
          ================================================= */}

          {showEditRent && (

            <div className="modal-overlay">

              <motion.div
                className="room-modal"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >

                <div className="modal-header">

                  <div>

                    <span className="eyebrow">
                      RENT MANAGEMENT
                    </span>

                    <h2>
                      Edit Rent
                    </h2>

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={closeEditRentModal}
                  >
                    ×
                  </button>

                </div>


                <form onSubmit={handleEditRent}>


                  {/* Tenant */}

                  <div className="form-group">

                    <label>
                      Tenant
                    </label>

                    <input
                      type="text"
                      value={
                        editingRent?.tenant?.name ||
                        ""
                      }
                      disabled
                    />

                  </div>


                  {/* Amount */}

                  <div className="form-group">

                    <label>
                      Rent Amount
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={editRentAmount}
                      onChange={(event) =>
                        setEditRentAmount(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* Due Date */}

                  <div className="form-group">

                    <label>
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(event) =>
                        setEditDueDate(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* Status */}

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      value={editStatus}
                      onChange={(event) =>
                        setEditStatus(
                          event.target.value
                        )
                      }
                    >

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="PAID">
                        Paid
                      </option>

                    </select>

                  </div>


                  {editError && (

                    <div className="form-error">
                      {editError}
                    </div>

                  )}


                  <div className="modal-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={closeEditRentModal}
                      disabled={editSaving}
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="primary-button"
                      disabled={editSaving}
                    >

                      {editSaving
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                  </div>

                </form>

              </motion.div>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}


// =====================================================
// RENT SUMMARY CARD
// =====================================================

function RentSummaryCard({
  icon,
  label,
  value,
}) {

  return (

    <motion.div
      className="rent-summary-card"
      whileHover={{
        y: -3,
      }}
    >

      <div className="summary-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </motion.div>

  );

}


// =====================================================
// OVERDUE CHECK
// =====================================================

function isOverdue(rent) {

  if (
    rent.status?.toUpperCase() !==
    "PENDING"
  ) {

    return false;

  }


  if (!rent.dueDate) {

    return false;

  }


  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  return rent.dueDate < today;

}


export default Rent;

