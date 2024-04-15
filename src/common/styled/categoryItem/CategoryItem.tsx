import "./CategoryItem.css";
import { FC, InputHTMLAttributes } from "react";
import http_common from "../../../http_common.ts";
import { ICategory } from "../../../entities/Category.ts";

interface CategoryItemProps extends InputHTMLAttributes<HTMLInputElement> {
  category: ICategory;
  onClick: () => void;
}

const CategoryItem: FC<CategoryItemProps> = ({ category, onClick }) => {
  return (
    <>
      <div className="category-item" onClick={onClick}>
        <div>
          <img
            src={`${http_common.getUri()}/Images/300_${category.image}`}
            alt="category"
          ></img>
        </div>
        <p>{category.name}</p>
      </div>
    </>
  );
};

export default CategoryItem;
