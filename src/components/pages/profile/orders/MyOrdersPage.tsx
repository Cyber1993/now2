import Footer from "../../../footer/Footer.tsx";
import Header from "../../../header/Header.tsx";
import "../wishlist/WishListPage.css";
import "../orders/MyOrdersPage.css";
import warranty from "../../../../assets/warrantylist.png";
import arrow from ".././../../../assets/ArrowMenu.png";
import { useEffect, useState } from "react";
import http_common from "../../../../http_common.ts";
import { useNavigate } from "react-router-dom";
import { IProductPreview } from "../../../../entities/Product.ts";
import { LogOut } from "../../../../store/actions/AuthActions.ts";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../../entities/Auth.ts";
import Sidebar from "../sidebar/Sidebar.tsx";

function MyOrdersPage() {
  const { user } = useSelector((store: any) => store.auth as IAuthUser);
  const navigate = useNavigate();

  const [ordersProducts, setOrdersProducts] = useState<IProductPreview[]>([]);
  const [isShowOrders, setShowOrders] = useState(true);

  const handleShowOrders = () => {
    setShowOrders(true);
    const order = document.getElementById("orders");
    const warranty = document.getElementById("warranty");

    order?.classList.add("current");
    warranty?.classList.remove("current");
  };

  const handleShowWarranty = () => {
    setShowOrders(false);
    const order = document.getElementById("orders");
    const warranty = document.getElementById("warranty");

    order?.classList.remove("current");
    warranty?.classList.add("current");
  };

  const fetchOrdersProducts = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        `api/FavoriteProducts/getFavoriteProductsByUserId/${user?.id}`,
      );

      setOrdersProducts(resp.data);

    } catch (error) {
      console.error("Error fetching recently viewed data:", error);
    }
  };

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleToggleSidebar = async () => {

    setShowSidebar(!showSidebar);

  if (!showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const Logout = async () => {
    await http_common.post("api/Accounts/logout");
    LogOut();
    navigate("/");
    window.location.reload();
  }

  useEffect(() => {
    fetchOrdersProducts();
    handleShowOrders();
  }, []);


  return (
    <>
      <Sidebar
        showSidebar={showSidebar}
        handleToggleSidebar={handleToggleSidebar}
      ></Sidebar>
      <Header></Header>
      <div className="wishlist-main">
        <div className="wishlist-page">
          <div className="wishlist-list">
            <ul className="wishlist-list-text">
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/profile")}>My profile</li>
              <li>Additional information</li>
              <li className="underline-text">My orders</li>
              <li>Correspondence with sellers</li>
              <li onClick={() => navigate("/profile/wishlist")}>Wish list</li>
              <li>My wallet</li>
              <li onClick={() => navigate("/profile/change-password")}>
                Change password
              </li>
              <li onClick={Logout}>Exit</li>
            </ul>
          </div>
          <div className="orders-products">
            <div className="wishlist-menu" onClick={handleToggleSidebar}>
              <img src={arrow}></img>
            </div>
            <div className="orders-header">
              <div
                className="orders-all"
                onClick={handleShowOrders}
                id="orders"
              >
                All orders
              </div>
              <div
                className="orders-all"
                onClick={handleShowWarranty}
                id="warranty"
              >
                Warranty and returns
              </div>
            </div>
            {isShowOrders ? (
              <>
                {ordersProducts.map((product) => (
                  <>
                    <div className="order-products">
                      <div className="order-product-image">
                        <img
                          className="order-img"
                          src={`${http_common.getUri()}/Images/1200_${
                            product.image
                          }`}
                          alt={product.title}
                          onClick={() => navigate(`/detail/${product.id}`)}
                        />
                      </div>

                      <div className="order-text">
                        <p className="order-title">{product.title}</p>
                        {product.discount !== null || product.discount !== 0 ? (
                          <div className="price-discount">
                            <p>
                              {product.price}
                              <span>₴</span>
                            </p>
                            <p>
                              {product.price - product.discount}
                              <span>₴</span>
                            </p>
                          </div>
                        ) : (
                          <div className="price-single">
                            <p>
                              {product.price}
                              <span>₴</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                <div className="wishlist-empty">
                  <img src={warranty} alt="wishlist-empty" />
                  <div>
                    <h3>You don't have wish lists yet</h3>
                    <p>It's time to create one</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}

export default MyOrdersPage;
