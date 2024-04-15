import './Style/ComparisonProduct.css'
import Chapter from "../../../assets/pana.png"
import t from "../../../assets/Component 53.png"
import Attention from "../../../assets/attention.png"
import { useEffect, useState } from "react";
import ProductPreviewsList from "../../../common/styled/productPreviewList/ProductPreviewsList";
import { IProductDetail, IProductPreview} from "../../../entities/Product";
import Footer from "../../footer/Footer"
import Header from "../../header/Header"
import http_common from "../../../http_common";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../entities/Auth";

import { useComparison } from '../../../store/reducers/comparisonReducer ';
import { RootState } from '../../../store/store';

import { Dropdown} from 'flowbite-react';
import { Link } from 'react-router-dom';

function ComprasionProduct(){
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const user = useSelector((state: RootState) => state.auth.user);
  const [popularProducts, setPopularProducts] = useState<IProductPreview[]>([]);
  const { comparisonList,dispatch} = useComparison();
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>();

  
  const loadComparisonListFromLocalStorage = () => {
    const savedComparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    dispatch({ type: 'SET_COMPARISON_LIST', comparisonList: savedComparisonList });
  };
 console.log(comparisonList);
 
 
 const handleRemoveFromComparison = (product: IProductDetail) => {
  if (product) {
    const isAlreadyInComparison = comparisonList.some((item) => item.id === product.id);
    if (isAlreadyInComparison) {
      dispatch({ type: 'REMOVE_FROM_COMPARISON', productId: product.id });
      const updatedComparisonList = comparisonList.filter((item) => item.id !== product.id);
      localStorage.setItem('comparisonList', JSON.stringify(updatedComparisonList));
    } else {
      console.log('Product is not in the comparison list', comparisonList);
    }
  }
};


const checkIfFavorite = async (productId: any) => {
  try {
    const response = await http_common.get(`/api/FavoriteProducts/isFavorite/${user?.id}/${productId}`);
    setIsFavorite(response.data.isFavorite(productId));
    return response.data;
  } catch (error) {
    console.error("Error checking if product is favorite:", error);
    return false;
  }
};



const addToFavorites = async (productId: any) => {
  try {
    if (!user || !user.id) {
      console.error("User or user ID is undefined");
      return;
    }

    await http_common.post(`/api/FavoriteProducts/${user.id}/${productId}`);
    setIsFavorite(true);
  } catch (error) {
    console.error("Error adding product to favorites:", error);
  }
};

const removeFromFavorites = async (productId: any) => {
  try {
    if (!user || !user.id || !productId) {
      console.error("User, user ID, or product ID is undefined");
      return;
    }

    await http_common.delete(`/api/FavoriteProducts/${user.id}/${productId}`);
    setIsFavorite(false);
  } catch (error) {
    console.error("Error removing product from favorites:", error);
  }
};

const buttonClick = async (productId: any) => {
  try {
    const isProductFavorite = await checkIfFavorite(productId);

    if (isProductFavorite) {
      await removeFromFavorites(productId);
      setIsFavorite(isProductFavorite);
    } else {
      await addToFavorites(productId);
    }

    
  } catch (error) {
    console.error("Error toggling favorite status:", error);
  }
};


  const fetchPopularProducts = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        `api/Products/getPopularProducts/4`,
      );
      setPopularProducts(resp.data);
    } catch (error) {
      console.error("Error fetching popular products data:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof isAuth === 'boolean' && isAuth) {
          await fetchPopularProducts();
        }
        
        const comparisonProducts = loadComparisonListFromLocalStorage();
        
        if (Array.isArray(comparisonProducts)) {
          const promises = comparisonProducts.map(async (product) => {
            const isFav = await checkIfFavorite(product.id);
            return typeof product === 'object' ? { ...product, isFavorite: isFav } : null;
          });
    
          const updatedProducts = await Promise.all(promises).then(results => results.filter(Boolean));
    
          dispatch({ type: 'SET_COMPARISON_LIST', comparisonList: updatedProducts });
        }
      }
      catch(error) {
        console.error("Error in fetchData:", error);
      }
    };
  
    fetchData();
  }, [isAuth, dispatch]);
  



  console.log(isFavorite);
  const addCart = async (product: IProductDetail) => {
    try {
      if (user && user.id && product && product.id) {
        await http_common.post(
          `/api/Carts/addProductByUserId?userId=${user.id}&productId=${product.id}`,
        );
      } else {
        console.error("Invalid user or product");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };


  return(
    <>
    <Header></Header>
    <div className='body2-0'>
      <p className='HeadTxt'>Порівнюємо</p>
      <div className="butonsHed">
        <Link to='/'>
          <button className="add-model">
            <svg width="46" height="45" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M14.2719 7.53182C20.0729 6.88881 25.9271 6.88881 31.7281 7.53182C34.94 7.89182 37.5312 10.4212 37.9081 13.6443C38.5962 19.528 38.5962 25.4719 37.9081 31.3556C37.5312 34.5787 34.94 37.1081 31.7281 37.4681C25.9271 38.1112 20.0729 38.1112 14.2719 37.4681C11.06 37.1081 8.46875 34.5787 8.09187 31.3556C7.40378 25.4725 7.40378 19.5293 8.09187 13.6462C8.2825 12.0803 8.99633 10.6247 10.1177 9.51527C11.239 8.40584 12.7022 7.70759 14.27 7.53369M23 13.1381C23.373 13.1381 23.7306 13.2862 23.9944 13.5499C24.2581 13.8137 24.4062 14.1714 24.4062 14.5443V21.0937H30.9556C31.3286 21.0937 31.6863 21.2418 31.95 21.5056C32.2137 21.7693 32.3619 22.127 32.3619 22.4999C32.3619 22.8729 32.2137 23.2306 31.95 23.4943C31.6863 23.758 31.3286 23.9062 30.9556 23.9062H24.4062V30.4556C24.4062 30.8285 24.2581 31.1862 23.9944 31.4499C23.7306 31.7137 23.373 31.8618 23 31.8618C22.627 31.8618 22.2694 31.7137 22.0056 31.4499C21.7419 31.1862 21.5937 30.8285 21.5937 30.4556V23.9062H15.0444C14.6714 23.9062 14.3137 23.758 14.05 23.4943C13.7863 23.2306 13.6381 22.8729 13.6381 22.4999C13.6381 22.127 13.7863 21.7693 14.05 21.5056C14.3137 21.2418 14.6714 21.0937 15.0444 21.0937H21.5937V14.5443C21.5937 14.1714 21.7419 13.8137 22.0056 13.5499C22.2694 13.2862 22.627 13.1381 23 13.1381Z" fill="black"/></svg>
          </button>
        </Link>
        <button className="list-comprasion">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.86662 6.05005C4.86662 5.71853 4.99832 5.40059 5.23274 5.16617C5.46716 4.93174 5.7851 4.80005 6.11662 4.80005H33.6166C33.9481 4.80005 34.2661 4.93174 34.5005 5.16617C34.7349 5.40059 34.8666 5.71853 34.8666 6.05005C34.8666 6.38157 34.7349 6.69951 34.5005 6.93393C34.2661 7.16835 33.9481 7.30005 33.6166 7.30005H31.88L36.4416 18.495C36.5024 18.6449 36.5335 18.805 36.5333 18.9667C36.5333 20.5138 35.9187 21.9975 34.8247 23.0915C33.7308 24.1855 32.247 24.8 30.7 24.8C29.1529 24.8 27.6691 24.1855 26.5752 23.0915C25.4812 21.9975 24.8666 20.5138 24.8666 18.9667C24.8664 18.805 24.8975 18.6449 24.9583 18.495L29.52 7.30005H21.1166V27.3H27.7833C28.7778 27.3 29.7317 27.6951 30.4349 28.3984C31.1382 29.1017 31.5333 30.0555 31.5333 31.05C31.5333 32.0446 31.1382 32.9984 30.4349 33.7017C29.7317 34.405 28.7778 34.8 27.7833 34.8H11.955C10.9604 34.8 10.0066 34.405 9.3033 33.7017C8.60004 32.9984 8.20495 32.0446 8.20495 31.05C8.20495 30.0555 8.60004 29.1017 9.3033 28.3984C10.0066 27.6951 10.9604 27.3 11.955 27.3H18.6166V7.30005H10.2133L14.775 18.495C14.8357 18.6449 14.8669 18.805 14.8666 18.9667C14.8666 19.7328 14.7157 20.4913 14.4226 21.199C14.1294 21.9068 13.6997 22.5498 13.1581 23.0915C12.6164 23.6332 11.9733 24.0629 11.2656 24.356C10.5579 24.6492 9.79933 24.8 9.03329 24.8C8.26724 24.8 7.5087 24.6492 6.80097 24.356C6.09323 24.0629 5.45017 23.6332 4.9085 23.0915C4.36682 22.5498 3.93714 21.9068 3.64399 21.199C3.35084 20.4913 3.19995 19.7328 3.19995 18.9667C3.19972 18.805 3.23085 18.6449 3.29162 18.495L7.85329 7.30005H6.11662C5.7851 7.30005 5.46716 7.16835 5.23274 6.93393C4.99832 6.69951 4.86662 6.38157 4.86662 6.05005ZM10.705 31.05C10.705 31.74 11.265 32.3 11.955 32.3H27.7833C28.1148 32.3 28.4327 32.1684 28.6672 31.9339C28.9016 31.6995 29.0333 31.3816 29.0333 31.05C29.0333 30.7185 28.9016 30.4006 28.6672 30.1662C28.4327 29.9317 28.1148 29.8 27.7833 29.8H11.955C11.6234 29.8 11.3055 29.9317 11.0711 30.1662C10.8366 30.4006 10.705 30.7185 10.705 31.05ZM12.125 20.2167H5.94162C6.1901 20.8332 6.61723 21.3614 7.16814 21.7333C7.71905 22.1052 8.36858 22.304 9.03329 22.304C9.69799 22.304 10.3475 22.1052 10.8984 21.7333C11.4493 21.3614 11.8765 20.8332 12.125 20.2167ZM11.7583 17.7167L9.03329 11.03L6.30829 17.7167H11.7583ZM30.7 22.3C31.3642 22.3004 32.0134 22.1022 32.5643 21.731C33.1151 21.3598 33.5425 20.8325 33.7916 20.2167H27.6083C27.8574 20.8325 28.2848 21.3598 28.8356 21.731C29.3865 22.1022 30.0357 22.3004 30.7 22.3ZM27.975 17.7167H33.425L30.7 11.03L27.975 17.7167Z" fill="black"/></svg>
        </button>
        <button className="share">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.1784 18.8216L22.845 5.48822C22.612 5.25521 22.315 5.09653 21.9918 5.03225C21.6685 4.96797 21.3335 5.00098 21.0289 5.12709C20.7245 5.25321 20.4642 5.46677 20.281 5.74079C20.0979 6.01481 20.0001 6.33697 20 6.66656V12.5749C15.4472 12.9962 11.2154 15.1013 8.13286 18.4783C5.0503 21.8552 3.33883 26.2609 3.33337 30.8332V33.3332C3.33364 33.6792 3.44156 34.0165 3.64216 34.2984C3.84277 34.5802 4.12612 34.7927 4.45292 34.9063C4.77971 35.0198 5.13375 35.0289 5.46592 34.9322C5.7981 34.8355 6.09194 34.6378 6.30671 34.3666C7.93954 32.4248 9.94297 30.8279 12.1999 29.6693C14.4569 28.5106 16.9222 27.8133 19.4517 27.6182C19.535 27.6082 19.7434 27.5916 20 27.5749V33.3332C20.0001 33.6628 20.0979 33.985 20.281 34.259C20.4642 34.533 20.7245 34.7466 21.0289 34.8727C21.3335 34.9988 21.6685 35.0318 21.9918 34.9675C22.315 34.9032 22.612 34.7446 22.845 34.5116L36.1784 21.1782C36.4908 20.8657 36.6664 20.4418 36.6664 19.9999C36.6664 19.5579 36.4908 19.1341 36.1784 18.8216ZM23.3334 29.3099V25.8332C23.3334 25.3912 23.1578 24.9673 22.8452 24.6547C22.5327 24.3422 22.1087 24.1666 21.6667 24.1666C21.2417 24.1666 19.5067 24.2499 19.0634 24.3082C14.5715 24.7221 10.2957 26.4287 6.75337 29.2216C7.15545 25.5456 8.89927 22.1471 11.651 19.6768C14.4027 17.2065 17.9688 15.838 21.6667 15.8332C22.1087 15.8332 22.5327 15.6576 22.8452 15.3451C23.1578 15.0325 23.3334 14.6086 23.3334 14.1666V10.6899L32.6434 19.9999L23.3334 29.3099Z" fill="black"/></svg>
        </button>
      </div>
      <div className="productSelect">
            {comparisonList?.length >= 2 ? (
            <div className='Multi_Product'>
              <div className='cart'>
                {comparisonList.map((product) => (
                  <div key={product.id} className='productItem'>
                    <div className='imgcont'>
                      <img src={`${http_common.getUri()}/Images/300_${product?.images[0].image}`} alt={product.title} />
                    </div>
                    <div className='prodbody'>
                      <div className='info'>
                        <h3>{product.title}</h3>
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
                        <span className={`stock ${product.isStock ? 'inStock' : 'outOfStock'}`}>
                          {product.isStock ? 'Є в наявності' : 'Немає в наявності'}
                        </span>
                      </div>
                    </div>
                    <div className='containerBut'>
                      <div className='const'>
                        <Dropdown label="" dismissOnClick={false} renderTrigger={() => <i className="bi bi-three-dots-vertical"></i>}>
                          <Dropdown.Item>
                            <div className='butCont' onClick={() => handleRemoveFromComparison(product)}>
                              <i className="bi bi-trash3"></i><p>Видалити </p>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item>
                           
                            <div className="butCont" onClick={()=>buttonClick(product.id)}>
                                {isFavorite ? (
                                  <span className="butCont">
                                    <i className="bi bi-heart-fill"></i>
                                    <p>У список бажань</p>
                                  </span>
                                ) : (
                                  <span className="butCont">
                                    <i className="bi bi-heart"></i>
                                    <p>У список бажань</p>
                                  </span>
                                )}
                            </div>
                          </Dropdown.Item>
                        </Dropdown>
                      </div>
                      <div className='conteinerButtons'>
                        <button className='cartbt' onClick={() => addCart(product)}>
                          <img src={t} alt="Add to Cart" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
            
      </div>
            ) : comparisonList?.length === 1 ? (
              <div className='single_Product'>
                  <div className='conteinerHeadImg'>
                    <img src={Attention} alt="" />
                    <p>Недостатньо товарів для порівняння</p>
                  </div>
                  <div className='cart'>
                  {comparisonList.map((product) => (
                    <div key={product.id} className='productItem'>
                      
                        <div className='imgcont'>
                          <img src={`${http_common.getUri()}/Images/300_${product?.images[0].image}`} />
                        </div>
                        <div className='prodbody'>
                          <div className='info'>
                              <h3>{product.title}</h3>
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
                              <span className={`stock ${product.isStock ? 'inStock' : 'outOfStock'}`}>
                                {product.isStock ? 'Є в наявності' : 'Немає в наявності'}
                              </span> 
                          </div>
                        </div> 
                        <div className='containerBut'>
                              <div className='const'>
                                  <Dropdown label="" dismissOnClick={false} renderTrigger={() => <i className="bi bi-three-dots-vertical"></i>}>
                                    <Dropdown.Item>
                                            <button className='butCont' onClick={() => handleRemoveFromComparison(product)}>
                                              <i className="bi bi-trash3"></i>
                                              <p>Видалити </p>
                                            </button>
                                      </Dropdown.Item>
                                      <Dropdown.Item className='butCont'><i className="bi bi-heart"></i> <p> У список бажань </p></Dropdown.Item>
                                  </Dropdown>

                                </div>
                              <div className='conteinerButtons'>
                                    <button className='cartbt'>
                                      <img src={t} onClick={() => addCart(product)} />
                                    </button>
                              </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='noComprasion'>
                <img src={Chapter} alt='' />
                <p>Немає товарів в порівнянні. Додавайте товари до порівняння характеристик і вибирайте товар, який найбільше вам підходить.</p>
              </div>
            )}

            <div>
            {comparisonList?.length >= 2 ? (
            <div className='Multi_Product'>
              <div className="row compare">
                  <div className="col-12 mt-5 text-center">
                    <table className="table">
                      <thead className="thead-default">
                        <tr>
                          <th />
                          {comparisonList.map(product =>
                            <th key={product.id}>
                              {product.title}
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="priceTable">
                          <th scope="row">Price</th>
                          {comparisonList.map(product =>
                            <td key={product.id} className="text-center">{product.price}</td>
                          )}
                        </tr>
                        <tr className="priceTable">
                          <th scope="row">Discount</th>
                          {comparisonList.map(product =>
                            <td key={product.id} className="text-center">{product.discount}</td>
                          )}
                        </tr>
                        <tr className="priceTable">
                          <th scope="row">Description</th>
                          {comparisonList.map(product =>
                            <td key={product.id}>
                              {product.description}
                            </td>
                          )}
                        </tr>
                        <tr className="priceTable">
                          <th scope="row">Rating</th>
                          {comparisonList.map(product =>
                            <td key={product.id}>
                              {product.rating}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
) : (
  <></>
)}
            </div>
      </div>
        <div className="popularProd">
            <div>
                {popularProducts.length > 0 && (
                  <ProductPreviewsList
                    productPreviews={popularProducts}
                    title="Найпопулярніші товари " 
                  ></ProductPreviewsList>
                )}
            </div>
        </div>
    </div>
    <Footer></Footer>
    </>

  )

}
export default ComprasionProduct;

