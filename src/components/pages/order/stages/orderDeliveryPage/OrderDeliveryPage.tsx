import "./OrderDeliveryStage.css";
import React, { useState } from "react";
import { ICartItem } from "../../../../../entities/Cart.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../../../common/admin/InputGroup.tsx";
import { IOrderCreate } from "../../../../../entities/Order.ts";
import * as Yup from "yup";
import DeliveryCartItem from "../../../../../common/styled/deliveryCartItem/DeliveryCartItem.tsx";
import { ICreditCardCreate } from "../../../../../entities/CreditCard.ts";

interface OrderDeliveryStageProps {
  cartItems: ICartItem[];
  handleNextStage: () => void;
  orderInitialValues: IOrderCreate;
  creditCardInitialValues: ICreditCardCreate;
}

const OrderDeliveryStage: React.FC<OrderDeliveryStageProps> = ({
  cartItems,
  handleNextStage,
  creditCardInitialValues,
}) => {
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("User ID is required"),
    postalAddress: Yup.string().nullable(),
    orderStatus: Yup.string().required("Order status is required"),
    recipient: Yup.string().required("Recipient is required"),
  });

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice +=
        (item.product.price - item.product.discount) * item.quantity;
    }
    return totalPrice;
  };

  const formatPriceWithSpaces = (price: number) => {
    return price
      .toLocaleString("en-US", {
        useGrouping: true,
      })
      .replace(/,/g, " ");
  };

  const [showCartItems, setShowCartItems] = useState(false);

  return (
    <>
      <div className="order-delivery">
        <div className="payment-details">
          <p>Payment details</p>
          <Formik
            initialValues={creditCardInitialValues}
            onSubmit={handleNextStage}
            validationSchema={validationSchema}
          >
            {({ handleChange, values, errors, touched, handleBlur }) => (
              <Form>
                <div>
                  <InputGroup
                    type="text"
                    field="cardHolder"
                    placeholder="Enter name and surname"
                    handleBlur={handleBlur}
                    error={errors.cardHolder}
                    touched={touched.cardHolder}
                    handleChange={handleChange}
                    value={values.cardHolder}
                  ></InputGroup>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="your-order">
          <div>
            <p>Your order</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              className={
                showCartItems
                  ? "rotate-up-animation rotate-up"
                  : "rotate-up-animation"
              }
              onClick={() => setShowCartItems(!showCartItems)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.29289 0.707106C1.68342 0.316582 2.31658 0.316583 2.70711 0.707107L7.29289 5.29289C7.68342 5.68342 8.31658 5.68342 8.70711 5.29289L13.2929 0.707107C13.6834 0.316583 14.3166 0.316583 14.7071 0.707107L15.2929 1.29289C15.6834 1.68342 15.6834 2.31658 15.2929 2.70711L8.70711 9.29289C8.31658 9.68342 7.68342 9.68342 7.29289 9.29289L0.707106 2.70711C0.316582 2.31658 0.316583 1.68342 0.707107 1.29289L1.29289 0.707106Z"
                fill="black"
              />
            </svg>
          </div>
          <div
            className={`cart-items-container ${showCartItems ? "open" : ""}`}
          >
            {cartItems.map((cartItem) => (
              <DeliveryCartItem
                cartItem={cartItem}
                key={cartItem.id}
              ></DeliveryCartItem>
            ))}
          </div>
          <div>
            <div>
              <p>Shopping</p>
              <p>{formatPriceWithSpaces(calculateTotalPrice())}$</p>
            </div>
            <div>
              <p>Delivery</p>
              <p>129$</p>
            </div>
            <div>
              <p>Total</p>
              <p>{formatPriceWithSpaces(calculateTotalPrice() + 129)}$</p>
            </div>
            <button onClick={handleNextStage}>View order</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDeliveryStage;
