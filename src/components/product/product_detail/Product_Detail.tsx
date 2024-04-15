import "./styles/Product_Detail.css";
import Scale from "../../../assets/scale-icon.svg";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IProductDetail,
  IProductImage,
  IProductPreview,
} from "../../../entities/Product";
import { useEffect, useState } from "react";
import http_common from "../../../http_common";
import { Carousel, Select } from "flowbite-react";
import Header from "../../header/Header";
import StarRating from "../../../common/styled/StarRating.tsx";
import { IComment } from "../../../entities/Comment";
import { IAdress } from "../../../entities/Adresses";
import Footer from "../../footer/Footer";
import { ICategory } from "../../../entities/Category";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import ProductPreview from "../../../common/styled/productPreview/ProductPreview.tsx";
import { useComparison } from "../../../store/reducers/comparisonReducer .tsx";
import { ICartItem } from "../../../entities/Cart.ts";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProductDetail>();
  const [productList, setProductList] = useState<IProductPreview[]>([]);
  const [frequently, setFrequently] = useState<IProductPreview[]>([]);
  const [commentsByProduct, setCommentsByProduct] = useState<IComment[]>([]);
  const [adreses, setAdreses] = useState<IAdress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAdress | null>(null);
  const [category, setCategory] = useState<ICategory>();
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const history = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const { comparisonList, dispatch } = useComparison();
  const [cart, setCart] = useState<ICartItem>();

  useEffect(() => {
    document.body.style.overflow = "auto";
    const fetchData = async () => {
      try {
        const productResp = await http_common.get(`api/Products/${id}`);
        setProduct(productResp.data);

        const cartResp = await http_common.get(
          `/api/Carts/getByUserId/${user?.id}`,
        );
        setCart(cartResp.data);

        const fetchAllAddresses = async () => {
          try {
            const allAddressesResp = await http_common.get(
              "/api/Address/getAll",
            );
            setAdreses(allAddressesResp.data);
          } catch (error) {
            console.error("Error fetching all addresses:", error);
          }
        };
        if (user?.id) {
          const fetchUserAddress = async () => {
            try {
              const userAddressResp = await http_common.get(
                `/api/Address/getByUserId/${user.id}`,
              );
              setSelectedAddress(userAddressResp.data);
            } catch (error) {
              console.error("Error fetching user address:", error);
            }
          };

          fetchUserAddress();
        } else {
          const selectRandomAddress = () => {
            const randomIndex = Math.floor(Math.random() * adreses.length);
            setSelectedAddress(adreses[randomIndex]);
          };
          selectRandomAddress();
        }
        fetchAllAddresses();

        const commentsResp = await http_common.get(
          `/api/Comments/getByProductId/${productResp.data.id}`,
        );
        setCommentsByProduct(commentsResp.data);

        if (id) {
          await http_common.post(
            `/api/ViewedProducts/${user?.id}/${productResp.data.id}`,
          );

          const frequently = await http_common.get(
            `/api/Products/Frequently/${id}`,
          );
          setFrequently(frequently.data);

          if (productResp.data?.categoryId) {
            const categoryResp = await http_common.get(
              `/api/Categories/${productResp.data.categoryId}`,
            );
            setCategory(categoryResp.data);

            if (categoryResp.data?.id) {
              const productListResp = await http_common.get(
                `/api/Products/category/${categoryResp.data.id}`,
              );
              setProductList(productListResp.data);
            }
          }
          setIsFavorite(await checkIfFavorite(productResp.data.id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, user?.id]);

  const checkIfFavorite = async (productId: any) => {
    try {
      const response = await http_common.get(
        `/api/FavoriteProducts/isFavorite/${user?.id}/${productId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error checking if product is favorite:", error);
      return false;
    }
  };
  const addToFavorites = async () => {
    try {
      if (user && user.id) {
        await http_common.post(
          `/api/FavoriteProducts/${user.id}/${product?.id}`,
        );
        setIsFavorite(true);
      } else {
        console.error("User or user ID is undefined");
      }
    } catch (error) {
      console.error("Error adding product to favorites:", error);
    }
  };
  const removeFromFavorites = async () => {
    try {
      if (user && user.id && product?.id) {
        await http_common.delete(
          `/api/FavoriteProducts/${user.id}/${product.id}`,
        );
        setIsFavorite(false);
      } else {
      }
    } catch (error) {
      console.error("Error removing product from favorites:", error);
    }
  };
  const buttonClick = async () => {
    try {
      if (isFavorite === true) {
        await removeFromFavorites();
      } else {
        await addToFavorites();
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const handleAddToComparison = () => {
    if (product) {
      const isAlreadyInComparison = comparisonList.some(
        (item) => item.id === product.id,
      );

      if (!isAlreadyInComparison) {
        dispatch({ type: "ADD_TO_COMPARISON", product });

        const updatedComparisonList = [...comparisonList, product];

        localStorage.setItem(
          "comparisonList",
          JSON.stringify(updatedComparisonList),
        );

        history("/comparison");
      } else {
        console.log(
          "Product is already in the comparison list",
          comparisonList,
        );
      }
    }
  };

  console.log(comparisonList);

  const addCart = async () => {
    try {
      if (product?.id) {
        await http_common.post(
          `api/Carts/addProduct?cartId=${cart?.id}&productId=${product.id}`,
        );
      } else {
        console.error(" ");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <>
      <Header></Header>

      <div className="ma">
        <div className="conteinerL">
          <div className="ways">
            <span>
              <Link to="/">Головна/</Link>
            </span>
            {pathnames.map((name, index) => (
              <span key={index}>
                {index > 0 && " / "}
                <Link to={`/${pathnames.slice(0, index + 1).join("/")}`}>
                  {name}
                </Link>
              </span>
            ))}
          </div>
          <div className="tabs">
            <div className="curent">Усе про товар</div>
            <span>Характеристики</span>
            <span
              onClick={() => {
                history(`/Reviews/${product?.id}`);
              }}
            >
              Відгуки
            </span>
            <span>Питання</span>
            <span>Відео</span>
            <span>Фото</span>
            <span>Купують разом</span>
          </div>
        </div>
        {product && (
          <div className="detail">
            <div className="containerCaruselAndSilver">
              <div className="carusel">
                <button onClick={buttonClick} className="heart">
                  {isFavorite ? (
                    <i className="bi bi-heart-fill"></i>
                  ) : (
                    <i className="bi bi-heart"></i>
                  )}
                </button>
                <Carousel pauseOnHover>
                  {product?.images && Array.isArray(product.images) ? (
                    product.images.map((i: IProductImage) => (
                      <img
                        key={i.id}
                        src={`${http_common.getUri()}/images/1200_${i.image}`}
                        alt={i.image}
                      />
                    ))
                  ) : (
                    <img src="" alt="" />
                  )}
                </Carousel>
              </div>
              <div className="silver">
                <img
                  src={`${http_common.getUri()}/Images/1200_${product?.images[0]
                    .image}`}
                />
              </div>
            </div>
            <div className="container">
              <span className="namep">
                {category?.name} {product.title}
              </span>
              <span className="kodp">Код: {product.id}</span>
              <div className="prices">
                {product.discount !== null ? (
                  <div className="price-discount">
                    <p className="price">
                      {product.price}
                      <span>₴</span>
                    </p>
                    <p className="discount">
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
              <div className="colors">
                <p className="tet">колір:silver</p>
                <div className="color">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <circle cx="20" cy="20" r="20" fill="#333333" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19"
                      fill="#FFCC66"
                      stroke="#FFC248"
                      strokeWidth="2"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19"
                      fill="#FFCC66"
                      stroke="#FFC248"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="rating">
                <StarRating rating={product.rating} />
              </div>
              <span
                className={`stock ${
                  product.isStock ? "inStock" : "outOfStock"
                }`}
              >
                {product.isStock ? "Є в наявності" : "Немає в наявності"}
              </span>
              <div className="conteinerButtons">
                <button className="buy" onClick={addCart}>
                  <i className="bi bi-cart"></i> Купуй
                </button>
                <button className="credit" onClick={addCart}>
                  <i className="bi bi-credit-card"></i> Бери в кредит
                </button>
                <button className="scale" onClick={handleAddToComparison}>
                  <img src={Scale} alt="img" onClick={handleAddToComparison} />
                </button>
              </div>
              <div className="delivery">
                <Select id="adress" required>
                  {user && selectedAddress ? (
                    <option>
                      {selectedAddress.country} {selectedAddress.state}
                    </option>
                  ) : (
                    adreses &&
                    adreses.map((a) => <option key={a.id}>{a.state}</option>)
                  )}
                </Select>
                <div className="Typesofdeliveries">
                  <div>
                    Доставка кур'єром Meest ПОШТА, Нової Пошти{" "}
                    <span> Відправимо завтра </span>
                    <span> 110₴ – 199₴</span>
                  </div>
                  <div>
                    Самовивіз з відділень поштових операторів{" "}
                    <span> Відправимо завтра </span> <span>69₴ – 119₴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="description">
          <h2>{product?.title}</h2>
          {product?.images && product?.images[0] && (
            <img
              src={`${http_common.getUri()}/Images/300_${
                product.images[0].image
              }`}
              alt={product.images[0].image}
            />
          )}
        </div>

        <div className="characteristics">
          <div>
            <h2 className="h">
              Список <span className="unk">основних</span> характеристик
            </h2>
            <div className="tetx">
              <ul className="u">
                <li>{product?.description}</li>
              </ul>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="228"
              height="228"
              viewBox="0 0 228 228"
              fill="none"
              className="blue"
            >
              <g filter="url(#filter0_f_155_3024)">
                <circle
                  cx="114"
                  cy="114"
                  r="110"
                  fill="#0A73B5"
                  fillOpacity="0.6"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_155_3024"
                  x="0"
                  y="0"
                  width="228"
                  height="228"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="2"
                    result="effect1_foregroundBlur_155_3024"
                  />
                </filter>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="228"
              height="228"
              viewBox="0 0 228 228"
              fill="none"
              className="red"
            >
              <g filter="url(#filter0_f_155_3023)">
                <circle
                  cx="114"
                  cy="114"
                  r="110"
                  fill="#F93232"
                  fillOpacity="0.7"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_155_3023"
                  x="0"
                  y="0"
                  width="228"
                  height="228"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="2"
                    result="effect1_foregroundBlur_155_3023"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="kit">
          <h2>Комплект поставки</h2>
          <img src={product?.deliveryKit} alt="" />
        </div>

        <div className="similar">
          <h4>Схожі товари</h4>
          <div className="containerSim">
            <div className="list_similar">
              {productList.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => history(`/product/${prod.id}`)}
                >
                  <ProductPreview productPreview={prod} {...prod} />
                </div>
              ))}
              <Link to={"/"} className="arrowLink">
                <div className="arrowSim">
                  <span className="vector">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        {frequently.length > 0 && (
          <div className="frequently">
            <h4>Разом з цим товаром купують</h4>
            <div className="list_similar">
              <div className="tree">
                {frequently.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => history(`/product/${prod.id}`)}
                  >
                    <ProductPreview productPreview={prod} {...prod} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {commentsByProduct && commentsByProduct.length > 0 && (
          <div className="comment">
            <h4 className="h">Відгуки клієнтів</h4>
            <div className="coms">
              {commentsByProduct.slice(0, 3).map((comment) => (
                <div className="com" key={comment.id}>
                  <div className="contratingADate">
                    <div className="rating">
                      <StarRating rating={comment.rating} />
                    </div>
                    <div className="date">
                      {comment.user && comment.user.dateCreated && (
                        <span>
                          {new Intl.DateTimeFormat("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(comment.user.dateCreated))}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text_com">{comment.text}</div>
                  <div className="user">
                    <div className="image">
                      <img
                        src={`${http_common.getUri()}/Images/300_${
                          comment.user.image
                        }`}
                        alt=""
                      />
                    </div>
                    <div>
                      <span className="userName">{comment.user.firstName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ProductDetail;
