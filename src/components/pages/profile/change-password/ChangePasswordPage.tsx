import "./ChangePasswordPage.css";
import { IAuthUser, IPassword } from "../../../../entities/Auth.ts";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import arrow from ".././../../../assets/ArrowMenu.png";
import InputGroup from "../../../../common/admin/InputGroup.tsx";
import http_common from "../../../../http_common.ts";
import Header from "../../../header/Header.tsx";
import Footer from "../../../footer/Footer.tsx";
import { LogOut } from "../../../../store/actions/AuthActions.ts";
import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../sidebar/Sidebar.tsx";


function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth as IAuthUser);
  

  const initialValues: IPassword = {
    userName: user?.userName,
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  };

  console.log("initial -> ",initialValues);

  const profileSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, 'Password requires an uppercase letter'),
    newPasswordConfirmation: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("newPassword")], "Confirm password must match")
  });

  const handleSubmit = async (values: IPassword) => {
    await profileSchema.validate(values);
    console.log("password",values);

    try {
      await http_common.post(`api/Accounts/change-password`, values);
      window.location.reload();
    } catch (error) {
      console.error("Error change password:", error);
    }
  };

  const Logout = async () => {
    await http_common.post("api/Accounts/logout");
    LogOut();
    navigate("/");
    window.location.reload();
  }

  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);

  const toggleVisibility1 = () => {
    setIsVisible1(!isVisible1);
    const img = document.getElementById("show1");

    if (isVisible1) {
      img?.classList.remove("password-show");
    } else {
      img?.classList.add("password-show");
    }
  };
  const toggleVisibility2 = () => {
    setIsVisible2(!isVisible2);
    const img = document.getElementById("show2");

    if (isVisible2) {
      img?.classList.remove("password-show");
    } else {
      img?.classList.add("password-show");
    }
  };
  const toggleVisibility3 = () => {
    setIsVisible3(!isVisible3);
    const img = document.getElementById("show3");

    if (isVisible3) {
      img?.classList.remove("password-show");
    } else {
      img?.classList.add("password-show");
    }
  };

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleToggleSidebar = async () => {

    setShowSidebar(!showSidebar);

  if (!showSidebar) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
};

  return (
    <>
      <Sidebar
        showSidebar={showSidebar}
        handleToggleSidebar={handleToggleSidebar}
      ></Sidebar>
      <Header></Header>

      <div className="main">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={profileSchema}
        >
          {({ handleChange, errors, touched, handleBlur }) => (
            <div className="profile-page">
              <div className="profile-list">
                <ul className="profile-list-text">
                  <li onClick={() => navigate("/")}>Home</li>
                  <li onClick={() => navigate("/profile")}>My profile</li>
                  <li>Additional information</li>
                  <li onClick={() => navigate("/profile/myorders")}>
                    My orders
                  </li>
                  <li>Correspondence with sellers</li>
                  <li onClick={() => navigate("/profile/wishlist")}>
                    Wish list
                  </li>
                  <li>My wallet</li>
                  <li className="underline-text">Change password</li>
                  <li onClick={Logout}>Exit</li>
                </ul>
              </div>
              <div className="change-password-container">
                <div className="change-password-main">
                  <div className="wishlist-menu" onClick={handleToggleSidebar}>
                    <img src={arrow}></img>
                  </div>
                  <div className="change-password-main-text">
                    Change Password
                  </div>
                  <Form>
                    <div className="change-password-forms">
                      <i
                        className="password-show-hide-btn"
                        id="show1"
                        onClick={toggleVisibility1}
                      />
                      <InputGroup
                        label="Old password"
                        type={isVisible1 ? "text" : "password"}
                        field="oldPassword"
                        placeholder="Password"
                        handleBlur={handleBlur}
                        error={errors.oldPassword}
                        touched={touched.oldPassword}
                        handleChange={handleChange}
                      ></InputGroup>
                      <i
                        className="password-show-hide-btn password2"
                        id="show2"
                        onClick={toggleVisibility2}
                      />
                      <InputGroup
                        label="New password"
                        type={isVisible2 ? "text" : "password"}
                        field="newPassword"
                        placeholder="Password"
                        handleBlur={handleBlur}
                        error={errors.newPassword}
                        touched={touched.newPassword}
                        handleChange={handleChange}
                      ></InputGroup>
                      <i
                        className="password-show-hide-btn password3"
                        id="show3"
                        onClick={toggleVisibility3}
                      />
                      <InputGroup
                        label="Confirm new password"
                        type={isVisible3 ? "text" : "password"}
                        field="newPasswordConfirmation"
                        placeholder="Password"
                        handleBlur={handleBlur}
                        error={errors.newPasswordConfirmation}
                        touched={touched.newPasswordConfirmation}
                        handleChange={handleChange}
                      ></InputGroup>
                    </div>

                    <div className="change-password-tip-text">
                      Password must be at least 6 characters,
                      <br />
                      contain numbers and capital letters
                    </div>

                    <div className="change-password-buttons">
                      <button type="submit" className="change-password-btn">
                        Change password
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}

export default ChangePasswordPage;
