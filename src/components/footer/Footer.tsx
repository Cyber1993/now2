import "./Footer.css";
import Logo from "../../assets/logo.png";
import Facebook from "../../assets/Facebook.png";
import Instagram from "../../assets/Instagram.png";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../entities/Auth.ts";
import { useNavigate } from "react-router-dom";

function Footer() {
  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const isAdmin = isAuth && user?.roles?.includes("Admin");
  const navigate = useNavigate();

  return (
    <>
      <div className="footer">
        <div>
          <img className="header-logo" src={Logo} alt="" />
          <div className="footer-social-networks">
            <p>We are on social networks</p>
            <div>
              <img src={Facebook} alt="" />
              <img src={Instagram} alt="" />
            </div>
          </div>
        </div>
        <div>
          <p>Information about the company</p>
          <div>
            <p onClick={() => (navigate("/aboutus"))}>About us</p>
            <p>Terms of use of the site</p>
            <p>Vacancies</p>
            <p>Contacts</p>
            <p>All categories</p>
          </div>
        </div>
        <div>
          <p>Help</p>
          <div>
            <p>Delivery and payment</p>
            <p>Credit</p>
            <p>Guarantee</p>
            <p>Product return</p>
            <p>Service centers</p>
          </div>
        </div>
        <div>
          <p>Services</p>
          <div>
            {isAdmin && <p onClick={() => navigate("/admin")}>Admin Panel</p>}
            <p>Bonus account</p>
            <p>Gift certificates</p>
            <p>Corporate clients</p>
            <p>Rozetka Exchange</p>
          </div>
        </div>
        <div>
          <p>To partners</p>
          <div>
            <p>Sell on Rosetka</p>
            <p>Cooperation with us</p>
            <p>Franchising</p>
            <p>Rent of premises</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
