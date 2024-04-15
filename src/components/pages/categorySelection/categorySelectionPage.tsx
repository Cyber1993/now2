import "./CategorySelectionPage.css";
import { useEffect, useState } from "react";
import http_common from "../../../http_common.ts";
import { ICategorySelection } from "../../../entities/Category.ts";
import CategoryItem from "../../../common/styled/categoryItem/CategoryItem.tsx";
import { useNavigate, useParams } from "react-router-dom";

function CategorySelectionPage() {
  const [categorySelection, setCategorySelection] =
    useState<ICategorySelection>();

  const { name } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      await http_common
        .get<ICategorySelection>(
          `api/Categories/getByParentCategoryName/${name}`,
        )
        .then(async (resp) => {
          setCategorySelection(resp.data);
        });
    } catch (error) {
      console.error("Error fetching cartItems data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);

  return (
    <>
      <div className="category-selection-page">
        <div>
          <p>
            <span
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home
            </span>
            {categorySelection &&
              categorySelection.parentCategories &&
              categorySelection.parentCategories.map((parentCategory) => (
                <>
                  <span> / </span>
                  <span
                    onClick={() => {
                      navigate(`/categories/${parentCategory.name}`);
                    }}
                  >
                    {parentCategory.name}
                  </span>
                </>
              ))}
          </p>
          <h2>
            {
              categorySelection?.parentCategories[
                categorySelection.parentCategories.length - 1
              ].name
            }
          </h2>
        </div>
        <div>
          {categorySelection?.categories &&
            categorySelection.categories.map((category) => (
              <CategoryItem
                onClick={() => {
                  navigate(`/categories/${category.name}`);
                }}
                category={category}
                key={category.id}
              ></CategoryItem>
            ))}
        </div>
      </div>
    </>
  );
}

export default CategorySelectionPage;
