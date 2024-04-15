import "./Register.css";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import http_common from "../../../../http_common.ts";
import { AuthUserActionType, IRegister } from "../../../../entities/Auth.ts";
import { LoginUserAction } from "../../../../store/actions/AuthActions.ts";
import { store } from "../../../../store/store.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../../common/admin/InputGroup.tsx";
import Vector from "../../../../assets/Vector.png";
import Google from "../../../../assets/Google.png";
import Facebook2 from "../../../../assets/Facebook2.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RegisterProps {
  showRegister: boolean;
  handleToggleRegister: () => void;
}

const Register: React.FC<RegisterProps> = ({
  showRegister,
  handleToggleRegister,
}) => {
  const navigate = useNavigate();

  const initialValues: IRegister = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    image: null,
  };

  const registerSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(3, "First name must be at least 3 characters")
      .max(255, "First name must be smaller"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(3, "Last name must be at least 3 characters")
      .max(255, "Last name must be smaller"),
    email: Yup.string()
      .email("Invalid Email address")
      .required("Email is required")
      .max(255, "Email must be smaller"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]*$/, "Phone number must contain only digits")
      .max(255, "Phone number must be smaller"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, 'Password requires an uppercase letter'),
    image: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values: IRegister) => {
    try {
      await http_common
        .post(`api/Accounts/register`, values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async () => {
          const result = await http_common.post("api/Accounts/login", values);
          LoginUserAction(
            store.dispatch,
            result.data.token,
            AuthUserActionType.LOGIN_USER,
          );
          navigate("/");
        });
        handleToggleRegister();
    } catch (error) {
      console.error("Error register:", error);
      toast.error("Register error !");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      try {
        const userInfoResponse = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          },
        );
        const userData = userInfoResponse.data;
        const result = await http_common.post(
          "/api/Accounts/google-login",
          userData,
        );
        LoginUserAction(
          store.dispatch,
          result.data.token,
          AuthUserActionType.LOGIN_GOOGLE_USER,
        );
        navigate("/");
      } catch (error: any) {
        console.log("LoginPage Failed:", error);
        if (error.response) {
          console.error("Server Response:", error.response.data);
        } else {
          console.error("Detailed Error:", error.message);
        }
      }
    },
    onError: (error) => console.log("LoginPage Failed:", error),
  });

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);

    const img = document.getElementById("reg-show");
    if (isVisible) {
      img?.classList.remove("show");
    } else {
      img?.classList.add("show");
    }
  };

  return (
    <>
      {showRegister ? (
        <>
          <div onClick={handleToggleRegister} className="background-dark reg">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="register-page"
            >
              <div className="register-container">
                <div className="register-header">
                  <div className="register-header-text">Personal account</div>
                  <div className="register-header-image">
                    <img
                      src={Vector}
                      alt="register-close"
                      onClick={handleToggleRegister}
                    />
                  </div>
                </div>
              <div className="register-secondheader ">
                Enter your personal information
              </div>
              <div className="register-forms">
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validationSchema={registerSchema}
                >
                  {({ values, handleChange, errors, touched, handleBlur }) => (
                    <Form>
                      <InputGroup
                        label="Cell phone"
                        type="text"
                        field="phoneNumber"
                        handleBlur={handleBlur}
                        error={errors.phoneNumber}
                        touched={touched.phoneNumber}
                        placeholder="Enter your phone"
                        handleChange={handleChange}
                      ></InputGroup>
                      <InputGroup
                        label="Last name"
                        type="text"
                        field="lastName"
                        handleBlur={handleBlur}
                        error={errors.lastName}
                        touched={touched.lastName}
                        placeholder="Enter your lastname"
                        handleChange={handleChange}
                      ></InputGroup>
                      <InputGroup
                        label="Name"
                        type="text"
                        field="firstName"
                        handleBlur={handleBlur}
                        error={errors.firstName}
                        touched={touched.firstName}
                        placeholder="Enter your name"
                        handleChange={handleChange}
                      ></InputGroup>
                      <i className="show-hide-btn" id="reg-show" onClick={toggleVisibility} />
                      <InputGroup
                        label="Password"
                        type={isVisible ? "text" : "password"}
                        field="password"
                        handleBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                        placeholder="Enter your password"
                        handleChange={handleChange}
                      ></InputGroup>
                      <InputGroup
                        label="Email"
                        type="email"
                        field="email"
                        handleBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        placeholder="Enter your email"
                        handleChange={handleChange}
                      ></InputGroup>  
                        <button
                          onClick={() => console.log(values)}
                          type="submit"
                          className="registerbutton bg-black"
                        >
                          Sign up
                        </button>
                        <p className="sign-in-text">
                          Sign in with your social networks
                        </p>
                        <div className="sign-inbuttons">
                          <button
                            type="button"
                            className="sign-inbutton"
                            onClick={() => login()}
                          >
                            <img src={Google} alt="register-close" />
                            Google
                          </button>
                          <button
                            type="button"
                            className="sign-inbutton"
                            onClick={() => login()}
                          >
                            <img src={Facebook2} alt="register-close" />
                            Facebook
                          </button>
                      </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        </>
      ) : null}
    </>
  );
};

export default Register;
