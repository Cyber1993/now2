import "./Cart.css";
import amico from "../../../assets/CartAdd.png";
import Vector from "../../../assets/Vector.png";
import React, { useEffect, useState } from "react";
import http_common from "../../../http_common.ts";
import { IProductPreview } from "../../../entities/Product.ts";
import { IAuthUser } from "../../../entities/Auth.ts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../../../common/styled/cartItem/CartItem.tsx";
import { ICartItem } from "../../../entities/Cart.ts";
import ProductPreviewsList from "../../../common/styled/productPreviewList/ProductPreviewsList.tsx";

interface CartProps {
  showCart: boolean;
  handleToggleCart: () => void;
}

const Cart: React.FC<CartProps> = ({ showCart, handleToggleCart }) => {
  const navigate = useNavigate();

  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  const [viewedProducts, setViewedProducts] = useState<IProductPreview[]>([]);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const handleProductPreviewChange = (
    updatedProductPreview: IProductPreview,
  ) => {
    setViewedProducts((prevViewedProducts) =>
      prevViewedProducts.map((product) =>
        product.id === updatedProductPreview.id
          ? { ...product, isFavorite: updatedProductPreview.isFavorite }
          : product,
      ),
    );
  };

  const fetchData = async () => {
    setCartItems([]);
    try {
      await http_common
        .get<ICartItem[]>(`api/Carts/getCartItemsByUserId/${user?.id}`)
        .then(async (resp) => {
          setCartItems(resp.data);
          if (resp.data.length === 0) {
            await http_common
              .get<IProductPreview[]>(
                `api/ViewedProducts/getViewedProductsByUserId/${user?.id}/3`,
              )
              .then((resp) => {
                setViewedProducts(resp.data);
              });
          }
        });
    } catch (error) {
      console.error("Error fetching cartItems data:", error);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [showCart]);

  return (
    <>
      {showCart ? (
        <>
          <div onClick={handleToggleCart} className="background-dark">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="cart-page"
            >
              <div className="cart-header">
                <h4>Cart</h4>
                <img src={Vector} alt="cart-close" onClick={handleToggleCart} />
              </div>
              {cartItems.length > 0 ? (
                <div className="cart-items">
                  {cartItems.map((cartItem) => (
                    <CartItem
                      key={cartItem.id}
                      cartItem={cartItem}
                      onDelete={fetchData}
                    />
                  ))}
                  <div className="cart-item-buttons">
                    <button
                      onClick={() => {
                        navigate("/");
                        handleToggleCart();
                      }}
                    >
                      Continue shopping
                    </button>
                    <button
                      onClick={() => {
                        navigate("/order");
                        handleToggleCart();
                      }}
                    >
                      To order
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cart-empty">
                    <img src={amico} alt="cart-empty" />
                    <div>
                      <h3>Your cart is empty</h3>
                      <p>But you can always add something ...</p>
                    </div>
                  </div>
                  <div className="cart-viewed-products">
                    {viewedProducts.length > 0 && (
                      <ProductPreviewsList
                        onChange={handleProductPreviewChange}
                        productPreviews={viewedProducts}
                        title="Recently viewed"
                        centered={true}
                      ></ProductPreviewsList>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Cart;
