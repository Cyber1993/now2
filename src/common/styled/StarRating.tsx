function StarRating({ rating }:{rating:number}) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }

  return <div>{stars}</div>;
}

export default StarRating;
