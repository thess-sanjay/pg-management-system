
import { motion } from "motion/react";
import {
  BedDouble,
  DoorOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getRooms } from "../services/api";


function OccupancyPanel() {

  // =====================================================
  // DATA
  // =====================================================

  const [rooms, setRooms] = useState([]);


  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD ROOMS
  // =====================================================

  useEffect(() => {

    const loadRooms = async () => {

      try {

        setLoading(true);

        setError("");


        const roomData =
          await getRooms();


        setRooms(roomData);


      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to load room occupancy"
        );

      } finally {

        setLoading(false);

      }

    };


    loadRooms();

  }, []);


  // =====================================================
  // CALCULATE TOTALS
  // =====================================================

  const totalCapacity =
    rooms.reduce(
      (total, room) =>
        total +
        Number(room.capacity || 0),
      0
    );


  const occupiedBeds =
    rooms.reduce(
      (total, room) =>
        total +
        Number(room.occupiedBeds || 0),
      0
    );


  const availableBeds =
    Math.max(
      totalCapacity -
        occupiedBeds,
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
  // RENDER
  // =====================================================

  return (

    <motion.div
      className="panel occupancy-panel"
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
        delay: 0.25,
      }}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="panel-header">

        <div>

          <span className="eyebrow">
            ROOM OVERVIEW
          </span>

          <h2>
            Occupancy
          </h2>

        </div>


        <div className="occupancy-header-icon">

          <DoorOpen size={19} />

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="panel-error">

          {error}

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="panel-loading">

          Loading room occupancy...

        </div>

      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        rooms.length === 0 && (

          <div className="panel-empty">

            <DoorOpen size={30} />

            <h3>
              No rooms available
            </h3>

            <p>
              Add rooms to start tracking occupancy.
            </p>

          </div>

        )}


      {/* =================================================
          ROOM LIST
      ================================================= */}

      {!loading &&
        !error &&
        rooms.length > 0 && (

          <div className="occupancy-room-list">


            {rooms.map(
              (room, index) => {

                const capacity =
                  Number(
                    room.capacity || 0
                  );


                const occupied =
                  Number(
                    room.occupiedBeds || 0
                  );


                const available =
                  Math.max(
                    capacity -
                      occupied,
                    0
                  );


                const percentage =
                  capacity > 0
                    ? Math.min(
                        Math.round(
                          (occupied /
                            capacity) *
                            100
                        ),
                        100
                      )
                    : 0;


                const isFull =
                  capacity > 0 &&
                  occupied >= capacity;


                return (

                  <motion.div
                    key={room.id}
                    className="occupancy-room"
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay:
                        index * 0.06,
                    }}
                  >


                    {/* ROOM HEADER */}

                    <div className="occupancy-room-header">

                      <div>

                        <strong>
                          Room{" "}
                          {room.roomNumber}
                        </strong>

                        <span>
                          {occupied} / {capacity} beds
                        </span>

                      </div>


                      <span
                        className={
                          isFull
                            ? "occupancy-status full"
                            : "occupancy-status available"
                        }
                      >

                        {isFull ? (
                          <>
                            <AlertCircle
                              size={14}
                            />

                            Full
                          </>
                        ) : (
                          <>
                            <CheckCircle
                              size={14}
                            />

                            {available} available
                          </>
                        )}

                      </span>

                    </div>


                    {/* PROGRESS BAR */}

                    <div className="occupancy-progress">

                      <motion.div
                        className="occupancy-progress-fill"
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${percentage}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          delay:
                            0.15 +
                            index * 0.06,
                        }}
                      />

                    </div>


                    {/* ROOM FOOTER */}

                    <div className="occupancy-room-footer">

                      <span>
                        <BedDouble
                          size={14}
                        />

                        {occupied} occupied
                      </span>


                      <strong>
                        {percentage}%
                      </strong>

                    </div>


                  </motion.div>

                );

              }
            )}

          </div>

        )}


      {/* =================================================
          TOTAL SUMMARY
      ================================================= */}

      {!loading &&
        !error &&
        rooms.length > 0 && (

          <div className="occupancy-total">

            <div>

              <span>
                Overall occupancy
              </span>

              <strong>
                {occupancyPercentage}%
              </strong>

            </div>


            <div className="occupancy-total-details">

              <span>
                {occupiedBeds} occupied
              </span>

              <span>
                {availableBeds} available
              </span>

              <span>
                {totalCapacity} total beds
              </span>

            </div>

          </div>

        )}

    </motion.div>

  );

}


export default OccupancyPanel;

