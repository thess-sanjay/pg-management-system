import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Bell,
  User,
  BedDouble,
  IndianRupee,
  X,
} from "lucide-react";

import {
  getTodayDueRents,
  getTenants,
  getRooms,
  getRents,
} from "../services/api";


function Topbar() {

  // ==========================================
  // NOTIFICATION STATE
  // ==========================================

  const [dueRents, setDueRents] = useState([]);

  const [notificationOpen, setNotificationOpen] =
    useState(false);


  // ==========================================
  // RENT NOTIFICATION SETTING
  // ==========================================

  const [rentNotifications, setRentNotifications] =
    useState(() => {

      const savedSettings =
        localStorage.getItem("pgms-settings");

      if (savedSettings) {

        try {

          const parsedSettings =
            JSON.parse(savedSettings);

          return (
            parsedSettings.rentNotifications ??
            true
          );

        } catch (error) {

          console.error(
            "Failed to load notification settings:",
            error
          );

        }

      }

      return true;

    });


  // ==========================================
  // SEARCH STATE
  // ==========================================

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [tenants, setTenants] =
    useState([]);

  const [rooms, setRooms] =
    useState([]);

  const [rents, setRents] =
    useState([]);


  const navigate = useNavigate();


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {

    async function loadNotifications() {

      /*
       * If notifications are disabled,
       * don't load notification data.
       */

      if (!rentNotifications) {

        setDueRents([]);

        return;

      }


      try {

        const data =
          await getTodayDueRents();

        setDueRents(data);

      } catch (error) {

        console.error(
          "Failed to load notifications:",
          error
        );

      }

    }


    loadNotifications();

  }, [rentNotifications]);


  // ==========================================
  // LISTEN FOR SETTINGS CHANGES
  // ==========================================

  useEffect(() => {

    const handleSettingsChange = () => {

      const savedSettings =
        localStorage.getItem("pgms-settings");


      if (!savedSettings) {

        setRentNotifications(true);

        return;

      }


      try {

        const parsedSettings =
          JSON.parse(savedSettings);


        const notificationsEnabled =
          parsedSettings.rentNotifications ??
          true;


        setRentNotifications(
          notificationsEnabled
        );


        /*
         * If notifications were turned OFF
         * while dropdown was open,
         * close the dropdown.
         */

        if (!notificationsEnabled) {

          setNotificationOpen(false);

        }

      } catch (error) {

        console.error(
          "Failed to read notification settings:",
          error
        );

      }

    };


    // Load current setting

    handleSettingsChange();


    // Listen for changes from another tab/window

    window.addEventListener(
      "storage",
      handleSettingsChange
    );


    /*
     * Custom event allows the same tab
     * to react immediately.
     */

    window.addEventListener(
      "pgms-settings-changed",
      handleSettingsChange
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleSettingsChange
      );

      window.removeEventListener(
        "pgms-settings-changed",
        handleSettingsChange
      );

    };

  }, []);


  // ==========================================
  // LOAD SEARCH DATA
  // ==========================================

  useEffect(() => {

    async function loadSearchData() {

      try {

        const [
          tenantData,
          roomData,
          rentData,
        ] = await Promise.all([

          getTenants(),

          getRooms(),

          getRents(),

        ]);


        setTenants(tenantData);

        setRooms(roomData);

        setRents(rentData);

      } catch (error) {

        console.error(
          "Failed to load search data:",
          error
        );

      }

    }


    loadSearchData();

  }, []);


  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  const search =
    searchTerm
      .trim()
      .toLowerCase();


  const tenantResults =
    search
      ? tenants
          .filter((tenant) => {

            const name =
              tenant.name?.toLowerCase() || "";


            const phone =
              tenant.phone?.toLowerCase() || "";


            const roomNumber =
              tenant.room?.roomNumber
                ?.toString()
                .toLowerCase() || "";


            return (

              name.includes(search) ||

              phone.includes(search) ||

              roomNumber.includes(search)

            );

          })
          .slice(0, 5)

      : [];


  const roomResults =
    search
      ? rooms
          .filter((room) => {

            const roomNumber =
              room.roomNumber
                ?.toString()
                .toLowerCase() || "";


            const status =
              room.status
                ?.toLowerCase() || "";


            return (

              roomNumber.includes(search) ||

              status.includes(search)

            );

          })
          .slice(0, 5)

      : [];


  const rentResults =
    search
      ? rents
          .filter((rent) => {

            const tenantName =
              rent.tenant?.name
                ?.toLowerCase() || "";


            const roomNumber =
              rent.tenant?.room?.roomNumber
                ?.toString()
                .toLowerCase() || "";


            const month =
              rent.month
                ?.toLowerCase() || "";


            const amount =
              rent.rentAmount
                ?.toString() || "";


            return (

              tenantName.includes(search) ||

              roomNumber.includes(search) ||

              month.includes(search) ||

              amount.includes(search)

            );

          })
          .slice(0, 5)

      : [];


  const hasSearchResults =
    tenantResults.length > 0 ||
    roomResults.length > 0 ||
    rentResults.length > 0;


  // ==========================================
  // CLOSE SEARCH
  // ==========================================

  const closeSearch = () => {

    setSearchOpen(false);

    setSearchTerm("");

  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <header className="topbar">


      {/* ========================================== */}
      {/* BREADCRUMB */}
      {/* ========================================== */}

      <div className="breadcrumb">

        <span>
          Workspace
        </span>

        <b>
          /
        </b>

        <strong>
          Overview
        </strong>

      </div>


      {/* ========================================== */}
      {/* TOPBAR ACTIONS */}
      {/* ========================================== */}

      <div className="topbar-actions">


        {/* ========================================== */}
        {/* GLOBAL SEARCH */}
        {/* ========================================== */}

        <div className="global-search">

          {searchOpen && (

            <div className="global-search-box">

              <Search size={17} />


              <input
                autoFocus
                type="text"
                placeholder="Search tenants, rooms, rent..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />


              <button
                type="button"
                onClick={closeSearch}
                title="Close search"
              >

                <X size={16} />

              </button>

            </div>

          )}


          {!searchOpen && (

            <button
              className="icon-button"
              type="button"
              title="Search"
              onClick={() =>
                setSearchOpen(true)
              }
            >

              <Search size={19} />

            </button>

          )}


          {/* ========================================== */}
          {/* SEARCH RESULTS */}
          {/* ========================================== */}

          {searchOpen &&
            search &&
            (

              <div className="global-search-results">


                {/* NO RESULTS */}

                {!hasSearchResults && (

                  <div className="search-no-results">

                    <Search size={18} />

                    <span>
                      No results found
                    </span>

                  </div>

                )}


                {/* TENANTS */}

                {tenantResults.length > 0 && (

                  <div className="search-section">

                    <div className="search-section-title">
                      Tenants
                    </div>


                    {tenantResults.map(
                      (tenant) => (

                        <button
                          className="search-result"
                          type="button"
                          key={`tenant-${tenant.id}`}

                          onClick={() => {

                            navigate(
                              `/tenants?tenantId=${tenant.id}`
                            );

                            closeSearch();

                          }}
                        >

                          <div className="search-result-icon">

                            <User size={16} />

                          </div>


                          <div className="search-result-details">

                            <strong>
                              {tenant.name}
                            </strong>


                            <span>

                              Tenant
                              {" • "}
                              Room{" "}

                              {tenant.room
                                ?.roomNumber ||
                                "Not assigned"}

                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}


                {/* ROOMS */}

                {roomResults.length > 0 && (

                  <div className="search-section">

                    <div className="search-section-title">
                      Rooms
                    </div>


                    {roomResults.map(
                      (room) => (

                        <button
                          className="search-result"
                          type="button"
                          key={`room-${room.id}`}

                          onClick={() => {

                            navigate(
                              `/rooms?roomId=${room.id}`
                            );

                            closeSearch();

                          }}
                        >

                          <div className="search-result-icon">

                            <BedDouble size={16} />

                          </div>


                          <div className="search-result-details">

                            <strong>

                              Room{" "}
                              {room.roomNumber}

                            </strong>


                            <span>

                              {room.status ||
                                "Room"}

                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}


                {/* RENT */}

                {rentResults.length > 0 && (

                  <div className="search-section">

                    <div className="search-section-title">
                      Rent
                    </div>


                    {rentResults.map(
                      (rent) => (

                        <button
                          className="search-result"
                          type="button"
                          key={`rent-${rent.id}`}

                          onClick={() => {

                            navigate(
                              `/rent?tenantId=${rent.tenant?.id}`
                            );

                            closeSearch();

                          }}
                        >

                          <div className="search-result-icon">

                            <IndianRupee size={16} />

                          </div>


                          <div className="search-result-details">

                            <strong>

                              {rent.tenant?.name ||
                                "Tenant"}

                            </strong>


                            <span>

                              ₹
                              {Number(
                                rent.rentAmount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}

                              {" • "}

                              {rent.month}

                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

        </div>


        {/* ========================================== */}
        {/* NOTIFICATIONS */}
        {/* ========================================== */}

        <div className="notification-wrapper">


          <button
            className="icon-button notification"
            type="button"

            /*
             * Change title based on setting
             */

            title={
              rentNotifications
                ? "Notifications"
                : "Rent notifications disabled"
            }


            onClick={() => {

              /*
               * Do nothing when notifications
               * are disabled.
               */

              if (!rentNotifications) {

                return;

              }


              setNotificationOpen(
                !notificationOpen
              );

            }}
          >

            <Bell size={19} />


            {/* ======================================
                NOTIFICATION COUNT
            ====================================== */}

            {rentNotifications &&
              dueRents.length > 0 && (

                <span className="notification-badge">

                  {dueRents.length}

                </span>

              )}

          </button>


          {/* ========================================== */}
          {/* NOTIFICATION DROPDOWN */}
          {/* ========================================== */}

          {rentNotifications &&
            notificationOpen && (

              <div className="notification-dropdown">


                {/* HEADER */}

                <div className="notification-header">

                  <strong>
                    Notifications
                  </strong>


                  <span>

                    {dueRents.length}
                    {" "}
                    due today

                  </span>

                </div>


                <div className="dropdown-divider"></div>


                {/* NO NOTIFICATIONS */}

                {dueRents.length === 0 ? (

                  <div className="notification-empty">

                    <Bell size={18} />

                    <span>
                      No rent payments due today
                    </span>

                  </div>

                ) : (

                  dueRents.map((rent) => (

                    <button
                      className="notification-item"
                      key={rent.id}
                      type="button"

                      onClick={() => {

                        navigate(
                          `/rent?tenantId=${rent.tenant?.id}`
                        );

                        setNotificationOpen(
                          false
                        );

                      }}
                    >

                      <div className="notification-icon">

                        <Bell size={16} />

                      </div>


                      <div className="notification-details">

                        <strong>
                          Rent due today
                        </strong>


                        <span>

                          {rent.tenant?.name ||
                            "Tenant"}

                          {" • "}

                          ₹{rent.rentAmount}

                        </span>

                      </div>

                    </button>

                  ))

                )}

              </div>

            )}

        </div>


      </div>

    </header>

  );

}


export default Topbar;