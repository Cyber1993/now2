import "./App.css";
import { Route, Routes } from "react-router-dom";
import Loader from "./common/styled/Loader.tsx";
import HomePage from "./components/pages/home/HomePage.tsx";
import CategorySelectionPage from "./components/pages/categorySelection/categorySelectionPage.tsx";
import ProductDetail from "./components/product/product_detail/Product_Detail.tsx";
import OrderPage from "./components/pages/order/OrderPage.tsx";
import UsersListPage from "./components/pages/admin/users/list/UsersListPage.tsx";
import UsersEditPage from "./components/pages/admin/users/edit/UsersEditPage.tsx";
import CategoryList from "./components/pages/admin/category/list/CategoryListPage.tsx";
import CategoriesCreatePage from "./components/pages/admin/category/create/CategoriesCreatePage.tsx";
import CategoriesEditPage from "./components/pages/admin/category/edit/CategoriesEditPage.tsx";
import ProductList from "./components/pages/admin/product/list/ProductList.tsx";
import ProductsCreate from "./components/pages/admin/product/create/ProductsCreate.tsx";
import ProductsEdit from "./components/pages/admin/product/edit/ProductsEdit.tsx";
import ProfilePage from "./components/pages/profile/profile/ProfilePage.tsx";
import ComprasionProduct from "./components/product/product-comparison/ComparisonProduct.tsx";
import AdminLayout from "./components/containers/default/AdminLayout.tsx";
import { useSelector } from "react-redux";
import { IAuthUser } from "./entities/Auth.ts";
import ChangePasswordPage from "./components/pages/profile/change-password/ChangePasswordPage.tsx";
import WishListPage from "./components/pages/profile/wishlist/WishListPage.tsx";
import UserLayout from "./components/containers/default/UserLayout.tsx";
import MyOrdersPage from "./components/pages/profile/orders/MyOrdersPage.tsx";
import AboutUsPage from "./components/pages/about/AboutUsPage.tsx";
import ProductComments from "./components/product/prduct-comments/ProductComments.tsx";
import { useEffect } from "react";
import ErrorPage from "./components/pages/Error/ErrorPage.tsx";

function App() {
  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  const isAdmin = isAuth && user?.roles?.includes("Admin");

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <>
      <Loader />
      <Routes location={location}>
        <Route path="*" element={<ErrorPage />} />
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/comparison"} element={<ComprasionProduct />} />
        <Route path={"product/:id"} element={<ProductDetail />} />
        <Route path={"Reviews/:id"} element={<ProductComments />} />
        <Route path={"aboutus"} element={<AboutUsPage />} />
        <Route path={"/"} element={<UserLayout />}>
          <Route
            path={"categories/:name"}
            element={<CategorySelectionPage />}
          />
        </Route>
        <Route path={"order"} element={<OrderPage />} />

        {isAuth && (
          <>
            <Route path={"profile"} element={<ProfilePage />} />
            <Route
              path={"/profile/change-password"}
              element={<ChangePasswordPage />}
            />
            <Route path={"/profile/wishlist"} element={<WishListPage />} />
            <Route path={"/profile/myorders"} element={<MyOrdersPage />} />
          </>
        )}

        {isAdmin && (
          <>
            <Route path={"/admin"} element={<AdminLayout />}>
              <Route path={"users"} element={<UsersListPage />} />
              <Route path={"users/edit/:id"} element={<UsersEditPage />} />
              <Route path={"categories"} element={<CategoryList />} />
              <Route
                path={"categories/create"}
                element={<CategoriesCreatePage />}
              />
              <Route
                path={"categories/edit/:id"}
                element={<CategoriesEditPage />}
              />
              <Route path={"products"} element={<ProductList />} />
              <Route path={"products/create"} element={<ProductsCreate />} />
              <Route path={"products/edit/:id"} element={<ProductsEdit />} />
            </Route>
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
