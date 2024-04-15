import "./ProductPreviewList.css";
import ProductPreview from "../productPreview/ProductPreview.tsx";
import { IProductPreview } from "../../../entities/Product.ts";

interface ProductPreviewListProps {
  productPreviews: IProductPreview[];
  title: string;
  centered?: boolean;
  onChange?: (productPreview: IProductPreview) => void;
}

function ProductPreviewsList({
  productPreviews,
  title,
  centered = false,
  onChange,
}: ProductPreviewListProps) {
  return (
    <>
      <div className={`product-preview-list ${centered ? "centered" : ""}`}>
        <div>
          <h4>{title}</h4>
          <div className="product-previews">
            {productPreviews.map((product) => (
              <ProductPreview
                onChange={onChange}
                productPreview={product}
                key={product.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPreviewsList;
