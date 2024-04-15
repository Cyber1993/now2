import "./ProductPreview.css";
import { IProductPreview } from "../../../entities/Product.ts";
import http_common from "../../../http_common.ts";
import Heart from "../../../assets/Heart.png";
import HeartFilled from "../../../assets/HeartFilled.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../entities/Auth.ts";
import { useState } from "react";

interface ProductPreviewProps {
  productPreview: IProductPreview;
  onChange?: (productPreview: IProductPreview) => void;
}

function ProductPreview({
  productPreview,
  onChange = () => {},
}: ProductPreviewProps) {
  const navigate = useNavigate();

  const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const [isShaking, setIsShaking] = useState(false); // State to control animation

  const toggleFavorite = async () => {
    if (!isAuth) {
      return;
    }

    try {
      await http_common.post(
        `/api/FavoriteProducts/toggleFavorite/${user?.id}/${productPreview.id}`,
      );
      productPreview.isFavorite = !productPreview.isFavorite;
      onChange(productPreview);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      <div
        onClick={() => navigate(`/product/${productPreview.id}`)}
        className="product-preview"
      >
        <div className="product-preview-image-container">
          <img
            src={`${http_common.getUri()}/Images/300_${productPreview.image}`}
            alt={productPreview.title}
          />
          <div
            className={`favorite-icon ${isShaking ? "shake" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
          >
            {productPreview.isFavorite ? (
              <img
                className="favorite-icon"
                src={HeartFilled}
                alt="favorite-icon"
              />
            ) : (
              <img className="favorite-icon" src={Heart} alt="favorite-icon" />
            )}
          </div>
        </div>
        <div className="product-preview-texts">
          <p>{productPreview.title}</p>
          {productPreview.discount !== null ? (
            <div className="price-discount">
              <p>
                {productPreview.price}
                <span>₴</span>
              </p>
              <p>
                {productPreview.price - productPreview.discount}
                <span>₴</span>
              </p>
            </div>
          ) : (
            <div className="price-single">
              <p>
                {productPreview.price}
                <span>₴</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductPreview;
