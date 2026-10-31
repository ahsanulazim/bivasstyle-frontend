import Alert from "./Alert";
import Dock from "./Dock";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Sidebar = ({ children }) => {
  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col relative">
        {/* Alert */}
        <Alert />
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <main className="bg-base-200">{children}</main>
        <Footer />
        <Dock />
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
