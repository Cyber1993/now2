import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import http_common from "../../../../../http_common.ts";
import { IUserEdit } from "../../../../../entities/User.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../../../common/admin/InputGroup.tsx";
import ImageGroup from "../../../../../common/admin/ImageGroup.tsx";
import DropdownCheckboxGroup from "../../../../../common/admin/DropdownCheckboxGroup.tsx";
import { IRole } from "../../../../../entities/Role.ts";

function UsersEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allRoles, setAllRoles] = useState<IRole[]>([]);

  const [initialValues, setInitialValues] = useState<IUserEdit>({
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    image: null,
    roles: [],
  });

  const userSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email address")
      .required("Email is required")
      .max(255, "Email must be smaller"),
    userName: Yup.string()
      .required("User name is required")
      .min(3, "User name must be at least 3 characters")
      .max(255, "User name must be smaller"),
    firstName: Yup.string()
      .required("First name is required")
      .min(3, "First name must be at least 3 characters")
      .max(255, "First name must be smaller"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(3, "Last name must be at least 3 characters")
      .max(255, "Last name must be smaller"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]*$/, "Phone number must contain only digits")
      .max(255, "Phone number must be smaller"),
    image: Yup.mixed().required("Image is required"),
    roles: Yup.array()
      .required("At least one role must be selected")
      .min(1, "At least one role must be selected"),
  });

  const fetchRoles = async () => {
    try {
      const response = await http_common.get(`api/Roles`);
      setAllRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await http_common.get(`api/Accounts/${id}`);
      const userData = response.data;

      setInitialValues((prevValues) => ({
        ...prevValues,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        phoneNumber: userData.phoneNumber,
        image: null,
        roles: userData.roles,
      }));

      const imageResponse = await http_common.get(
        `/images/1200_${userData.image}`,
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

  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, [id]);

  const handleSubmit = async (values: IUserEdit) => {
    console.log(values);
    try {
      await userSchema.validate(values);

      await http_common.put(`api/Accounts/${id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(-1);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  return (
    <>
      <div className="p-5 sm:ml-64">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={userSchema}
          enableReinitialize={true}
        >
          {({
            handleChange,
            values,
            errors,
            touched,
            handleBlur,
            setFieldValue,
          }) => (
            <Form className="m-5">
              <ImageGroup
                image={values.image}
                setFieldValue={setFieldValue}
                error={errors.image}
                touched={touched.image}
              ></ImageGroup>
              <DropdownCheckboxGroup
                label="Select roles"
                items={allRoles}
                selectedItems={values.roles}
                error={errors.roles}
                touched={touched.roles}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
              <InputGroup
                label="Email"
                type="email"
                field="email"
                placeholder="Enter email"
                handleBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                handleChange={handleChange}
                value={values.email}
              ></InputGroup>
              <InputGroup
                label="UserName"
                type="text"
                field="userName"
                placeholder="Enter user name"
                handleBlur={handleBlur}
                error={errors.userName}
                touched={touched.userName}
                handleChange={handleChange}
                value={values.userName}
              ></InputGroup>
              <InputGroup
                label="First name"
                type="text"
                field="firstName"
                placeholder="Enter first name"
                handleBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                handleChange={handleChange}
                value={values.firstName}
              ></InputGroup>
              <InputGroup
                label="Last name"
                type="text"
                field="lastName"
                placeholder="Enter last name"
                handleBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
                handleChange={handleChange}
                value={values.lastName}
              ></InputGroup>
              <InputGroup
                label="Phone number"
                type="tel"
                field="phoneNumber"
                placeholder="Enter phone number"
                handleBlur={handleBlur}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
                handleChange={handleChange}
                value={values.phoneNumber}
              ></InputGroup>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default UsersEditPage;
