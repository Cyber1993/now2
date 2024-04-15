import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import profile from ".././../../../assets/Profile.png";
import information from ".././../../../assets/ProfileList.png";
import wallet from ".././../../../assets/Wallet.png";
import order from ".././../../../assets/Order.png";
import letter from ".././../../../assets/Letter.png";
import change from ".././../../../assets/Changepassword.png";
import heart from ".././../../../assets/ProfileHeart.png";
import vector from ".././../../../assets/Vector.png";
import logo from ".././../../../assets/Logo.png";
import http_common from "../../../../http_common";
import { LogOut } from "../../../../store/actions/AuthActions";

interface SidebarProps {
  showSidebar: boolean;
  handleToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  handleToggleSidebar,
}) => {
  const navigate = useNavigate();
  
  const Logout = async () => {
    await http_common.post("api/Accounts/logout");
    LogOut();
    navigate("/");
    window.location.reload();
  }

  return (
    <>
      {showSidebar ? (
        <>
          <div onClick={handleToggleSidebar} className="sidebar-background">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="sidebar-page"
            >
              <div className="sidebar-content">
                <div className="sidebar-container">
                  <div className="nav-header">
                    <img src={logo}></img>
                    <img
                      className="nav-vector"
                      src={vector}
                      onClick={handleToggleSidebar}
                    ></img>
                  </div>
                  <li onClick={() => navigate("/")}>Home</li>
                  <div
                    className="nav-option"
                    onClick={() => navigate("/profile")}
                  >
                    <img src={profile}></img>
                    <p>My profile</p>
                  </div>
                  <div className="nav-option">
                    <img src={information}></img>
                    <p>Additional information</p>
                  </div>
                  <div
                    className="nav-option"
                    onClick={() => navigate("/profile/myorders")}
                  >
                    <img src={order}></img>
                    <p>My orders</p>
                  </div>
                  <div className="nav-option">
                    <img src={letter}></img>
                    <p>Correspondence with sellers</p>
                  </div>
                  <div
                    className="nav-option"
                    onClick={() => navigate("/profile/wishlist")}
                  >
                    <img src={heart}></img>
                    <p>Wish list</p>
                  </div>
                  <div className="nav-option">
                    <img src={wallet}></img>
                    <p>My wallet</p>
                  </div>
                  <div
                    className="nav-option"
                    onClick={() => navigate("/profile/change-password")}
                  >
                    <img src={change}></img>
                    <p>Change password</p>
                  </div>
                  <div className="nav-option" onClick={Logout}>
                    <img src={vector}></img>
                    <p>Exit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Sidebar;
