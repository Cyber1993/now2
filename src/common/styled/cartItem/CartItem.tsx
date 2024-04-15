import "./CartItem.css";
import { FC, InputHTMLAttributes, useState } from "react";
import http_common from "../../../http_common.ts";
import Discount from "../../../assets/Discount.png";
import { ICartItem } from "../../../entities/Cart.ts";
import CartCounter from "../cartCounter/cartCounter.tsx";

interface CartItemProps extends InputHTMLAttributes<HTMLInputElement> {
  cartItem: ICartItem;
  onDelete: () => void;
}

const CartItem: FC<CartItemProps> = ({ cartItem, onDelete }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const handleIncreaseQuantity = async () => {
    setQuantity(quantity + 1);
    try {
      await http_common.post(
        `api/Carts/addProductByCartId?cartId=${cartItem.cartId}&productId=${cartItem.product.id}`,
      );
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      try {
        await http_common.post(
          `api/Carts/removeProduct?cartId=${cartItem.cartId}&productId=${cartItem.product.id}`,
        );
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await http_common.delete(
        `api/Carts/deleteProduct?cartId=${cartItem.cartId}&productId=${cartItem.product.id}`,
      );
      onDelete();
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const formatPriceWithSpaces = (price: number) => {
    return price
      .toLocaleString("en-US", {
        useGrouping: true,
      })
      .replace(/,/g, " ");
  };

  return (
    <>
      <div className="cart-item">
        <div>
          <div>
            <div>
              <img
                src={`${http_common.getUri()}/Images/150_${
                  cartItem.product.image
                }`}
                alt=""
              />
              {cartItem.product.discount != null &&
                cartItem.product.discount > 0 && (
                  <img className="discount-icon" src={Discount} alt="" />
                )}
            </div>
            <p>{cartItem.product.title}</p>
          </div>
          <div className="delete-icon-container">
            <svg
              onClick={handleDeleteProduct}
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <g clipPath="url(#clip0_384_4185)">
                <path
                  d="M4.375 1.75C3.91087 1.75 3.46575 1.93437 3.13756 2.26256C2.80937 2.59075 2.625 3.03587 2.625 3.5V5.25C2.625 5.71413 2.80937 6.15925 3.13756 6.48744C3.46575 6.81563 3.91087 7 4.375 7H5.25V22.75C5.25 23.6783 5.61875 24.5685 6.27513 25.2249C6.9315 25.8813 7.82174 26.25 8.75 26.25H19.25C20.1783 26.25 21.0685 25.8813 21.7249 25.2249C22.3813 24.5685 22.75 23.6783 22.75 22.75V7H23.625C24.0891 7 24.5342 6.81563 24.8624 6.48744C25.1906 6.15925 25.375 5.71413 25.375 5.25V3.5C25.375 3.03587 25.1906 2.59075 24.8624 2.26256C24.5342 1.93437 24.0891 1.75 23.625 1.75H17.5C17.5 1.28587 17.3156 0.840752 16.9874 0.512563C16.6592 0.184375 16.2141 0 15.75 0L12.25 0C11.7859 0 11.3408 0.184375 11.0126 0.512563C10.6844 0.840752 10.5 1.28587 10.5 1.75H4.375ZM9.625 8.75C9.85706 8.75 10.0796 8.84219 10.2437 9.00628C10.4078 9.17038 10.5 9.39294 10.5 9.625V21.875C10.5 22.1071 10.4078 22.3296 10.2437 22.4937C10.0796 22.6578 9.85706 22.75 9.625 22.75C9.39294 22.75 9.17038 22.6578 9.00628 22.4937C8.84219 22.3296 8.75 22.1071 8.75 21.875V9.625C8.75 9.39294 8.84219 9.17038 9.00628 9.00628C9.17038 8.84219 9.39294 8.75 9.625 8.75ZM14 8.75C14.2321 8.75 14.4546 8.84219 14.6187 9.00628C14.7828 9.17038 14.875 9.39294 14.875 9.625V21.875C14.875 22.1071 14.7828 22.3296 14.6187 22.4937C14.4546 22.6578 14.2321 22.75 14 22.75C13.7679 22.75 13.5454 22.6578 13.3813 22.4937C13.2172 22.3296 13.125 22.1071 13.125 21.875V9.625C13.125 9.39294 13.2172 9.17038 13.3813 9.00628C13.5454 8.84219 13.7679 8.75 14 8.75ZM19.25 9.625V21.875C19.25 22.1071 19.1578 22.3296 18.9937 22.4937C18.8296 22.6578 18.6071 22.75 18.375 22.75C18.1429 22.75 17.9204 22.6578 17.7563 22.4937C17.5922 22.3296 17.5 22.1071 17.5 21.875V9.625C17.5 9.39294 17.5922 9.17038 17.7563 9.00628C17.9204 8.84219 18.1429 8.75 18.375 8.75C18.6071 8.75 18.8296 8.84219 18.9937 9.00628C19.1578 9.17038 19.25 9.39294 19.25 9.625Z"
                  fill="#444444"
                />
              </g>
              <defs>
                <clipPath id="clip0_384_4185">
                  <rect width="28" height="28" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div>
          <CartCounter
            quantity={quantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
          ></CartCounter>
          {cartItem.product.discount !== null ? (
            <div className="price-discount">
              <p>
                {formatPriceWithSpaces(cartItem.product.price * quantity)}
                <span>₴</span>
              </p>
              <p>
                {formatPriceWithSpaces(
                  (cartItem.product.price - cartItem.product.discount) *
                    quantity,
                )}
                <span>₴</span>
              </p>
            </div>
          ) : (
            <div className="price-single">
              <p>
                {formatPriceWithSpaces(cartItem.product.price * quantity)}
                <span>₴</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartItem;
