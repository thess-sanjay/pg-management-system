
import { motion } from "motion/react";

import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  BedDouble,
  Mail,
  Phone,
  Camera,
  CreditCard,
} from "lucide-react";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getRooms,
} from "../services/api";


// =====================================================
// CLOUDINARY CONFIG
// =====================================================

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  "pgms_tenant_images";


// =====================================================
// CLOUDINARY IMAGE UPLOAD
// =====================================================

async function uploadToCloudinary(file) {

  if (!file) {
    return "";
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name is not configured"
    );
  }

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to upload profile picture"
    );
  }

  const data =
    await response.json();

  return data.secure_url;
}


// =====================================================
// TENANTS COMPONENT
// =====================================================

function Tenants() {

  // =====================================================
  // TENANTS
  // =====================================================

  const [tenants, setTenants] = useState([]);

  // =====================================================
  // ROOMS
  // =====================================================

  const [rooms, setRooms] = useState([]);

  // =====================================================
  // PAGE STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // ADD TENANT MODAL
  // =====================================================

  const [showAddTenant, setShowAddTenant] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [aadharNumber, setAadharNumber] =
    useState("");

  const [profilePicture, setProfilePicture] =
    useState("");

  const [profileFile, setProfileFile] =
    useState(null);

  const [joiningDate, setJoiningDate] =
    useState("");

  const [selectedRoom, setSelectedRoom] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  // =====================================================
  // EDIT TENANT MODAL
  // =====================================================

  const [showEditTenant, setShowEditTenant] =
    useState(false);

  const [editingTenant, setEditingTenant] =
    useState(null);

  const [editName, setEditName] =
    useState("");

  const [editPhone, setEditPhone] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  const [editAadharNumber, setEditAadharNumber] =
    useState("");

  const [editProfilePicture, setEditProfilePicture] =
    useState("");

  const [editProfileFile, setEditProfileFile] =
    useState(null);

  const [editJoiningDate, setEditJoiningDate] =
    useState("");

  const [editSelectedRoom, setEditSelectedRoom] =
    useState("");

  const [editSaving, setEditSaving] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // =====================================================
  // MENU
  // =====================================================

  const [openMenu, setOpenMenu] =
    useState(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async (showLoader = true) => {

    try {

      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const [
        tenantData,
        roomData,
      ] = await Promise.all([
        getTenants(),
        getRooms(),
      ]);

      setTenants(tenantData);
      setRooms(roomData);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load tenants"
      );

    } finally {

      if (showLoader) {
        setLoading(false);
      }

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    let mounted = true;

    const fetchData = async () => {

      try {

        const [
          tenantData,
          roomData,
        ] = await Promise.all([
          getTenants(),
          getRooms(),
        ]);

        if (!mounted) {
          return;
        }

        setTenants(tenantData);
        setRooms(roomData);

      } catch (err) {

        console.error(err);

        if (mounted) {

          setError(
            err.message ||
            "Unable to load tenants"
          );

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    fetchData();

    return () => {
      mounted = false;
    };

  }, []);


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTenants =
    tenants.length;

  const totalCapacity =
    rooms.reduce(
      (total, room) =>
        total +
        Number(room.capacity || 0),
      0
    );

  const occupiedBeds =
    tenants.length;

  const availableBeds =
    Math.max(
      totalCapacity -
      occupiedBeds,
      0
    );


  // =====================================================
  // FILTER TENANTS
  // =====================================================

  const filteredTenants =
    tenants.filter((tenant) => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return (

        tenant.name
          ?.toLowerCase()
          .includes(search) ||

        tenant.phone
          ?.toLowerCase()
          .includes(search) ||

        tenant.email
          ?.toLowerCase()
          .includes(search) ||

        tenant.aadharNumber
          ?.toLowerCase()
          .includes(search) ||

        tenant.room
          ?.roomNumber
          ?.toLowerCase()
          .includes(search)

      );

    });


  // =====================================================
  // RESET ADD FORM
  // =====================================================

  const resetForm = () => {

    setName("");
    setPhone("");
    setEmail("");
    setAadharNumber("");
    setProfilePicture("");
    setProfileFile(null);
    setJoiningDate("");
    setSelectedRoom("");
    setFormError("");

  };


  // =====================================================
  // OPEN ADD TENANT MODAL
  // =====================================================

  const openAddTenantModal = () => {

    resetForm();

    setShowAddTenant(true);

  };


  // =====================================================
  // CLOSE ADD TENANT MODAL
  // =====================================================

  const closeAddTenantModal = () => {

    if (saving) {
      return;
    }

    setShowAddTenant(false);

    resetForm();

  };


  // =====================================================
  // PROFILE PICTURE CHANGE - ADD
  // =====================================================

  const handleProfilePictureChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // -----------------------------------------------
    // File type validation
    // -----------------------------------------------

    if (!file.type.startsWith("image/")) {

      setFormError(
        "Please select a valid image file"
      );

      return;

    }

    // -----------------------------------------------
    // File size validation
    // -----------------------------------------------

    if (file.size > 5 * 1024 * 1024) {

      setFormError(
        "Profile picture must be less than 5 MB"
      );

      return;

    }

    setFormError("");

    setProfileFile(file);

    setProfilePicture(
      URL.createObjectURL(file)
    );

  };


  // =====================================================
  // ADD TENANT
  // =====================================================

  const handleAddTenant = async (event) => {

    event.preventDefault();

    setFormError("");

    // -------------------------
    // NAME
    // -------------------------

    if (!name.trim()) {

      setFormError(
        "Name is required"
      );

      return;

    }


    // -------------------------
    // PHONE
    // -------------------------

    if (!phone.trim()) {

      setFormError(
        "Phone is required"
      );

      return;

    }

    if (
      !/^[0-9]{10}$/.test(
        phone.trim()
      )
    ) {

      setFormError(
        "Phone must contain exactly 10 digits"
      );

      return;

    }


    // -------------------------
    // EMAIL
    // -------------------------

    if (!email.trim()) {

      setFormError(
        "Email is required"
      );

      return;

    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {

      setFormError(
        "Invalid email format"
      );

      return;

    }


    // -------------------------
    // AADHAAR
    // -------------------------

    if (
      aadharNumber &&
      !/^[0-9]{12}$/.test(
        aadharNumber.trim()
      )
    ) {

      setFormError(
        "Aadhaar number must contain exactly 12 digits"
      );

      return;

    }


    // -------------------------
    // ROOM
    // -------------------------

    if (!selectedRoom) {

      setFormError(
        "Please select a room"
      );

      return;

    }

    const room =
      rooms.find(
        (room) =>
          String(room.id) ===
          String(selectedRoom)
      );

    if (!room) {

      setFormError(
        "Selected room not found"
      );

      return;

    }

    const capacity =
      Number(
        room.capacity || 0
      );

    const occupied =
      Number(
        room.occupiedBeds || 0
      );

    if (occupied >= capacity) {

      setFormError(
        `Room ${room.roomNumber} is full`
      );

      return;

    }


    // -------------------------
    // CREATE
    // -------------------------

    try {

      setSaving(true);

      let uploadedImageUrl =
        profilePicture;


      // -----------------------------------------------
      // Upload image to Cloudinary
      // -----------------------------------------------

      if (profileFile) {

        uploadedImageUrl =
          await uploadToCloudinary(
            profileFile
          );

      }


      // -----------------------------------------------
      // Send tenant to backend
      // -----------------------------------------------

      await createTenant({

        name:
          name.trim(),

        phone:
          phone.trim(),

        email:
          email.trim(),

        aadharNumber:
          aadharNumber.trim() ||
          null,

        profilePicture:
          uploadedImageUrl ||
          null,

        joiningDate:
          joiningDate ||
          null,

        room: {
          id:
            Number(selectedRoom),
        },

      });


      resetForm();

      setShowAddTenant(false);

      await loadData(false);

    } catch (err) {

      console.error(err);

      setFormError(
        err.message ||
        "Unable to create tenant"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // OPEN EDIT TENANT MODAL
  // =====================================================

  const openEditTenantModal =
    (tenant) => {

      setEditingTenant(tenant);

      setEditName(
        tenant.name || ""
      );

      setEditPhone(
        tenant.phone || ""
      );

      setEditEmail(
        tenant.email || ""
      );

      setEditAadharNumber(
        tenant.aadharNumber || ""
      );

      setEditProfilePicture(
        tenant.profilePicture || ""
      );

      setEditProfileFile(
        null
      );

      setEditJoiningDate(
        tenant.joiningDate || ""
      );

      setEditSelectedRoom(
        tenant.room?.id
          ? String(
              tenant.room.id
            )
          : ""
      );

      setEditError("");

      setOpenMenu(null);

      setShowEditTenant(true);

    };


  // =====================================================
  // CLOSE EDIT TENANT MODAL
  // =====================================================

  const closeEditTenantModal = () => {

    if (editSaving) {
      return;
    }

    setShowEditTenant(false);

    setEditingTenant(null);

    setEditProfileFile(null);

    setEditError("");

  };


  // =====================================================
  // EDIT PROFILE PICTURE CHANGE
  // =====================================================

  const handleEditProfilePictureChange =
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }


      // -----------------------------------------------
      // File type validation
      // -----------------------------------------------

      if (!file.type.startsWith("image/")) {

        setEditError(
          "Please select a valid image file"
        );

        return;

      }


      // -----------------------------------------------
      // File size validation
      // -----------------------------------------------

      if (file.size > 5 * 1024 * 1024) {

        setEditError(
          "Profile picture must be less than 5 MB"
        );

        return;

      }

      setEditError("");

      setEditProfileFile(file);

      setEditProfilePicture(
        URL.createObjectURL(file)
      );

    };


  // =====================================================
  // UPDATE TENANT
  // =====================================================

  const handleEditTenant =
    async (event) => {

      event.preventDefault();

      setEditError("");


      // -------------------------
      // NAME
      // -------------------------

      if (!editName.trim()) {

        setEditError(
          "Name is required"
        );

        return;

      }


      // -------------------------
      // PHONE
      // -------------------------

      if (!editPhone.trim()) {

        setEditError(
          "Phone is required"
        );

        return;

      }

      if (
        !/^[0-9]{10}$/.test(
          editPhone.trim()
        )
      ) {

        setEditError(
          "Phone must contain exactly 10 digits"
        );

        return;

      }


      // -------------------------
      // EMAIL
      // -------------------------

      if (!editEmail.trim()) {

        setEditError(
          "Email is required"
        );

        return;

      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          editEmail.trim()
        )
      ) {

        setEditError(
          "Invalid email format"
        );

        return;

      }


      // -------------------------
      // AADHAAR
      // -------------------------

      if (
        editAadharNumber &&
        !/^[0-9]{12}$/.test(
          editAadharNumber.trim()
        )
      ) {

        setEditError(
          "Aadhaar number must contain exactly 12 digits"
        );

        return;

      }


      // -------------------------
      // ROOM
      // -------------------------

      if (!editSelectedRoom) {

        setEditError(
          "Please select a room"
        );

        return;

      }

      const room =
        rooms.find(
          (room) =>
            String(room.id) ===
            String(editSelectedRoom)
        );

      if (!room) {

        setEditError(
          "Selected room not found"
        );

        return;

      }

      const capacity =
        Number(
          room.capacity || 0
        );

      const occupied =
        Number(
          room.occupiedBeds || 0
        );

      const currentRoomId =
        editingTenant?.room?.id;

      const isChangingRoom =
        String(currentRoomId) !==
        String(editSelectedRoom);

      if (
        isChangingRoom &&
        occupied >= capacity
      ) {

        setEditError(
          `Room ${room.roomNumber} is full`
        );

        return;

      }


      // -------------------------
      // UPDATE
      // -------------------------

      try {

        setEditSaving(true);

        let uploadedImageUrl =
          editProfilePicture;


        // -----------------------------------------------
        // Upload replacement image
        // -----------------------------------------------

        if (editProfileFile) {

          uploadedImageUrl =
            await uploadToCloudinary(
              editProfileFile
            );

        }


        await updateTenant(
          editingTenant.id,
          {

            name:
              editName.trim(),

            phone:
              editPhone.trim(),

            email:
              editEmail.trim(),

            aadharNumber:
              editAadharNumber.trim() ||
              null,

            profilePicture:
              uploadedImageUrl ||
              null,

            joiningDate:
              editJoiningDate ||
              null,

            room: {
              id:
                Number(
                  editSelectedRoom
                ),
            },

          }
        );


        setShowEditTenant(false);

        setEditingTenant(null);

        setEditProfileFile(null);

        setEditError("");

        await loadData(false);

      } catch (err) {

        console.error(err);

        setEditError(
          err.message ||
          "Unable to update tenant"
        );

      } finally {

        setEditSaving(false);

      }

    };


  // =====================================================
  // DELETE TENANT
  // =====================================================

  const handleDeleteTenant =
    async (tenant) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${tenant.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setOpenMenu(null);

        await deleteTenant(
          tenant.id
        );

        await loadData(false);

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to delete tenant"
        );

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="app-shell">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <section className="tenants-page">


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
                TENANT MANAGEMENT
              </span>

              <h1>
                Tenants
              </h1>

              <p>
                Manage tenants, rooms and contact information.
              </p>

            </div>


            <button
              className="primary-button"
              onClick={
                openAddTenantModal
              }
            >

              <Plus size={17} />

              Add tenant

            </button>

          </motion.div>


          {/* =================================================
              ADD TENANT MODAL
          ================================================= */}

          {showAddTenant && (

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
                transition={{
                  duration: 0.2,
                }}
              >

                <div className="modal-header">

                  <div>

                    <span className="eyebrow">
                      TENANT MANAGEMENT
                    </span>

                    <h2>
                      Add Tenant
                    </h2>

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={
                      closeAddTenantModal
                    }
                  >
                    ×
                  </button>

                </div>


                <form
                  onSubmit={
                    handleAddTenant
                  }
                >


                  {/* PROFILE PICTURE */}

                  <div className="form-group">

                    <label>
                      Profile Picture
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >

                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background:
                            "#1a1f1a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          flexShrink: 0,
                        }}
                      >

                        {profilePicture ? (

                          <img
                            src={
                              profilePicture
                            }
                            alt="Profile preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit:
                                "cover",
                            }}
                          />

                        ) : (

                          <Users
                            size={28}
                          />

                        )}

                      </div>


                      <div>

                        <label
                          htmlFor="profile-picture"
                          className="secondary-button"
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "7px",
                            cursor:
                              "pointer",
                          }}
                        >

                          <Camera
                            size={16}
                          />

                          Choose image

                        </label>

                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={
                            handleProfilePictureChange
                          }
                          style={{
                            display: "none",
                          }}
                        />

                        <small
                          style={{
                            display:
                              "block",
                            marginTop:
                              "6px",
                            opacity:
                              0.65,
                          }}
                        >
                          JPG, PNG or WEBP.
                          Max 5 MB.
                        </small>

                      </div>

                    </div>

                  </div>


                  {/* NAME */}

                  <div className="form-group">

                    <label>
                      Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Sanjay Saravanan"
                      value={name}
                      onChange={
                        (event) =>
                          setName(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* PHONE */}

                  <div className="form-group">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      maxLength="10"
                      value={phone}
                      onChange={
                        (event) =>
                          setPhone(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                      }
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="e.g. sanjay@gmail.com"
                      value={email}
                      onChange={
                        (event) =>
                          setEmail(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* AADHAAR */}

                  <div className="form-group">

                    <label>
                      Aadhaar Number
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="12"
                      placeholder="Enter 12-digit Aadhaar number"
                      value={
                        aadharNumber
                      }
                      onChange={
                        (event) =>
                          setAadharNumber(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                      }
                    />

                  </div>


                  {/* JOINING DATE */}

                  <div className="form-group">

                    <label>
                      Joining Date
                    </label>

                    <input
                      type="date"
                      value={
                        joiningDate
                      }
                      onChange={
                        (event) =>
                          setJoiningDate(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* ROOM */}

                  <div className="form-group">

                    <label>
                      Room
                    </label>

                    <select
                      value={
                        selectedRoom
                      }
                      onChange={
                        (event) =>
                          setSelectedRoom(
                            event.target.value
                          )
                      }
                    >

                      <option value="">
                        Select room
                      </option>


                      {rooms.map(
                        (room) => {

                          const capacity =
                            Number(
                              room.capacity ||
                              0
                            );

                          const occupied =
                            Number(
                              room.occupiedBeds ||
                              0
                            );

                          const available =
                            Math.max(
                              capacity -
                              occupied,
                              0
                            );

                          const isFull =
                            available <=
                            0;


                          return (

                            <option
                              key={
                                room.id
                              }
                              value={
                                room.id
                              }
                              disabled={
                                isFull
                              }
                            >

                              Room{" "}
                              {
                                room.roomNumber
                              }

                              {" — "}

                              {
                                available
                              }

                              {" "}
                              beds available

                            </option>

                          );

                        }
                      )}

                    </select>

                  </div>


                  {/* ERROR */}

                  {formError && (

                    <div className="form-error">
                      {formError}
                    </div>

                  )}


                  {/* ACTIONS */}

                  <div className="modal-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        closeAddTenantModal
                      }
                      disabled={
                        saving
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="primary-button"
                      disabled={
                        saving
                      }
                    >

                      {saving
                        ? "Adding..."
                        : "Add Tenant"}

                    </button>

                  </div>

                </form>

              </motion.div>

            </div>

          )}


          {/* =================================================
              EDIT TENANT MODAL
          ================================================= */}

          {showEditTenant && (

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
                transition={{
                  duration: 0.2,
                }}
              >

                <div className="modal-header">

                  <div>

                    <span className="eyebrow">
                      TENANT MANAGEMENT
                    </span>

                    <h2>
                      Edit Tenant
                    </h2>

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={
                      closeEditTenantModal
                    }
                  >
                    ×
                  </button>

                </div>


                <form
                  onSubmit={
                    handleEditTenant
                  }
                >


                  {/* PROFILE PICTURE */}

                  <div className="form-group">

                    <label>
                      Profile Picture
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >

                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background:
                            "#1a1f1a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          flexShrink: 0,
                        }}
                      >

                        {editProfilePicture ? (

                          <img
                            src={
                              editProfilePicture
                            }
                            alt="Profile preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit:
                                "cover",
                            }}
                          />

                        ) : (

                          <Users
                            size={28}
                          />

                        )}

                      </div>


                      <div>

                        <label
                          htmlFor="edit-profile-picture"
                          className="secondary-button"
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "7px",
                            cursor:
                              "pointer",
                          }}
                        >

                          <Camera
                            size={16}
                          />

                          Change image

                        </label>

                        <input
                          id="edit-profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={
                            handleEditProfilePictureChange
                          }
                          style={{
                            display: "none",
                          }}
                        />

                      </div>

                    </div>

                  </div>


                  {/* NAME */}

                  <div className="form-group">

                    <label>
                      Name
                    </label>

                    <input
                      type="text"
                      value={
                        editName
                      }
                      onChange={
                        (event) =>
                          setEditName(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* PHONE */}

                  <div className="form-group">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      maxLength="10"
                      value={
                        editPhone
                      }
                      onChange={
                        (event) =>
                          setEditPhone(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                      }
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={
                        editEmail
                      }
                      onChange={
                        (event) =>
                          setEditEmail(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* AADHAAR */}

                  <div className="form-group">

                    <label>
                      Aadhaar Number
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="12"
                      value={
                        editAadharNumber
                      }
                      onChange={
                        (event) =>
                          setEditAadharNumber(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                      }
                    />

                  </div>


                  {/* JOINING DATE */}

                  <div className="form-group">

                    <label>
                      Joining Date
                    </label>

                    <input
                      type="date"
                      value={
                        editJoiningDate
                      }
                      onChange={
                        (event) =>
                          setEditJoiningDate(
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* ROOM */}

                  <div className="form-group">

                    <label>
                      Room
                    </label>

                    <select
                      value={
                        editSelectedRoom
                      }
                      onChange={
                        (event) =>
                          setEditSelectedRoom(
                            event.target.value
                          )
                      }
                    >

                      <option value="">
                        Select room
                      </option>


                      {rooms.map(
                        (room) => {

                          const capacity =
                            Number(
                              room.capacity ||
                              0
                            );

                          const occupied =
                            Number(
                              room.occupiedBeds ||
                              0
                            );

                          const available =
                            Math.max(
                              capacity -
                              occupied,
                              0
                            );

                          const isCurrentRoom =
                            String(
                              room.id
                            ) ===
                            String(
                              editingTenant
                                ?.room
                                ?.id
                            );

                          const isFull =
                            available <=
                            0;


                          return (

                            <option
                              key={
                                room.id
                              }
                              value={
                                room.id
                              }
                              disabled={
                                isFull &&
                                !isCurrentRoom
                              }
                            >

                              Room{" "}
                              {
                                room.roomNumber
                              }

                              {" — "}

                              {
                                isCurrentRoom
                                  ? `${available} beds available (current)`
                                  : `${available} beds available`
                              }

                            </option>

                          );

                        }
                      )}

                    </select>

                  </div>


                  {/* ERROR */}

                  {editError && (

                    <div className="form-error">
                      {editError}
                    </div>

                  )}


                  {/* ACTIONS */}

                  <div className="modal-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        closeEditTenantModal
                      }
                      disabled={
                        editSaving
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="primary-button"
                      disabled={
                        editSaving
                      }
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
              SUMMARY
          ================================================= */}

          <div className="tenant-summary">

            <SummaryCard
              icon={
                <Users size={19} />
              }
              label="Total tenants"
              value={
                String(
                  totalTenants
                ).padStart(2, "0")
              }
            />


            <SummaryCard
              icon={
                <BedDouble size={19} />
              }
              label="Occupied beds"
              value={
                String(
                  occupiedBeds
                ).padStart(2, "0")
              }
            />


            <SummaryCard
              icon={
                <BedDouble size={19} />
              }
              label="Available beds"
              value={
                String(
                  availableBeds
                ).padStart(2, "0")
              }
            />

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="tenants-toolbar">

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search tenants..."
                value={
                  searchTerm
                }
                onChange={
                  (event) =>
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

            <div className="tenants-loading">
              Loading tenants...
            </div>

          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            filteredTenants.length ===
              0 && (

              <motion.div
                className="tenants-empty"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >

                <Users
                  size={35}
                />

                <h3>
                  No tenants found
                </h3>

                <p>

                  {searchTerm
                    ? "Try a different search."
                    : "There are currently no tenants available."}

                </p>

              </motion.div>

            )}


          {/* =================================================
              TENANT CARDS
          ================================================= */}

          {!loading &&
            filteredTenants.length >
              0 && (

              <div className="tenants-grid">

                {filteredTenants.map(
                  (
                    tenant,
                    index
                  ) => (

                    <motion.div
                      key={
                        tenant.id
                      }
                      className="tenant-card"
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
                          index *
                          0.08,
                      }}
                      whileHover={{
                        y: -5,
                      }}
                    >


                      {/* CARD HEADER */}

                      <div className="tenant-card-header">

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "12px",
                          }}
                        >

                          {/* PROFILE IMAGE */}

                          <div
                            style={{
                              width:
                                "52px",
                              height:
                                "52px",
                              borderRadius:
                                "50%",
                              overflow:
                                "hidden",
                              background:
                                "#1a1f1a",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              flexShrink:
                                0,
                            }}
                          >

                            {tenant.profilePicture ? (

                              <img
                                src={
                                  tenant.profilePicture
                                }
                                alt={
                                  `${tenant.name} profile`
                                }
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />

                            ) : (

                              <Users
                                size={
                                  22
                                }
                              />

                            )}

                          </div>


                          <div>

                            <span className="tenant-label">
                              TENANT
                            </span>

                            <h2>
                              {
                                tenant.name
                              }
                            </h2>

                          </div>

                        </div>


                        <div className="tenant-menu-wrapper">

                          <button
                            className="more-button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  tenant.id
                                  ? null
                                  : tenant.id
                              )
                            }
                          >

                            <MoreHorizontal
                              size={
                                19
                              }
                            />

                          </button>


                          {openMenu ===
                            tenant.id && (

                            <div className="room-menu">

                              <button
                                onClick={() =>
                                  openEditTenantModal(
                                    tenant
                                  )
                                }
                              >
                                Edit Tenant
                              </button>

                              <button
                                className="delete-action"
                                onClick={() =>
                                  handleDeleteTenant(
                                    tenant
                                  )
                                }
                              >
                                Delete Tenant
                              </button>

                            </div>

                          )}

                        </div>

                      </div>


                      {/* CONTACT */}

                      <div className="tenant-info">

                        <div>

                          <Phone
                            size={15}
                          />

                          <span>
                            {
                              tenant.phone
                            }
                          </span>

                        </div>


                        <div>

                          <Mail
                            size={15}
                          />

                          <span>
                            {
                              tenant.email
                            }
                          </span>

                        </div>

                      </div>


                      {/* AADHAAR */}

                      <div className="tenant-info">

                        <div>

                          <CreditCard
                            size={15}
                          />

                          <span>

                            {tenant.aadharNumber
                              ? `Aadhaar: ${tenant.aadharNumber}`
                              : "Aadhaar: Not provided"}

                          </span>

                        </div>

                      </div>


                      {/* ROOM */}

                      <div className="tenant-room">

                        <BedDouble
                          size={16}
                        />

                        <span>

                          Room{" "}

                          {
                            tenant.room
                              ?.roomNumber ||
                            "Not assigned"
                          }

                        </span>

                      </div>


                      {/* FOOTER */}

                      <div className="tenant-footer">

                        <span>
                          Joining date
                        </span>

                        <strong>

                          {
                            tenant.joiningDate ||
                            "Not provided"
                          }

                        </strong>

                      </div>

                    </motion.div>

                  )
                )}

              </div>

            )}

        </section>

      </main>

    </div>

  );

}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  label,
  value,
}) {

  return (

    <motion.div
      className="tenant-summary-card"
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


export default Tenants;

