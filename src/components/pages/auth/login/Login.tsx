import "./Login.css";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import http_common from "../../../../http_common.ts";
import { AuthUserActionType,  ILogin } from "../../../../entities/Auth.ts";
import { LoginUserAction } from "../../../../store/actions/AuthActions.ts";
import { useGoogleLogin } from "@react-oauth/google";
import { store } from "../../../../store/store.ts";
import InputGroup from "../../../../common/admin/InputGroup.tsx";
import Vector from "../../../../assets/Vector.png";
import Google from "../../../../assets/Google.png";
import Facebook2 from "../../../../assets/Facebook2.png";
import axios from "axios";
import {  useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  showLogin: boolean;
  handleToggleLogin: () => void;
  handleToggleRegister: () => void;
}

const Login: React.FC<LoginProps> = ({
  showLogin,
  handleToggleLogin,
  handleToggleRegister,
}) => {
  const navigate = useNavigate();

  const initialValues: ILogin = {
    email: "",
    password: "",
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    const img = document.getElementById("show");

    if (isVisible) {
      img?.classList.remove("login-show");
    } else {
      img?.classList.add("login-show");
    }
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values: ILogin) => {
    try {
      const result = await http_common.post("api/Accounts/login", values);
      LoginUserAction(
        store.dispatch,
        result.data.token,
        AuthUserActionType.LOGIN_USER,
      );

      console.log("login",values);
      navigate("/");
      window.location.reload();

    } catch {
      console.log("Invalid email or password");
      toast.error("Invalid email or password !");
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
        console.log(userData);
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
        window.location.reload();
      } catch (error: any) {
        console.log("LoginPage Failed:", error);
        toast.error("Log in failed !");
        if (error.response) {
          console.error("Server Response:", error.response.data);
        } else {
          console.error("Detailed Error:", error.message);
        }
      }
    },
    onError: (error) => console.log("LoginPage Failed:", error),
  });

  return (
    <>
      {showLogin ? (
        <>
          <div onClick={handleToggleLogin} className="background-dark">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="login-page"
            >
              <div className="login-container">
                <div className="login-header">
                  <div className="login-header-text">Personal account</div>
                  <div className="login-header-image">
                    <img
                      src={Vector}
                      alt="login-close"
                      onClick={handleToggleLogin}
                    />
                  </div>
                </div>

                <div className="login-secondheader ">Log in</div>

                <div className="login-forms">
                  <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={loginSchema}
                  >
                    {({ handleChange, errors, touched, handleBlur }) => (
                      <Form>
                        <InputGroup
                          label="Email"
                          type="email"
                          field="email"
                          placeholder="Email"
                          handleBlur={handleBlur}
                          error={errors.email}
                          touched={touched.email}
                          handleChange={handleChange}
                        ></InputGroup>
                        <i
                          className="login-show-hide-btn"
                          id="show"
                          onClick={toggleVisibility}
                        />
                        <InputGroup
                          label="Password"
                          type={isVisible ? "text" : "password"}
                          field="password"
                          placeholder="Password"
                          handleBlur={handleBlur}
                          error={errors.password}
                          touched={touched.password}
                          handleChange={handleChange}
                        ></InputGroup>

                        <button type="submit" className="loginbutton bg-black">
                          Sign in
                        </button>

                        <p className="login-in-text">or</p>
                        <div className="login-inbuttons">
                          <button
                            className="login-inbutton"
                            onClick={() => login()}
                          >
                            <img
                              src={Google}
                              alt="login-close"
                              onClick={() => navigate(-1)}
                            />
                            Google
                          </button>
                          <button
                            className="login-inbutton"
                            onClick={() => login()}
                          >
                            <img
                              src={Facebook2}
                              alt="login-close"
                              onClick={() => navigate(-1)}
                            />
                            Facebook
                          </button>
                        </div>

                        <div className="login-up">
                          <p className="login-up-text">
                            Don’t have an account yet?{" "}
                            <a
                              onClick={handleToggleRegister}
                              className="login-up-text-button"
                            >
                              Create a profile
                            </a>
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      ) : null}
    </>
  );
};

export default Login;
