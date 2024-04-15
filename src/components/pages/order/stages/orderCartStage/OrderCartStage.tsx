import "./OrderCartStage.css";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../../../entities/Auth.ts";
import { ICartItem } from "../../../../../entities/Cart.ts";
import OrderCartItem from "../../../../../common/styled/orderCartItem/OrderCartItem.tsx";
import InputGroup from "../../../../../common/admin/InputGroup.tsx";
import http_common from "../../../../../http_common.ts";
import axios, { AxiosError } from "axios";

interface OrderCartStageProps {
  cartItems: ICartItem[];
  handleDeleteCartItem: (cartItem: ICartItem) => void;
  handleSelectItem: (cartItem: ICartItem) => void;
  handleNextStage: () => void;
}

const OrderCartStage: React.FC<OrderCartStageProps> = ({
  cartItems,
  handleDeleteCartItem,
  handleSelectItem,
  handleNextStage,
}) => {
  const { user } = useSelector((store: any) => store.auth as IAuthUser);

  const validationSchema = Yup.object().shape({
    coupon: Yup.string().test(
      "is-changing",
      "Success value should be undefined",
      function (value) {
        if (value !== undefined && value !== null && value !== "") {
          setSuccess(undefined);
        }
        return true;
      },
    ),
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting, setErrors }: any,
  ) => {
    try {
      await http_common.post(
        `api/PromoCodes/activate/${values.coupon}/${user?.id}`,
      );
      setSuccess("Promo code applied successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 400) {
          const responseBody = axiosError.response.data;
          if (typeof responseBody === "string") {
            setErrors({ coupon: responseBody });
          } else {
            setErrors({ coupon: "Failed to apply the promo code" });
          }
        } else {
          setErrors({ coupon: "Failed to apply the promo code" });
        }
      } else {
        setErrors({ coupon: "Failed to apply the promo code" });
      }
      setSuccess(undefined);
    } finally {
      setSubmitting(false);
    }
  };

  const [initialValues] = useState({
    coupon: "",
  });

  const [success, setSuccess] = useState<string | undefined>(undefined);

  return (
    <>
      <div className="order-cart">
        {cartItems.map((cartItem, index) => (
          <>
            <OrderCartItem
              key={cartItem.id}
              cartItem={cartItem}
              onDelete={handleDeleteCartItem}
              onSelect={handleSelectItem}
            />
            {index !== cartItems.length - 1 && <hr />}
          </>
        ))}
        <div className="order-page-coupon">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              values,
              errors,
              touched,
              handleBlur,
              isSubmitting,
            }) => (
              <Form>
                <div>
                  <h1>Promocode</h1>
                  <p>Enter the coupon code if you have one</p>
                  <InputGroup
                    type="text"
                    field="coupon"
                    placeholder="Code"
                    handleBlur={handleBlur}
                    error={errors.coupon}
                    touched={touched.coupon}
                    handleChange={handleChange}
                    value={values.coupon}
                    success={success}
                  ></InputGroup>
                </div>
                <button type="submit" disabled={isSubmitting}>
                  Apply
                </button>
              </Form>
            )}
          </Formik>
          <button onClick={handleNextStage}>Go further</button>
        </div>
      </div>
    </>
  );
};

export default OrderCartStage;
