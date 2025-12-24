import {
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineNewspaper,
  HiOutlineAcademicCap,
  HiOutlineLogout,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate("/dashboard")}>
        <HiOutlineHome />
        <span>MIS Dashboard</span>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Website Management</p>

        <button type="button" onClick={() => navigate("/banners")}>
          <HiOutlinePhotograph />
          <span>Banners</span>
        </button>

        <button type="button" onClick={() => navigate("/events")}>
          <HiOutlineBell />
          <span>Events</span>
        </button>

        <button type="button" onClick={() => navigate("/popups")}>
          <HiOutlineBell />
          <span>Popups</span>
        </button>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Content Management</p>

        <button type="button" onClick={() => navigate("/dashboard/news")}>
          <HiOutlineNewspaper />
          <span>News</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/about")}>
          <HiOutlineAcademicCap />
          <span>About Us</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/faq")}>
          <HiOutlineQuestionMarkCircle />
          <span>FAQ</span>
        </button>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Admissions</p>

        <button type="button" onClick={() => navigate("/dashboard/process")}>
          Process
        </button>
        <button type="button" onClick={() => navigate("/dashboard/tuition")}>
          Tuition
        </button>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="logout"
          onClick={() => navigate("/login")}
        >
          <HiOutlineLogout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
