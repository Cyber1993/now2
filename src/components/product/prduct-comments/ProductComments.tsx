import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import'././Style/ProductComments.css';
import Desh from '../../../assets/dashes.svg'
import '../product_detail/styles/Hlink.css'
import http_common from "../../../http_common";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ICategory } from "../../../entities/Category";
import { IProductDetail} from "../../../entities/Product";
import { IComment } from "../../../entities/Comment";
import { RootState } from "../../../store/store";
import StarRating from "../../../common/styled/StarRating";
import Like from '../../../assets/like.svg';
import Dislke from '../../../assets/dislike.svg';
import InCart from '../../../assets/inCart.svg';
import LikeF from '../../../assets/like-fill.svg';
import DislkeF from '../../../assets/dislike-fill.svg';
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import ProductPreview from "../../../common/styled/productPreview/ProductPreview";
import { ICartItem } from "../../../entities/Cart";
import { Checkbox, Label } from "flowbite-react";


function ProductComments() {
  const { id} = useParams();

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const history = useNavigate();
  const [product, setProduct] = useState<IProductDetail>();
  const [commentsByProduct, setCommentsByProduct] = useState<IComment[]>([]);
  const [isLike, setIsLike] = useState<boolean>();
  const [isDisLike, setIsDisLike] = useState<boolean>();

  const [category, setCategory] = useState<ICategory>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [mainButtonText, setMainButtonText] = useState("Від покупців товару");
  const [cart, setCart] = useState<ICartItem>();
  const [isCart,setIscart]=useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  
  const handleRatingClick = (selectedRating: number) => {
    setSelectedRating(selectedRating);
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {


        const productResp = await http_common.get(`api/Products/${id}`);
          setProduct(productResp.data);

        const cartResp = await http_common.get(`/api/Carts/getByUserId/${user?.id}`);
          setCart(cartResp.data);
        

        const commentsResp = await http_common.get(
          `/api/Comments/getByProductId/${productResp.data.id}`,
        );
        setCommentsByProduct(commentsResp.data);
        if (productResp.data?.categoryId) {
            const categoryResp = await http_common.get(
              `/api/Categories/${productResp.data.categoryId}`,
            );
            setCategory(categoryResp.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, user?.id]);



  const toggleExtraButtons = () => {
    setIsOpen(!isOpen);
  };


  const handleSortByDateClick = () => {
    console.log("Виконується сортування за датою");
    const sortedComments = [...commentsByProduct].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setCommentsByProduct(sortedComments);
    setMainButtonText("За датою");
  };

 

  const handleSortByMostUsefulClick = () => {
    console.log("Виконується сортування за найкорисніші");
    const sortedComments = [...commentsByProduct].sort((a, b) => {
      return a.rating - b.rating;
    });
    setCommentsByProduct(sortedComments);
    setMainButtonText("Найкорисніші");
  };

  const handleSortByMediaClick = () => {
    console.log("Виконується сортування за фото і відео");
    setMainButtonText("З фото і відео");
  };

  const buttonLikeClick = async () => {
    try {
      if (isLike === true) {
        await setIsLike(false);
      } else {
        await setIsLike(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };
  const buttonDisLikeClick = async () => {
    try {
      if (isDisLike === true) {
        await setIsDisLike(false);
      } else {
        await setIsDisLike(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const addCart = async () => {
    try {
      if (product?.id) {
        await http_common.post(
          `api/Carts/addProduct?cartId=${cart?.id}&productId=${product.id}`,
        );
        setIscart(true);
      } else {
        console.error(" ");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const buttonClickAddtoCart=async()=>{
    try {
      if (isCart === true) {
        await setIscart(false);
      } else {
        await addCart();
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const commentInput = document.getElementById('text') as HTMLTextAreaElement;
    const commentText = commentInput.value;  

    const fileInput = document.getElementById('files') as HTMLInputElement;
    const files = fileInput.files;
    
    const formData = new FormData();
    formData.append('text', commentText);
    formData.append('productId', String(product?.id || 0)); // Перетворення числа на рядок
    formData.append('userId', user?.id || '');
    formData.append('rating', String(selectedRating || 0)); // Перетворення числа на рядок

    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append(`images`, files[i]);
        } 
    }
  
    console.log(commentText);
    console.log(files);
    console.log(formData); // Вивід об'єкта formData у консоль

    try {
      await http_common.post("/api/Comments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
}

const [showAllComments, setShowAllComments] = useState(false);

  const buttonAllCommentsClick = () => {
    setShowAllComments(true);
  };

  console.log(handleSubmit);
  
  
  

  console.log(selectedRating);
  return (
    <><Header></Header>
    <div>
        <div>
          {isModalOpen && (
              <div className="modal">
                  <span className="close" onClick={closeModal}><span>Написати відгук</span>  &times;</span>
                  <div className="modal-content">
                    <div className="content" >
                    <p className="ratining">Оцініть товар</p>
                    <div className="ratingPr">  
                          <div className={`stars-5 ${selectedRating === 5 ? 'selected' : ''}`} onClick={() => setSelectedRating(5)}>
                            <div>
                              <svg width="43" height="41" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7769 1.82389C21.1185 1.0026 22.2819 1.00259 22.6235 1.82389L26.9203 12.1547C27.3524 13.1934 28.3292 13.9031 29.4506 13.993L40.6035 14.8871C41.4902 14.9582 41.8497 16.0647 41.1741 16.6434L32.6768 23.9223C31.8224 24.6541 31.4493 25.8025 31.7103 26.8967L34.3064 37.7801C34.5128 38.6453 33.5715 39.3292 32.8124 38.8655L23.264 33.0334C22.3039 32.447 21.0965 32.447 20.1364 33.0334L10.588 38.8655C9.82886 39.3292 8.8876 38.6453 9.09399 37.7801L11.6901 26.8967C11.9511 25.8025 11.578 24.6541 10.7236 23.9223L2.22625 16.6434C1.55071 16.0647 1.91024 14.9582 2.79689 14.8871L13.9498 13.993C15.0712 13.9031 16.048 13.1934 16.4801 12.1547L20.7769 1.82389Z" stroke="#9F9F9F" strokeOpacity="0.623529" strokeWidth="2"/></svg>
                              <div>Чудово</div>
                            </div>                            
                          </div>
                          <div className={`stars-4 ${selectedRating === 4 ? 'selected' : ''}`} onClick={() => handleRatingClick(4)}>
                          <div>
                          <svg width="43" height="41" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7769 1.82389C21.1185 1.0026 22.2819 1.00259 22.6235 1.82389L26.9203 12.1547C27.3524 13.1934 28.3292 13.9031 29.4506 13.993L40.6035 14.8871C41.4902 14.9582 41.8497 16.0647 41.1741 16.6434L32.6768 23.9223C31.8224 24.6541 31.4493 25.8025 31.7103 26.8967L34.3064 37.7801C34.5128 38.6453 33.5715 39.3292 32.8124 38.8655L23.264 33.0334C22.3039 32.447 21.0965 32.447 20.1364 33.0334L10.588 38.8655C9.82886 39.3292 8.8876 38.6453 9.09399 37.7801L11.6901 26.8967C11.9511 25.8025 11.578 24.6541 10.7236 23.9223L2.22625 16.6434C1.55071 16.0647 1.91024 14.9582 2.79689 14.8871L13.9498 13.993C15.0712 13.9031 16.048 13.1934 16.4801 12.1547L20.7769 1.82389Z" stroke="#9F9F9F" strokeOpacity="0.623529" strokeWidth="2"/></svg>
                              <div>Добре</div>
                            </div>                           
                          </div>
                          <div className={`stars-3 ${selectedRating === 3 ? 'selected' : ''}`} onClick={() => handleRatingClick(3)}>
                              <div>
                                <svg width="43" height="41" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7769 1.82389C21.1185 1.0026 22.2819 1.00259 22.6235 1.82389L26.9203 12.1547C27.3524 13.1934 28.3292 13.9031 29.4506 13.993L40.6035 14.8871C41.4902 14.9582 41.8497 16.0647 41.1741 16.6434L32.6768 23.9223C31.8224 24.6541 31.4493 25.8025 31.7103 26.8967L34.3064 37.7801C34.5128 38.6453 33.5715 39.3292 32.8124 38.8655L23.264 33.0334C22.3039 32.447 21.0965 32.447 20.1364 33.0334L10.588 38.8655C9.82886 39.3292 8.8876 38.6453 9.09399 37.7801L11.6901 26.8967C11.9511 25.8025 11.578 24.6541 10.7236 23.9223L2.22625 16.6434C1.55071 16.0647 1.91024 14.9582 2.79689 14.8871L13.9498 13.993C15.0712 13.9031 16.048 13.1934 16.4801 12.1547L20.7769 1.82389Z" stroke="#9F9F9F" strokeOpacity="0.623529" strokeWidth="2"/></svg>
                                <div>Нормально</div>
                              </div>                            
                          </div>
                          <div className={`stars-2 ${selectedRating === 2 ? 'selected' : ''}`} onClick={() => handleRatingClick(2)}>
                          <div>
                          <svg width="43" height="41" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7769 1.82389C21.1185 1.0026 22.2819 1.00259 22.6235 1.82389L26.9203 12.1547C27.3524 13.1934 28.3292 13.9031 29.4506 13.993L40.6035 14.8871C41.4902 14.9582 41.8497 16.0647 41.1741 16.6434L32.6768 23.9223C31.8224 24.6541 31.4493 25.8025 31.7103 26.8967L34.3064 37.7801C34.5128 38.6453 33.5715 39.3292 32.8124 38.8655L23.264 33.0334C22.3039 32.447 21.0965 32.447 20.1364 33.0334L10.588 38.8655C9.82886 39.3292 8.8876 38.6453 9.09399 37.7801L11.6901 26.8967C11.9511 25.8025 11.578 24.6541 10.7236 23.9223L2.22625 16.6434C1.55071 16.0647 1.91024 14.9582 2.79689 14.8871L13.9498 13.993C15.0712 13.9031 16.048 13.1934 16.4801 12.1547L20.7769 1.82389Z" stroke="#9F9F9F" strokeOpacity="0.623529" strokeWidth="2"/></svg>
                              <div>Так собі</div>
                            </div>                            
                          </div>
                          <div className={`stars-1 ${selectedRating === 1 ? 'selected' : ''}`} onClick={() => handleRatingClick(1)}>
                            <div>
                            <svg width="43" height="41" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.7769 1.82389C21.1185 1.0026 22.2819 1.00259 22.6235 1.82389L26.9203 12.1547C27.3524 13.1934 28.3292 13.9031 29.4506 13.993L40.6035 14.8871C41.4902 14.9582 41.8497 16.0647 41.1741 16.6434L32.6768 23.9223C31.8224 24.6541 31.4493 25.8025 31.7103 26.8967L34.3064 37.7801C34.5128 38.6453 33.5715 39.3292 32.8124 38.8655L23.264 33.0334C22.3039 32.447 21.0965 32.447 20.1364 33.0334L10.588 38.8655C9.82886 39.3292 8.8876 38.6453 9.09399 37.7801L11.6901 26.8967C11.9511 25.8025 11.578 24.6541 10.7236 23.9223L2.22625 16.6434C1.55071 16.0647 1.91024 14.9582 2.79689 14.8871L13.9498 13.993C15.0712 13.9031 16.048 13.1934 16.4801 12.1547L20.7769 1.82389Z" stroke="#9F9F9F" strokeOpacity="0.623529" strokeWidth="2"/></svg>
                            </div>
                            <div>Погано</div>
                          </div>
                    </div>
                    <p className="comm">Коментар</p>
                    <div className="textCom">
                      <textarea name="" id="text"></textarea>
                    </div>
                    <div className="addimg">
                      <p className="addphoto">Додайте фото</p>
                      <p className="desc">Перетягніть файли сюди чи натисніть на кнопку. Додавайте до 10 зображень у форматі .jpg, .gif, .png, розміром файлу до 5 МБ</p>
                        <div>
                          <input type="file" id="files" name="files" accept=".jpg, .gif, .png" multiple/>
                        </div>
                    </div>
                      <div className="notice">                                    
                      <Checkbox />
                      <Label >Повідомляти про відповіді по електронній пошті</Label>
                      </div>
                      <div className="buttonslt">
                        <button className="cancel" onClick={closeModal}>
                            Скасувати
                        </button>
                        <button className="submit" onClick={handleSubmit}>
                          Залишити відгук
                        </button>
                      </div>
                    </div>
                    
                  </div>
              </div>
            )}
        </div>
        <div className="conteinerL">
            <div className="ways">
              <span>
                <Link to="/">Головна/</Link>
              </span>
              {pathnames.map((name, index) => (
                <span key={index}>
                  {index > 0 && " / "}
                  <Link to={`/${pathnames.slice(0, index + 1).join("/")}`}>
                    {name}
                  </Link>
                </span>
              ))}
            </div>
            <div className="tabs">
              <span onClick={()=>{history(`/product/${product?.id}`)}}>Усе про товар</span>
              <span>Характеристики</span>
              <span className="curent">Відгуки</span>
              <span>Питання</span>
              <span>Відео</span>
              <span>Фото</span>
              <span>Купують разом</span>
            </div>
          </div>
        <div className="containerProductAndCommnets">

          <div className="comments-section">
            <div className="conteinerHeader">
              <div className="headTxt">Відгуки покупців про {category?.name} {product?.title}</div>
              <div className="kodproduct">Код: {product?.id}</div>
            </div>
          
              <div className="comment">
                <div className="conteierButt">
                  <div className={`sortCommnet ${isOpen ? 'open' : ''}`}>
                      <button className="headButton" onClick={toggleExtraButtons}>
                        <span>{mainButtonText}</span>
                        <img src={Desh} alt="" />
                      </button>
                      {isOpen && (
                        <div className="conteinerdrop">
                          <button onClick={handleSortByDateClick}>За датою</button>
                          <button onClick={handleSortByMostUsefulClick}>Найкорисніші</button>
                          <button onClick={handleSortByMediaClick}>З фото і відео</button>
                          
                        </div>
                      )}
                  </div>
                  <div className="writeComment" onClick={openModal}>
                    <span> Написати відгук</span>
                  </div>
                </div>
                <div className="coms">
                {showAllComments
                  ? commentsByProduct.map((comment) => (
                    <div className="com" key={comment.id}>
                    <div className="contratingADate">
                      <div className="rating">
                        <StarRating rating={comment.rating} />
                      </div>
                      <div className="date">
                        {comment.user && comment.user.dateCreated && (
                          <span>
                            {new Intl.DateTimeFormat("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(comment.user.dateCreated))}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text_com">{comment.text}</div>
                    <div className="user">
                      <div className="image">
                        <img
                          src={`${http_common.getUri()}/Images/300_${comment.user.image}`}
                          alt="" />
                      </div>
                      <div className="conteinerlikes">
                        <div className="userName">{comment.user.firstName}</div>
                        <div className="reactiondiv">
                          <div onClick={buttonLikeClick}>
                              {isLike ? (
                                <img src={LikeF} alt="" />
                              ) : (
                                <img src={Like} alt="" />
                              )}
                          </div>
                          <div onClick={buttonDisLikeClick}>
                              {isDisLike ? (
                                <img src={DislkeF} alt="" />
                              ) : (
                                <img src={Dislke} alt="" />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            ))
          : commentsByProduct.slice(0, 6).map((comment) => (
                  <div className="com" key={comment.id}>
                      <div className="contratingADate">
                        <div className="rating">
                          <StarRating rating={comment.rating} />
                        </div>
                        <div className="date">
                          {comment.user && comment.user.dateCreated && (
                            <span>
                              {new Intl.DateTimeFormat("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }).format(new Date(comment.user.dateCreated))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text_com">{comment.text}</div>
                      <div className="user">
                        <div className="image">
                          <img
                            src={`${http_common.getUri()}/Images/300_${comment.user.image}`}
                            alt="" />
                        </div>
                        <div className="conteinerlikes">
                          <div className="userName">{comment.user.firstName}</div>
                          <div className="reactiondiv">
                            <div onClick={buttonLikeClick}>
                                {isLike ? (
                                  <img src={LikeF} alt="" />
                                ) : (
                                  <img src={Like} alt="" />
                                )}
                            </div>
                            <div onClick={buttonDisLikeClick}>
                                {isDisLike ? (
                                  <img src={DislkeF} alt="" />
                                ) : (
                                  <img src={Dislke} alt="" />
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
            ))}
                </div>
                {!showAllComments && (
                      <div className="allComents">
                        <button onClick={buttonAllCommentsClick}>
                              Дивитися усі відгуки про товар
                         </button>
                          
                      </div>
                    )}
              </div>
                        
          </div>
          <div className="product-section">
            <div className="product-card">
                {product && (
                  <ProductPreview
                    productPreview={{
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: `${product.images[0].image}`,
                      discount: product.discount,
                      isFavorite: product.isFavorite,
                      category: product.category
                    }}
                  />
                )}
              <button className={`buyButt ${isCart ? 'isCart' : ''}`} onClick={buttonClickAddtoCart}>
              {isCart ? (
                <><img src={InCart} alt=""/><span>В кошику</span></>
                
                ) : (
                  <span>Купуй</span>
                )}
              </button>
            </div>
          </div>
        </div>
    </div>
    <Footer></Footer>
    </>
  );
  
  
}

export default ProductComments;
