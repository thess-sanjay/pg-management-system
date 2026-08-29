import { motion } from "motion/react";
import {
  User,
  ShieldCheck,
  Mail,
  BriefcaseBusiness,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";


function Profile() {

  return (

    <div className="app-shell">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <section className="profile-page">

          {/* ============================= */}
          {/* HEADER */}
          {/* ============================= */}

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
                ACCOUNT
              </span>

              <h1>
                Profile
              </h1>

              <p>
                View your account information.
              </p>

            </div>

          </motion.div>


          {/* ============================= */}
          {/* PROFILE CARD */}
          {/* ============================= */}

          <motion.div
            className="profile-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.1,
            }}
          >

            {/* PROFILE HEADER */}

            <div className="profile-card-header">

              <div className="profile-avatar-large">
                S
              </div>

              <div>

                <h2>
                  Sanjay
                </h2>

                <span>
                  Administrator
                </span>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="profile-divider"></div>


            {/* INFORMATION */}

            <div className="profile-info-grid">


              <div className="profile-info-item">

                <div className="profile-info-icon">
                  <User size={18} />
                </div>

                <div>

                  <span>
                    Full name
                  </span>

                  <strong>
                    Sanjay
                  </strong>

                </div>

              </div>


              <div className="profile-info-item">

                <div className="profile-info-icon">
                  <BriefcaseBusiness size={18} />
                </div>

                <div>

                  <span>
                    Role
                  </span>

                  <strong>
                    Administrator
                  </strong>

                </div>

              </div>


              <div className="profile-info-item">

                <div className="profile-info-icon">
                  <Mail size={18} />
                </div>

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    Not configured
                  </strong>

                </div>

              </div>


              <div className="profile-info-item">

                <div className="profile-info-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <span>
                    Account status
                  </span>

                  <strong className="profile-status">
                    Active
                  </strong>

                </div>

              </div>

            </div>

          </motion.div>

        </section>

      </main>

    </div>

  );

}

export default Profile;