import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import http_common from "../../../../../http_common.ts";
import { IProductCreate } from "../../../../../entities/Product.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../../../common/admin/InputGroup.tsx";
import { ICategory } from "../../../../../entities/Category.ts";
import ImageListGroup from "../../../../../common/admin/ImageListGroup.tsx";
import SelectGroup from "../../../../../common/admin/SelectGroup.tsx";
import CheckboxGroup from "../../../../../common/admin/CheckboxGroup.tsx";

function ProductsCreate() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ICategory[]>([]);

  const [initialValues] = useState<IProductCreate>({
    title: "",
    description: "",
    price: 0,
    images: [],
    rating: 0,
    discount: 0,
    categoryId: 0,
    deliveryKit: "",
    isStock: false,
  });

  const productSchema = Yup.object().shape({
    description: Yup.string()
      .required("Description is required")
      .max(255, "Description must be smaller"),
    title: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(255, "Name must be smaller"),
    price: Yup.number().required("Price is required").min(0, "Price min is 0"),
    discount: Yup.number()
      .lessThan(Yup.ref("price"), "Discount must be lower than the price")
      .nullable()
      .min(0, "Discount min is 0"),
    images: Yup.array()
      .required("At least one image is required")
      .min(1, "At least one image is required"),
    deliveryKit: Yup.string()
      .required("DeliveryKit is required")
      .max(255, "DeliveryKit must be smaller"),
  });

  useEffect(() => {
    try {
      http_common.get<ICategory[]>("api/Categories").then((resp) => {
        setCategories(resp.data);
      });
    } catch (error) {
      console.error("Error fetching Products data:", error);
    }
  }, []);

  const handleSubmit = async (values: IProductCreate) => {
    try {
        await productSchema.validate(values);

        const formData = new FormData();

        // Ітерація по всім ключам та значенням об'єкта values
        Object.entries(values).forEach(([key, value]) => {
            // Перевірка, чи ключ є "images"
            if (key === "images") {
                // Якщо ключ "images", то кожен файл додається до FormData
                (value as File[]).forEach((file: File) => {
                    formData.append(key, file);
                });
            } else {
                // Інакше, значення додається до FormData
                const sanitizedValue = value === "" ? null : value;
                formData.append(key, sanitizedValue?.toString() ?? "");
            }
        });

        // Відправка запиту на сервер
        await http_common.post("api/Products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Перехід на попередню сторінку
        navigate(-1);
    } catch (error) {
        console.error("Error creating product:", error);
    }
};

  return (
    <>
      <div className="p-5 sm:ml-64">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={productSchema}
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
              <ImageListGroup
                images={values.images}
                setFieldValue={setFieldValue}
                error={errors.images}
                touched={touched.images}
              ></ImageListGroup>
              <InputGroup
                label="Title"
                type="text"
                field="title"
                placeholder="Enter title"
                handleBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                handleChange={handleChange}
                value={values.title}
              ></InputGroup>
              <InputGroup
                label="Description"
                type="text"
                field="description"
                placeholder="Enter description"
                handleBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                handleChange={handleChange}
                value={values.description}
              ></InputGroup>
              <InputGroup
                label="Price"
                type="number"
                field="price"
                placeholder="Enter price"
                handleBlur={handleBlur}
                error={errors.price}
                touched={touched.price}
                handleChange={handleChange}
                value={values.price}
              ></InputGroup>
              <InputGroup
                label="Rating"
                type="number"
                field="rating"
                placeholder="Enter rating"
                handleBlur={handleBlur}
                error={errors.rating}
                touched={touched.rating}
                handleChange={handleChange}
                value={values.rating}
              ></InputGroup>
              <InputGroup
                label="Discount"
                type="number"
                field="discount"
                placeholder="Enter discount"
                handleBlur={handleBlur}
                error={errors.discount}
                touched={touched.discount}
                handleChange={handleChange}
                value={values.discount}
              ></InputGroup>
              <InputGroup
                label="DeliveryKit"
                type="text"
                field="deliveryKit"
                placeholder="Enter delivery kit"
                handleBlur={handleBlur}
                error={errors.deliveryKit}
                touched={touched.deliveryKit}
                handleChange={handleChange}
                value={values.deliveryKit}
              ></InputGroup>
              <CheckboxGroup
                label="Is Stock"
                type="checkbox"
                field="isStock"
                handleBlur={handleBlur}
                error={errors.isStock}
                touched={touched.isStock}
                handleChange={handleChange}
                checked={values.isStock}
              ></CheckboxGroup>
              <SelectGroup
                label="Category"
                field="categoryId"
                handleChange={handleChange}
                error={errors.categoryId}
                touched={touched.categoryId}
                handleBlur={handleBlur}
                options={categories}
                optionKey="id"
                optionLabel="name"
              ></SelectGroup>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Create
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ProductsCreate;
