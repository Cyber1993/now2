import "./DeliveryCartItem.css";
import React from "react";
import { ICartItem } from "../../../entities/Cart.ts";
import http_common from "../../../http_common.ts";

interface DeliveryCartItemProps {
  cartItem: ICartItem;
}

const DeliveryCartItem: React.FC<DeliveryCartItemProps> = ({ cartItem }) => {
  const formatPriceWithSpaces = (price: number) => {
    return price
      .toLocaleString("en-US", {
        useGrouping: true,
      })
      .replace(/,/g, " ");
  };

  return (
    <>
      <div className="delivery-cart-item">
        <img
          src={`${http_common.getUri()}/images/300_${cartItem.product.image}`}
          alt=""
        />
        <div>
          <p>{cartItem.product.title}</p>
          <p>{formatPriceWithSpaces(cartItem.product.price)}$</p>
          <p>
            {formatPriceWithSpaces(
              cartItem.product.price - cartItem.product.discount,
            )}
            $
          </p>
        </div>
      </div>
    </>
  );
};

export default DeliveryCartItem;
