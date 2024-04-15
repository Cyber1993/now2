import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import "./ErrorPage.css";
import error from "../../../assets/Error.png";


function ErrorPage() {

  return (
    <>
    <Header></Header>

    <div className="error-main">
      <div className="error-page">
        <div className="error-container">
          <img src={error}/>
          <div className="error-text">
            Oops... something went wrong
          </div>
        </div>
      </div>
    </div>

      <Footer></Footer>

    </>
  );
};

export default ErrorPage;
