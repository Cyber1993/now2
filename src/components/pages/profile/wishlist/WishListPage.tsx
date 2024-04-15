import Footer from "../../../footer/Footer.tsx";
import Header from "../../../header/Header.tsx";
import wishlist from "../../../../assets/wishlist.png";
import "../wishlist/WishListPage.css";
import { useEffect, useState } from "react";
import arrow from ".././../../../assets/ArrowMenu.png";
import http_common from "../../../../http_common.ts";
import { useNavigate } from "react-router-dom";
import { IProductPreview } from "../../../../entities/Product.ts";
import ProductPreviewsList from "../../../../common/styled/productPreviewList/ProductPreviewsList.tsx";
import { LogOut } from "../../../../store/actions/AuthActions.ts";
import Select from "react-select";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../../entities/Auth.ts";
import  Sidebar  from "../sidebar/Sidebar.tsx";

function WishListPage() {
  const { user } = useSelector((store: any) => store.auth as IAuthUser);
  
  const [favoriteProducts, setFavoriteProducts] = useState<IProductPreview[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const navigate = useNavigate();

  const sort_options = [
    { value: 'name', label: 'By name' },
    { value: 'price', label: 'By price' },
  ];  

  const [selectedSortOption, setSortSelectedOption] = useState<{value: string; label: string;} | null>({ value: "name", label: "By name" });

  const fetchFavouriteProducts = async () => {
    try {
      const resp = await http_common.get<IProductPreview[]>(
        `api/FavoriteProducts/getFavoriteProductsByUserId/${user?.id}`,
      );

      resp.data.forEach((product) => product.isFavorite = true);
       
      if(selectedSortOption?.value == "name"){
        setFavoriteProducts(resp.data.sort((a, b) => {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        } )); 
      }
      else{
        setFavoriteProducts(resp.data.sort((a, b) => b.price - a.price));
      }

    } catch (error) {
      console.error("Error fetching recently viewed data:", error);
    }
  };

  const Logout = async () => {
    await http_common.post("api/Accounts/logout");
    LogOut();
    navigate("/");
    window.location.reload();
  }

  const handleToggleSidebar = async () => {

      setShowSidebar(!showSidebar);

    if (!showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    fetchFavouriteProducts();
  }, [selectedSortOption]);


  return (
    <>
      <Sidebar
        showSidebar={showSidebar}
        handleToggleSidebar={handleToggleSidebar}
      ></Sidebar>

      <Header />
      <div className="wishlist-main">
        <div className="wishlist-page">
          <div className="wishlist-list">
            <ul className="wishlist-list-text">
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/profile")}>My profile</li>
              <li>Additional information</li>
              <li onClick={() => navigate("/profile/myorders")}>My orders</li>
              <li>Correspondence with sellers</li>
              <li className="underline-text">Wish list</li>
              <li>My wallet</li>
              <li onClick={() => navigate("/profile/change-password")}>
                Change password
              </li>
              <li onClick={Logout}>Exit</li>
            </ul>
          </div>
          <div className="wishlist-products">
            <div className="wishlist-menu" onClick={handleToggleSidebar}>
              <img src={arrow}></img>
            </div>
            <div className="wishlist-header">
              <p>Wish list</p>
              <Select
                className="wishlist-select"
                defaultValue={selectedSortOption}
                onChange={setSortSelectedOption}
                options={sort_options}
                isSearchable={false}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgray",
                    primary: "black",
                  },
                })}
              />
            </div>
            {favoriteProducts.length > 0 ? (
              <ProductPreviewsList
                onChange={fetchFavouriteProducts}
                productPreviews={favoriteProducts}
                title=""
              ></ProductPreviewsList>
            ) : (
              <>
                <div className="wishlist-empty">
                  <img src={wishlist} alt="wishlist-empty" />
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
        <Footer />
      </footer>
    </>
  );
}

export default WishListPage;
