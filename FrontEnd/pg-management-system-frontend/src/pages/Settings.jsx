import { useEffect, useState } from "react";
import {
    Palette,
    Bell,
    LayoutDashboard,
    Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
} from "lucide-react";

function Settings() {

    const navigate = useNavigate();
    // =========================================
    // LOAD SAVED SETTINGS
    // =========================================

    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem("pgms-settings");

        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        }

        return {
            darkMode: true,
            rentNotifications: true,
            dashboardActivity: true,
        };
    });

    // =========================================
    // SAVE SETTINGS
    // =========================================

 useEffect(() => {

  localStorage.setItem(
    "pgms-settings",
    JSON.stringify(settings)
  );

  window.dispatchEvent(
    new Event("pgms-settings-changed")
  );

}, [settings]);

    // =========================================
    // APPLY DARK MODE
    // =========================================

    useEffect(() => {
        if (settings.darkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [settings.darkMode]);

    // =========================================
    // TOGGLE HELPER
    // =========================================

    const toggleSetting = (settingName) => {
        setSettings((previousSettings) => ({
            ...previousSettings,
            [settingName]: !previousSettings[settingName],
        }));
    };

    // =========================================
    // RENDER
    // =========================================

    return (

        <section className="settings-page">
            <button
                type="button"
                className="settings-back-button"
                onClick={() => navigate("/dashboard")}
            >
                <ArrowLeft size={17} />
                <span>Back to Dashboard</span>
            </button>

            {/* =====================================
          PAGE HEADER
      ===================================== */}

            <div className="page-header">

                <span className="eyebrow">
                    APPLICATION
                </span>

                <h1>
                    Settings
                </h1>

                <p>
                    Manage your PG management system preferences.
                </p>

            </div>


            {/* =====================================
          SETTINGS CARD
      ===================================== */}

            <div className="settings-card">


                {/* =====================================
            APPEARANCE
        ===================================== */}

                <div className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            <Palette size={19} />
                        </div>

                        <div>
                            <h2>
                                Appearance
                            </h2>

                            <p>
                                Control how PGMS looks.
                            </p>
                        </div>

                    </div>


                    <div
                        className="setting-item"
                        onClick={() => toggleSetting("darkMode")}
                    >

                        <div className="setting-info">

                            <strong>
                                Dark mode
                            </strong>

                            <span>
                                Use the dark interface throughout the application.
                            </span>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${settings.darkMode ? "active" : ""
                                }`}
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleSetting("darkMode");
                            }}
                            aria-label="Toggle dark mode"
                        >

                            <span className="toggle-circle"></span>

                        </button>

                    </div>

                </div>


                <div className="settings-divider"></div>


                {/* =====================================
            NOTIFICATIONS
        ===================================== */}

                <div className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            <Bell size={19} />
                        </div>

                        <div>

                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Manage rent payment notifications.
                            </p>

                        </div>

                    </div>


                    <div
                        className="setting-item"
                        onClick={() =>
                            toggleSetting("rentNotifications")
                        }
                    >

                        <div className="setting-info">

                            <strong>
                                Rent due notifications
                            </strong>

                            <span>
                                Show notifications when rent payments are due today.
                            </span>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${settings.rentNotifications ? "active" : ""
                                }`}
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleSetting("rentNotifications");
                            }}
                            aria-label="Toggle rent notifications"
                        >

                            <span className="toggle-circle"></span>

                        </button>

                    </div>

                </div>


                <div className="settings-divider"></div>


                {/* =====================================
            DASHBOARD
        ===================================== */}

                <div className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            <LayoutDashboard size={19} />
                        </div>

                        <div>

                            <h2>
                                Dashboard
                            </h2>

                            <p>
                                Control dashboard preferences.
                            </p>

                        </div>

                    </div>


                    <div
                        className="setting-item"
                        onClick={() =>
                            toggleSetting("dashboardActivity")
                        }
                    >

                        <div className="setting-info">

                            <strong>
                                Recent activity
                            </strong>

                            <span>
                                Display recent PG activity on the dashboard.
                            </span>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${settings.dashboardActivity ? "active" : ""
                                }`}
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleSetting("dashboardActivity");
                            }}
                            aria-label="Toggle dashboard activity"
                        >

                            <span className="toggle-circle"></span>

                        </button>

                    </div>

                </div>


                {/* =====================================
            SAVED INDICATOR
        ===================================== */}

                <div className="settings-saved">

                    <Check size={15} />

                    <span>
                        Settings are saved automatically
                    </span>

                </div>

            </div>

        </section>
    );
}

export default Settings;