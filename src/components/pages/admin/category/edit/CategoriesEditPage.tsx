import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import http_common from "../../../../../http_common.ts";
import { ICategoryEdit } from "../../../../../entities/Category.ts";
import { ICategory } from "../../../../../entities/Category.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../../../common/admin/InputGroup.tsx";
import ImageGroup from "../../../../../common/admin/ImageGroup.tsx";
import MultilevelDropdownGroup from "../../../../../common/admin/MultilevelDropdownGroup.tsx";
import TextAreaGroup from "../../../../../common/admin/TextAreaGroup.tsx";

function CategoriesEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  const [initialValues, setInitialValues] = useState<ICategoryEdit>({
    name: "",
    description: "",
    parentCategoryId: null,
    image: null,
  });

  const categorySchema = Yup.object().shape({
    description: Yup.string()
      .required("Description is required")
      .max(255, "Description must be smaller"),
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(255, "Name must be smaller"),
    image: Yup.mixed().required("Image is required"),
  });

  useEffect(() => {
    try {
      http_common.get<ICategory[]>("api/Categories").then((resp) => {
        setAllCategories(resp.data);
      });

      http_common.get(`api/Categories/${id}`).then(async (resp) => {
        setInitialValues((prevValues) => ({
          ...prevValues,
          name: resp.data.name,
          description: resp.data.description,
          parentCategoryId: resp.data.parentCategoryId,
          image: null,
        }));

        const imageResponse = await http_common.get(
          `/images/1200_${resp.data.image}`,
          { responseType: "arraybuffer" },
        );

        const imageBlob = new Blob([imageResponse.data], {
          type: "image/webp",
        });
        const imageFile = new File([imageBlob], resp.data.image, {
          type: "image/webp",
        });

        setInitialValues((prevValues) => ({
          ...prevValues,
          image: imageFile,
        }));
      });
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  }, [id]);

  const handleSubmit = async (values: ICategoryEdit) => {
    try {
      await categorySchema.validate(values);
      await http_common.put(`api/Categories/${id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  return (
    <>
      <div className="p-5 sm:ml-64">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={categorySchema}
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
              <MultilevelDropdownGroup
                label="Select parent category"
                items={allCategories}
                selectedItem={values.parentCategoryId}
                error={errors.parentCategoryId}
                touched={touched.parentCategoryId}
                setFieldValue={setFieldValue}
              ></MultilevelDropdownGroup>
              <ImageGroup
                image={values.image}
                setFieldValue={setFieldValue}
                error={errors.image}
                touched={touched.image}
              ></ImageGroup>
              <InputGroup
                label="Name"
                type="text"
                field="name"
                placeholder="Enter name"
                handleBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                handleChange={handleChange}
                value={values.name}
              ></InputGroup>
              <TextAreaGroup
                label="Description"
                field="description"
                handleChange={handleChange}
                error={errors.description}
                touched={touched.description}
                handleBlur={handleBlur}
                value={values.description}
              ></TextAreaGroup>
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

export default CategoriesEditPage;
