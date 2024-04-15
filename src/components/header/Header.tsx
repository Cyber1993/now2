import "./Header.css";
import Logo from "../../assets/logo.png";
import Account from "../../assets/Account.png";
import CartIcon from "../../assets/CartIcon.png";
import { useSelector } from "react-redux";
import { IAuthUser, IProfile } from "../../entities/Auth.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import http_common from "../../http_common.ts";
import Cart from "../pages/cart/Cart.tsx";
import Login from "../pages/auth/login/Login.tsx";
import Register from "../pages/auth/register/Register.tsx";

interface HeaderProps {
  onShowCartToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowCartToggle = () => {} }) => {
  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const [User, setUser] = useState<IProfile>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>("EN");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  const handleToggleCart = async () => {
    if (isAuth) {
      setShowCart(!showCart);
      if (!showCart) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      onShowCartToggle();
    } else {
      setShowLogin(!showLogin);
    }
  };

  const handleToggleLogin = async () => {
    if (isAuth) {
      navigate("/");
    } else {
      setShowLogin(!showLogin);
    }

    if (!showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleToggleRegister = async () => {
    setShowLogin(false);

    if (isAuth) {
      navigate("/profile");
    } else {
      setShowRegister(!showRegister);
    }

    if (!showRegister) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleChangeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const logoNavigate = () => {
    navigate("/");
    window.location.reload();
  };

  const fetchUser = async () => {
    try {
      const response = await http_common.get(`api/Accounts/getByUserName/${user?.userName}`);
      const userData = response.data;
      setUser(userData);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Cart showCart={showCart} handleToggleCart={handleToggleCart}></Cart>
      <Login
        showLogin={showLogin}
        handleToggleLogin={handleToggleLogin}
        handleToggleRegister={handleToggleRegister}
      ></Login>
      <Register
        showRegister={showRegister}
        handleToggleRegister={handleToggleRegister}
      ></Register>
      <div className="header">
        <div className="header-logo-catalog">
          <img className="header-logo" src={Logo} alt="" onClick={logoNavigate}/>
          <button className="catalog-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <path
                d="M9.33333 1.3335H2.66667C2.22464 1.3335 1.80072 1.50909 1.48816 1.82165C1.17559 2.13421 1 2.55814 1 3.00016V9.66683C1 10.1089 1.17559 10.5328 1.48816 10.8453C1.80072 11.1579 2.22464 11.3335 2.66667 11.3335H9.33333C9.77536 11.3335 10.1993 11.1579 10.5118 10.8453C10.8244 10.5328 11 10.1089 11 9.66683V3.00016C11 2.55814 10.8244 2.13421 10.5118 1.82165C10.1993 1.50909 9.77536 1.3335 9.33333 1.3335ZM22.6667 1.3335H16C15.558 1.3335 15.134 1.50909 14.8215 1.82165C14.5089 2.13421 14.3333 2.55814 14.3333 3.00016V9.66683C14.3333 10.1089 14.5089 10.5328 14.8215 10.8453C15.134 11.1579 15.558 11.3335 16 11.3335H22.6667C23.1087 11.3335 23.5326 11.1579 23.8452 10.8453C24.1577 10.5328 24.3333 10.1089 24.3333 9.66683V3.00016C24.3333 2.55814 24.1577 2.13421 23.8452 1.82165C23.5326 1.50909 23.1087 1.3335 22.6667 1.3335ZM22.6667 14.6668H16C15.558 14.6668 15.134 14.8424 14.8215 15.155C14.5089 15.4675 14.3333 15.8915 14.3333 16.3335V23.0002C14.3333 23.4422 14.5089 23.8661 14.8215 24.1787C15.134 24.4912 15.558 24.6668 16 24.6668H22.6667C23.1087 24.6668 23.5326 24.4912 23.8452 24.1787C24.1577 23.8661 24.3333 23.4422 24.3333 23.0002V16.3335C24.3333 15.8915 24.1577 15.4675 23.8452 15.155C23.5326 14.8424 23.1087 14.6668 22.6667 14.6668ZM9.33333 14.6668H2.66667C2.22464 14.6668 1.80072 14.8424 1.48816 15.155C1.17559 15.4675 1 15.8915 1 16.3335V23.0002C1 23.4422 1.17559 23.8661 1.48816 24.1787C1.80072 24.4912 2.22464 24.6668 2.66667 24.6668H9.33333C9.77536 24.6668 10.1993 24.4912 10.5118 24.1787C10.8244 23.8661 11 23.4422 11 23.0002V16.3335C11 15.8915 10.8244 15.4675 10.5118 15.155C10.1993 14.8424 9.77536 14.6668 9.33333 14.6668Z"
                stroke="white"
                strokeWidth="1.66667"
              />
            </svg>
            Catalog
          </button>
        </div>
        <div className="header-right-section">
          <search>
            <input type="text" placeholder="Search product" />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
              >
                <path
                  d="M17.5 17L13.6778 13.1778M15.7223 8.11113C15.7223 12.0385 12.5385 15.2223 8.61113 15.2223C4.68376 15.2223 1.5 12.0385 1.5 8.11113C1.5 4.18376 4.68376 1 8.61113 1C12.5385 1 15.7223 4.18376 15.7223 8.11113Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </search>
          <div>
            <button onClick={() => handleChangeLanguage("UA")}>
              {language === "UA" && <div className="ellipse"></div>}
              UA
            </button>
            <button onClick={() => handleChangeLanguage("EN")}>
              {language === "EN" && <div className="ellipse"></div>}
              EN
            </button>
          </div>
          <div>
            {(isAuth && (
              <img
                src={`${http_common.getUri()}/Images/300_${User?.image}`}
                alt=""
                onClick={() => navigate(`/profile`)}
              />
            )) || <img src={Account} onClick={handleToggleLogin} alt="" />}
            <img
              className={showCart ? "rotate-negative-15" : ""}
              onClick={handleToggleCart}
              src={CartIcon}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
