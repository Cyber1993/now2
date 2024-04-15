import "./HomePage.css";
import { useEffect, useState } from "react";
import http_common from "../../../http_common.ts";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../../entities/Category.ts";
import { IBanner } from "../../../entities/Banner.ts";
import ArrowRight from "../../../assets/ArrowRight.png";
import ArrowLeft from "../../../assets/ArrowLeft.png";
import { IProductPreview } from "../../../entities/Product.ts";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../entities/Auth.ts";
import ProductPreviewsList from "../../../common/styled/productPreviewList/ProductPreviewsList.tsx";
import Header from "../../header/Header.tsx";
import Footer from "../../footer/Footer.tsx";

function HomePage() {
  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [viewedProducts, setViewedProducts] = useState<IProductPreview[]>([]);
  const [promotionalOffers, setPromotionalOffers] = useState<IProductPreview[]>(
    [],
  );
  const [popularProducts, setPopularProducts] = useState<IProductPreview[]>([]);
  const [popularProductsByUser, setPopularProductsByUser] = useState<
    IProductPreview[]
  >([]);

  const navigate = useNavigate();

  const fetchPopularProductsByUser = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        `api/Products/getPopularProductsByUserId/${user?.id}/4`,
      );
      setPopularProductsByUser(resp.data);
    } catch (error) {
      console.error("Error fetching popular products data:", error);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        isAuth
          ? `api/Products/getPopularProductsWithFavorites/4/${user?.id}`
          : `api/Products/getPopularProducts/4`,
      );
      setPopularProducts(resp.data);
    } catch (error) {
      console.error("Error fetching popular products data:", error);
    }
  };

  const fetchPromotionalOffers = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        isAuth
          ? `api/Products/getPromotionalOffersWithFavorites/4/${user?.id}`
          : `api/Products/getPromotionalOffers/4`,
      );
      console.log(resp.data);
      setPromotionalOffers(resp.data);
    } catch (error) {
      console.error("Error fetching promotional offers data:", error);
    }
  };

  const fetchViewedProducts = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        `api/ViewedProducts/getViewedProductsByUserId/${user?.id}/4`,
      );
      setViewedProducts(resp.data);
    } catch (error) {
      console.error("Error fetching recently viewed data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await http_common.get<ICategory[]>(`api/Categories/getHead`);
      setCategories(resp.data);
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const resp = await http_common.get<IBanner[]>("api/Banners");
      setBanners(resp.data);
    } catch (error) {
      console.error("Error fetching banners data:", error);
    }
  };

  const fetchAll = async () => {
    await fetchCategories();
    await fetchBanners();
    if (isAuth) {
      await fetchViewedProducts();
      await fetchPopularProductsByUser();
    }

    await fetchPromotionalOffers();
    await fetchPopularProducts();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
    );
  };

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

    setPromotionalOffers((prevPromotionalOffers) =>
      prevPromotionalOffers.map((product) =>
        product.id === updatedProductPreview.id
          ? { ...product, isFavorite: updatedProductPreview.isFavorite }
          : product,
      ),
    );

    setPopularProducts((prevPopularProducts) =>
      prevPopularProducts.map((product) =>
        product.id === updatedProductPreview.id
          ? { ...product, isFavorite: updatedProductPreview.isFavorite }
          : product,
      ),
    );

    setPopularProductsByUser((prevPopularProductsByUser) =>
      prevPopularProductsByUser.map((product) =>
        product.id === updatedProductPreview.id
          ? { ...product, isFavorite: updatedProductPreview.isFavorite }
          : product,
      ),
    );
  };

  return (
    <>
      <Header onShowCartToggle={fetchAll}></Header>
      <div className="home-page">
        <div className="home-page-categories">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                navigate(`/categories/${category.name}`);
              }}
            >
              <img
                src={`${http_common.getUri()}/images/300_${category.image}`}
                alt=""
              />
              <p>{category.name}</p>
            </div>
          ))}
        </div>
        <div className="home-page-main">
          <div className="home-page-banners">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`banner-container ${
                  index === currentBannerIndex ? "active" : ""
                }`}
              >
                <div className="arrow left-arrow" onClick={handlePrevBanner}>
                  <img src={ArrowLeft} alt="" />
                </div>
                <img
                  src={`${http_common.getUri()}/images/1200_${banner.image}`}
                  alt={`Banner ${banner.id}`}
                />
                <div className="arrow right-arrow" onClick={handleNextBanner}>
                  <img src={ArrowRight} alt="" />
                </div>
              </div>
            ))}
          </div>
          <div className="home-page-products">
            {viewedProducts.length > 0 && (
              <ProductPreviewsList
                onChange={handleProductPreviewChange}
                productPreviews={viewedProducts}
                title="Recently viewed"
              ></ProductPreviewsList>
            )}
            {promotionalOffers.length > 0 && (
              <ProductPreviewsList
                onChange={handleProductPreviewChange}
                productPreviews={promotionalOffers}
                title="Promotional offers"
              ></ProductPreviewsList>
            )}
            {popularProducts.length > 0 && (
              <ProductPreviewsList
                onChange={handleProductPreviewChange}
                productPreviews={popularProducts}
                title="Popular"
              ></ProductPreviewsList>
            )}
            {popularProductsByUser.length > 0 && (
              <ProductPreviewsList
                onChange={handleProductPreviewChange}
                productPreviews={popularProductsByUser}
                title={`The most popular products among ${popularProductsByUser[0].category?.name}`}
              ></ProductPreviewsList>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default HomePage;
