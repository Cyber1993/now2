import "./ProfilePage.css";
import { IAuthUser, IProfile } from "../../../../entities/Auth.ts";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputGroup from "../../../../common/admin/InputGroup.tsx";
import http_common from "../../../../http_common.ts";
import Header from "../../../header/Header.tsx";
import Footer from "../../../footer/Footer.tsx";
import { LogOut } from "../../../../store/actions/AuthActions.ts";
import Select from "react-select";
import { useEffect, useState } from "react";
import ImageGroup from "../../../../common/admin/ImageGroup.tsx";
import arrow from ".././../../../assets/ArrowMenu.png";
import Sidebar from "../sidebar/Sidebar.tsx";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth as IAuthUser);

  useEffect(() => {
    fetchUser();
    if (user?.roles.toString() == "Admin") {
      setIsAdmin(false);
    }
  }, [id]);

  const [isAdmin, setIsAdmin] = useState(true);

  const [initialValues, setInitialValues] = useState<IProfile>({
    userName: user?.userName,
    firstName: "",
    lastName: "",
    sex: "",
    position: "",
    phoneNumber: "",
    email: "",
    image: null,
  });

  console.log("initial -> ", initialValues);

  const profileSchema = Yup.object().shape({
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
      .min(8, "Last name must be at least 8 digits")
      .max(255, "Phone number must be smaller"),
    image: Yup.mixed().nullable(),
  });

  const [selectedSexOption, setSexSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>({ value: `${user?.sex}`, label: `${user?.sex}` });
  const [selectedPositionOption, setPositionSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>({ value: `${user?.position}`, label: `${user?.position}` });

  const handleSubmit = async (values: IProfile) => {
    values.sex = selectedSexOption?.value;
    values.position = selectedPositionOption?.value;

    await profileSchema.validate(values);

    try {
      await http_common.put(`api/Accounts/${user?.id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error editing user:", error);
    }
    window.location.reload();
  };

  const Logout = async () => {
    await http_common.post("api/Accounts/logout");
    LogOut();
    navigate("/");
    window.location.reload();
  };

  const sex_options = [
    { value: "Do_not_specify", label: "Do not specify" },
    { value: "Man", label: "Man" },
    { value: "Woman", label: "Woman" },
  ];
  const position_options = [
    { value: "Buyer", label: "Buyer" },
    { value: "Seller", label: "Seller" },
  ];

  const fetchUser = async () => {
    try {
      const response = await http_common.get(
        `api/Accounts/getByUserName/${user?.userName}`,
      );
      const userData = response.data;
      console.log("sex:", userData.sex);
      setSexSelectedOption({
        value: `${userData.sex}`,
        label: `${userData.sex}`,
      });
      setPositionSelectedOption({
        value: `${userData.position}`,
        label: `${userData.position}`,
      });

      setInitialValues((prevValues) => ({
        ...prevValues,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        sex: userData.sex,
        position: userData.position,
        phoneNumber: userData.phoneNumber,
        image: null,
      }));

      const imageResponse = await http_common.get(
        `/Images/1200_${userData.image}`,
        {
          responseType: "arraybuffer",
        },
      );

      const imageBlob = new Blob([imageResponse.data], {
        type: "image/webp",
      });

      const imageFile = new File([imageBlob], userData.image, {
        type: "image/webp",
      });

      setInitialValues((prevValues) => ({
        ...prevValues,
        image: imageFile,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
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
          enableReinitialize={true}
        >
          {({
            values,
            handleChange,
            errors,
            touched,
            handleBlur,
            setFieldValue,
          }) => (
            <div className="profile-page">
              <div className="profile-list">
                <ul className="profile-list-text">
                  <li onClick={() => navigate("/")}>Home</li>
                  <li className="underline-text">My profile</li>
                  <li>Additional information</li>
                  <li onClick={() => navigate("myorders")}>My orders</li>
                  <li>Correspondence with sellers</li>
                  <li onClick={() => navigate("wishlist")}>Wish list</li>
                  <li>My wallet</li>
                  <li onClick={() => navigate("change-password")}>
                    Change password
                  </li>
                  <li onClick={Logout}>Exit</li>
                </ul>
              </div>
              <div className="profile-container">
                <div className="wishlist-menu" onClick={handleToggleSidebar}>
                  <img src={arrow}></img>
                </div>
                <div className="profile-header">
                  <div className="profile-edit-image">
                    <i className="profile-edit-btn" />
                    <ImageGroup
                      className="profile-edit-img"
                      image={values.image}
                      setFieldValue={setFieldValue}
                      error={errors.image}
                      touched={touched.image}
                    ></ImageGroup>
                  </div>

                  <div className="profile-header-text">
                    <p className="profile-header-name">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="profile-header-position">{user?.position}</p>
                  </div>
                </div>
                <div className="profile-main">
                  <div className="profile-main-text">Personal information</div>

                  <Form>
                    <div className="profile-forms">
                      <InputGroup
                        label="Surname"
                        type="text"
                        field="lastName"
                        className="form-width"
                        value={values.lastName}
                        handleBlur={handleBlur}
                        error={errors.lastName}
                        touched={touched.lastName}
                        placeholder="Enter your last name"
                        handleChange={handleChange}
                      ></InputGroup>
                      <InputGroup
                        label="Name"
                        type="text"
                        field="firstName"
                        className="form-width"
                        value={values.firstName}
                        handleBlur={handleBlur}
                        error={errors.firstName}
                        touched={touched.firstName}
                        placeholder="Enter your name"
                        handleChange={handleChange}
                      ></InputGroup>
                      <div className="profile-label">
                        <label
                          htmlFor="sex-select"
                          className="profile-forms-label"
                        >
                          Sex
                        </label>
                        <Select
                          className="profile-select"
                          defaultValue={selectedSexOption}
                          onChange={setSexSelectedOption}
                          options={sex_options}
                          isSearchable={false}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: "lightgray",
                              primary: "black",
                            },
                          })}
                        />
                      </div>
                      <InputGroup
                        label="Cell phone"
                        type="text"
                        field="phoneNumber"
                        className="form-width"
                        value={values.phoneNumber}
                        handleBlur={handleBlur}
                        error={errors.phoneNumber}
                        touched={touched.phoneNumber}
                        placeholder="Enter your phone"
                        handleChange={handleChange}
                      ></InputGroup>
                      <div className="profile-label">
                        <label
                          htmlFor="position-select"
                          className="profile-forms-label"
                        >
                          Position
                        </label>
                        <Select
                          className="profile-select"
                          defaultValue={selectedPositionOption}
                          onChange={setPositionSelectedOption}
                          options={position_options}
                          isSearchable={false}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: "lightgray",
                              primary: "black",
                            },
                          })}
                        />
                      </div>
                    </div>
                    <div className="profile-email">
                      <InputGroup
                        label="Email"
                        type="email"
                        field="email"
                        className="form-width"
                        value={values.email}
                        handleBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        placeholder="Enter your email"
                        handleChange={handleChange}
                      ></InputGroup>
                      <div className="profile-email-text">
                        <p>
                          Didn't get verification code? <a>Send again</a>
                        </p>
                      </div>
                    </div>

                    <div className="profile-buttons">
                      <button type="submit" className="profile-btn">
                        Save
                      </button>

                      <button
                        hidden={isAdmin}
                        className="profile-btn"
                        onClick={() => navigate("/admin")}
                      >
                        Admin
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

export default ProfilePage;
