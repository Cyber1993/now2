import "./OrderPage.css";
import { useEffect, useState } from "react";
import Header from "../../header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { ICartItem } from "../../../entities/Cart.ts";
import http_common from "../../../http_common.ts";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../entities/Auth.ts";
import Footer from "../../footer/Footer.tsx";
import OrderCartStage from "./stages/orderCartStage/OrderCartStage.tsx";
import OrderStage from "../../../common/styled/orderStage/OrderStage.tsx";
import OrderDeliveryStage from "./stages/orderDeliveryPage/OrderDeliveryPage.tsx";
import { IOrderCreate } from "../../../entities/Order.ts";
import { ICreditCardCreate } from "../../../entities/CreditCard.ts";

function OrderPage() {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth as IAuthUser);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ICartItem[]>([]);
  const [stageId, setStageId] = useState<number>(1);

  const [orderInitialValues] = useState<IOrderCreate>({
    userId: "",
    addressId: null,
    creditCardId: null,
    purchasePrice: 0,
    deliveryPrice: 0,
    totalPrice: 0,
    orderStatus: "",
    recipient: "",
  });

  const [creditCardInitialValues] = useState<ICreditCardCreate>({
    cardHolder: "",
    cardNumber: "",
    expiryDate: new Date(),
    cvv: "",
    userId: "",
  });

  const handleSelectItem = (cartItem: ICartItem) => {
    setSelectedItems((prevItems) => {
      const isItemSelected = prevItems.some((item) => item.id === cartItem.id);
      return isItemSelected
        ? prevItems.filter((item) => item.id !== cartItem.id)
        : [...prevItems, cartItem];
    });
  };

  const handleDeleteCartItem = async (cartItem: ICartItem) => {
    try {
      if (selectedItems.length > 0) {
        await Promise.all(
          selectedItems.map(async (item) => {
            await http_common.delete(
              `api/Carts/deleteProduct?cartId=${item.cartId}&productId=${item.product.id}`,
            );
          }),
        );
        setSelectedItems([]);
      } else {
        await http_common.delete(
          `api/Carts/deleteProduct?cartId=${cartItem.cartId}&productId=${cartItem.product.id}`,
        );
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting product(s) from cart:", error);
    }
  };

  const fetchData = async () => {
    setCartItems([]);
    try {
      await http_common
        .get<ICartItem[]>(`api/Carts/getCartItemsByUserId/${user?.id}`)
        .then(async (resp) => {
          if (resp.data.length === 0) navigate("/");
          setCartItems(resp.data);
        });
    } catch (error) {
      console.error("Error fetching cartItems data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextStage = () => {
    setStageId(stageId + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header onShowCartToggle={fetchData}></Header>
      <div className="order-page">
        <div>
          <p>
            <span
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home
            </span>
            <span> / </span>
            <span>Placing an order</span>
          </p>
        </div>
        <h2>Placing an order</h2>
        <div>
          <div className="order-stages">
            <OrderStage
              number={1}
              width={290}
              text="Cart"
              isSelected={stageId === 1}
            ></OrderStage>
            <OrderStage
              number={2}
              width={440}
              text="Delivery and order processing"
              isSelected={stageId === 2}
            ></OrderStage>
            <OrderStage
              number={3}
              width={290}
              text="Confirmation"
              isSelected={stageId === 3}
            ></OrderStage>
          </div>
          {stageId === 1 && (
            <OrderCartStage
              cartItems={cartItems}
              handleDeleteCartItem={handleDeleteCartItem}
              handleSelectItem={handleSelectItem}
              handleNextStage={handleNextStage}
            />
          )}
          {stageId === 2 && (
            <OrderDeliveryStage
              cartItems={cartItems}
              handleNextStage={handleNextStage}
              orderInitialValues={orderInitialValues}
              creditCardInitialValues={creditCardInitialValues}
            />
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default OrderPage;
