import { Outlet } from "react-router-dom";
import Header from "../../header/Header.tsx";
import Footer from "../../footer/Footer.tsx";

const UserLayout = () => {
  return (
    <>
      <Header></Header>
      <Outlet />
      <Footer></Footer>
    </>
  );
};

export default UserLayout;
