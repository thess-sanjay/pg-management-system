import { motion } from "motion/react";
import {
  DoorOpen,
  Users,
  BedDouble,
  Plus,
  Search,
  MoreHorizontal,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddRoom, setShowAddRoom] = useState(false);
const [roomNumber, setRoomNumber] = useState("");
const [capacity, setCapacity] = useState("");
const [saving, setSaving] = useState(false);
const [formError, setFormError] = useState("");
const [openMenu, setOpenMenu] = useState(null);


const [showEditRoom, setShowEditRoom] = useState(false);
const [editingRoom, setEditingRoom] = useState(null);
const [editRoomNumber, setEditRoomNumber] = useState("");
const [editCapacity, setEditCapacity] = useState("");
const [editSaving, setEditSaving] = useState(false);
const [editError, setEditError] = useState("");


const [showDeleteRoom, setShowDeleteRoom] = useState(false);
const [deletingRoom, setDeletingRoom] = useState(null);
const [deleteSaving, setDeleteSaving] = useState(false);
const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getRooms()
      .then((data) => {
        if (!cancelled) {
          setRooms(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError("Unable to load rooms");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

      

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate room statistics from API data
  const totalRooms = rooms.length;

  const totalCapacity = rooms.reduce(
    (total, room) => total + Number(room.capacity || 0),
    0
  );

  const occupiedBeds = rooms.reduce(
    (total, room) => total + Number(room.occupiedBeds || 0),
    0
  );

  const availableBeds = totalCapacity - occupiedBeds;

  const fullRooms = rooms.filter(
    (room) => Number(room.occupiedBeds) >= Number(room.capacity)
  ).length;


  const handleAddRoom = async (event) => {
  event.preventDefault();

  setFormError("");

  if (!roomNumber.trim()) {
    setFormError("Room number is required");
    return;
  }

  if (!capacity || Number(capacity) <= 0) {
    setFormError("Capacity must be greater than 0");
    return;
  }

  try {
    setSaving(true);

    await createRoom({
      roomNumber: roomNumber.trim(),
      capacity: Number(capacity),
    });

    // Clear form
    setRoomNumber("");
    setCapacity("");

    // Close modal
    setShowAddRoom(false);

    // Reload rooms from backend
    setLoading(true);

    const updatedRooms = await getRooms();
    setRooms(updatedRooms);
  } catch (err) {
    console.error(err);
    setFormError("Unable to create room");
  } finally {
    setSaving(false);
    setLoading(false);
  }
};

const handleEditRoom = async (event) => {
  event.preventDefault();

  setEditError("");

  if (!editRoomNumber.trim()) {
    setEditError("Room number is required");
    return;
  }

  if (!editCapacity || Number(editCapacity) <= 0) {
    setEditError("Capacity must be greater than 0");
    return;
  }

  if (!editingRoom) {
    return;
  }

  if (Number(editCapacity) < Number(editingRoom.occupiedBeds)) {
    setEditError(
      `Capacity cannot be less than ${editingRoom.occupiedBeds} occupied bed(s)`
    );
    return;
  }

  try {
    setEditSaving(true);

    await updateRoom(editingRoom.id, {
      roomNumber: editRoomNumber.trim(),
      capacity: Number(editCapacity),
      occupiedBeds: editingRoom.occupiedBeds,
    });

    const updatedRooms = await getRooms();

    setRooms(updatedRooms);

    setShowEditRoom(false);
    setEditingRoom(null);
    setEditRoomNumber("");
    setEditCapacity("");
  } catch (err) {
    console.error(err);
    setEditError("Unable to update room");
  } finally {
    setEditSaving(false);
  }
};

const handleDeleteRoom = async () => {
  if (!deletingRoom) {
    return;
  }

  try {
    setDeleteSaving(true);
    setDeleteError("");

    await deleteRoom(deletingRoom.id);

    setRooms((currentRooms) =>
      currentRooms.filter(
        (room) => room.id !== deletingRoom.id
      )
    );

    setShowDeleteRoom(false);
    setDeletingRoom(null);
    setOpenMenu(null);

  } catch (err) {
    console.error(err);

    setDeleteError(
      err.message || "Unable to delete room"
    );
  } finally {
    setDeleteSaving(false);
  }
};

  return (
     <div className="app-shell">

    <Sidebar />

    <main className="main-content">

      <Topbar />
    <section className="rooms-page">

      {/* =========================
          HEADER
      ========================= */}

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <span className="eyebrow">ROOM MANAGEMENT</span>

          <h1>Rooms</h1>

          <p>
            Manage rooms, occupancy and available beds.
          </p>
        </div>

       <button
  className="primary-button"
  onClick={() => {
    setFormError("");
    setShowAddRoom(true);
  }}
>
  <Plus size={17} />
  Add room
</button>
      </motion.div>


{/* =========================
    ADD ROOM MODAL
========================= */}

{showAddRoom && (
  <div className="modal-overlay">

    <motion.div
      className="room-modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >

      {/* Modal Header */}

      <div className="modal-header">

        <div>
          <span className="eyebrow">
            ROOM MANAGEMENT
          </span>

          <h2>
            Add Room
          </h2>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => setShowAddRoom(false)}
        >
          ×
        </button>

      </div>


      {/* Form */}

      <form onSubmit={handleAddRoom}>

        {/* Room Number */}

        <div className="form-group">

          <label>
            Room Number
          </label>

          <input
            type="text"
            placeholder="e.g. 203"
            value={roomNumber}
            onChange={(event) =>
              setRoomNumber(event.target.value)
            }
          />

        </div>


        {/* Capacity */}

        <div className="form-group">

          <label>
            Capacity
          </label>

          <input
            type="number"
            min="1"
            placeholder="e.g. 4"
            value={capacity}
            onChange={(event) =>
              setCapacity(event.target.value)
            }
          />

        </div>


        {/* Form Error */}

        {formError && (
          <div className="form-error">
            {formError}
          </div>
        )}


        {/* Buttons */}

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setShowAddRoom(false);
              setFormError("");
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Adding..." : "Add Room"}
          </button>

        </div>

      </form>

    </motion.div>

  </div>
)}

{/* =========================
    EDIT ROOM MODAL
========================= */}

{showEditRoom && editingRoom && (
  <div className="modal-overlay">

    <motion.div
      className="room-modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >

      <div className="modal-header">

        <div>
          <span className="eyebrow">
            ROOM MANAGEMENT
          </span>

          <h2>
            Edit Room
          </h2>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => {
            setShowEditRoom(false);
            setEditingRoom(null);
            setEditError("");
          }}
        >
          ×
        </button>

      </div>

      <form onSubmit={handleEditRoom}>

        <div className="form-group">

          <label>
            Room Number
          </label>

          <input
            type="text"
            value={editRoomNumber}
            onChange={(event) =>
              setEditRoomNumber(event.target.value)
            }
          />

        </div>

        <div className="form-group">

          <label>
            Capacity
          </label>

          <input
            type="number"
            min={editingRoom.occupiedBeds}
            value={editCapacity}
            onChange={(event) =>
              setEditCapacity(event.target.value)
            }
          />

          <small>
            Currently occupied: {editingRoom.occupiedBeds}
          </small>

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
            onClick={() => {
              setShowEditRoom(false);
              setEditingRoom(null);
              setEditError("");
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={editSaving}
          >
            {editSaving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </motion.div>

  </div>
)}


{showDeleteRoom && deletingRoom && (
  <div className="modal-overlay">

    <motion.div
      className="room-modal delete-modal"
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
            ROOM MANAGEMENT
          </span>

          <h2>
            Delete Room
          </h2>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => {
            setShowDeleteRoom(false);
            setDeletingRoom(null);
            setDeleteError("");
          }}
        >
          ×
        </button>

      </div>

      <div className="delete-content">

        <p>
          Are you sure you want to delete room{" "}
          <strong>
            {deletingRoom.roomNumber}
          </strong>
          ?
        </p>

        <p>
          This action cannot be undone.
        </p>

        {deleteError && (
          <div className="form-error">
            {deleteError}
          </div>
        )}

      </div>

      <div className="modal-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setShowDeleteRoom(false);
            setDeletingRoom(null);
            setDeleteError("");
          }}
          disabled={deleteSaving}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-confirm-button"
          onClick={handleDeleteRoom}
          disabled={deleteSaving}
        >
          {deleteSaving
            ? "Deleting..."
            : "Delete Room"}
        </button>

      </div>

    </motion.div>

  </div>
)}

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="room-summary">

        <SummaryCard
          icon={<DoorOpen size={19} />}
          label="Total rooms"
          value={String(totalRooms).padStart(2, "0")}
        />

        <SummaryCard
          icon={<BedDouble size={19} />}
          label="Occupied beds"
          value={String(occupiedBeds).padStart(2, "0")}
        />

        <SummaryCard
          icon={<BedDouble size={19} />}
          label="Available beds"
          value={String(availableBeds).padStart(2, "0")}
        />

        <SummaryCard
          icon={<Users size={19} />}
          label="Full rooms"
          value={String(fullRooms).padStart(2, "0")}
        />

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="rooms-toolbar">

        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search rooms..."
          />
        </div>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="rooms-loading">
          Loading rooms...
        </div>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}

      {!loading && !error && rooms.length === 0 && (
        <motion.div
          className="rooms-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <DoorOpen size={35} />

          <h3>No rooms found</h3>

          <p>
            There are currently no rooms available.
          </p>
        </motion.div>
      )}


      {/* =========================
          ROOM CARDS
      ========================= */}

      {!loading && rooms.length > 0 && (
        <div className="rooms-grid">

          {rooms.map((room, index) => {

            const capacity = Number(room.capacity || 0);
            const occupied = Number(room.occupiedBeds || 0);

            const occupancyPercentage =
              capacity > 0
                ? (occupied / capacity) * 100
                : 0;

            const isFull = occupied >= capacity;

            return (
              <motion.div
                key={room.id}
                className="room-card"
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
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -5,
                }}
              >

                {/* Card Header */}

                <div className="room-card-header">

                  <div>
                    <span className="room-label">
                      ROOM
                    </span>

                    <h2>
                      {room.roomNumber}
                    </h2>
                  </div>
<div className="room-menu-wrapper">

  <button
    className="more-button"
    onClick={() =>
      setOpenMenu(
        openMenu === room.id ? null : room.id
      )
    }
  >
    <MoreHorizontal size={19} />
  </button>

  {openMenu === room.id && (
    <div className="room-menu">

<button
  onClick={() => {
    setEditingRoom(room);
    setEditRoomNumber(room.roomNumber);
    setEditCapacity(String(room.capacity));
    setEditError("");
    setOpenMenu(null);
    setShowEditRoom(true);
  }}
>
  Edit Room
</button>

<button
  className="delete-action"
  onClick={() => {
    setDeletingRoom(room);
    setDeleteError("");
    setOpenMenu(null);
    setShowDeleteRoom(true);
  }}
>
  Delete Room
</button>

    </div>
  )}

</div>

                </div>


                {/* Status */}

                <div className="room-status-row">

                  <span
                    className={`room-status ${
                      isFull
                        ? "full"
                        : "available"
                    }`}
                  >
                    <span></span>

                    {isFull
                      ? "Full"
                      : "Available"}
                  </span>

                  <strong>
                    {occupied}/{capacity}
                  </strong>

                </div>


                {/* Progress */}

                <div className="room-progress">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${occupancyPercentage}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                    }}
                  />

                </div>


                {/* Footer */}

                <div className="room-footer">

                  <span>
                    <BedDouble size={15} />

                    {Math.max(
                      capacity - occupied,
                      0
                    )}{" "}
                    beds available
                  </span>

                  <span>
                    {capacity} capacity
                  </span>

                </div>

              </motion.div>
            );
          })}

        </div>
      )}

    </section>

    </main>
    </div>
  );
}


/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <motion.div
      className="room-summary-card"
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


export default Rooms;