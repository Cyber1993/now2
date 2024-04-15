import "./CartCounter.css";
import React from "react";

interface CartCounterProps {
  handleIncreaseQuantity: () => void;
  handleDecreaseQuantity: () => void;
  quantity: number;
}

const CartCounter: React.FC<CartCounterProps> = ({
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  quantity,
}) => {
  return (
    <>
      <div className="cart-counter">
        <button onClick={handleDecreaseQuantity}>-</button>
        <p>{quantity}</p>
        <button onClick={handleIncreaseQuantity}>+</button>
      </div>
    </>
  );
};

export default CartCounter;
