import Footer from "../../footer/Footer.tsx";
import Header from "../../header/Header.tsx";
import "../about/AboutUsPage.css";

function AboutUsPage() {
  
  return (
    <>
      <Header></Header>

      <div className="about-main">
        <div className="about-page">
            <div className="about-header">
                About us
            </div>
            <div className="about-text">
                <p>
                    Small dreams and big plans
                </p>
                IMPULSE is one of the largest online retailers in the country. Since 2010, we have been fulfilling the small dreams and big plans of millions of people. You can find literally everything here.<br/>
                We sell at a fair price and provide a guarantee because we believe that online shopping should be as convenient and safe as possible. And every time someone clicks "Buy", we realize<br/> 
                that we are doing the right thing.
            </div>
            <div className="about-text">
                <p>
                    Our goal is to be useful
                </p>
                We believe that things exist to make life easier, more enjoyable, and kinder. Therefore, the search for the same thing should be quick, convenient and enjoyable. We don't just sell<br/> 
                 household appliances, electronics, jewelry, or wine. We help you find exactly what you need in one place and without unnecessary worries, so that you don't spend your life searching for<br/> 
                  it, but simply live happily. Impulse is a universal answer to any request, the beginning of the search and its final stop, a real assistant. We save our customers from unpleasant<br/> 
                   compromises, fulfill their desires, and allow them to dream big. Through smart search and honest service, we make our customers' lives a little better right now.
            </div>
            <div className="about-text">
                <p>
                    Happiness begins with simple things
                </p>
                And we help you find these things: we remind people in love how to surprise each other; we motivate sports people to never give up and progress faster; we give households<br/> 
                 the opportunity to create real comfort. We want you to know what you are looking for and be able to justify your choice. To do this, we shoot video reviews, write articles, and keep track of<br/> 
                  new products.
            </div>
            <div className="about-text">
                <p>
                    To make dreams come true easily
                </p>
                We are opening huge offline stores so that you can come in, hold and test the product you like. We want to have the best service in the world, so we train our employees not only on the<br/> 
                 technical side of the job, but also on customer service.
            </div>
            <div className="about-columns">
                <div className="about-column">
                    <p> 3.9 mln </p>
                    of goods available for purchase   
                </div>
                <div className="about-column">
                    <p> 789 mln </p>
                    users visited Impulse in 2019
                </div>
                <div className="about-column">
                    <p> 81% </p>
                    of our customers return
                </div>
                <div className="about-column">
                    <p> 2.5 mln </p>
                    visitors per day
                </div>
            </div>
            <div className="about-text">
                <p>
                 Convenient delivery
                </p>
                And of course, any product can be ordered with delivery. We deliver in Kyiv within one day and in Ukraine the next day. All without prepayment, and if necessary, on credit. You can pay in cash<br/> 
                 or by bank transfer - whatever you prefer.
            </div>
            <div className="about-text">
                <p>
                 Read more
                </p>
                We want our customers to never have to wonder where to find something they need. That is why we are now not only the largest online retailer, but also a platform for sellers. Someone<br/> 
                 will start their first business with us (or expand an existing one), and someone will bring products that are not yet available in Ukraine. This is beneficial for everyone: buyers, sellers and<br/> 
                  even us, because in this way we will help more people become a little happier.
            </div>
        </div>
      </div>

        <footer>
          <Footer></Footer>
        </footer>
    </>
  );
}

export default AboutUsPage;
