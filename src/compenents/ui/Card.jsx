import "./Card.css";
import perfumeImg from "../../assets/perfume.jpg";

function Card() {
  return (
    <div className="card">
      <div className="card-image">
        <img src={perfumeImg} alt="Perfume" />
      </div>

      <div className="card-body">
        <h3 className="card-title">
          Premium perfume for men.
        </h3>

        <p className="card-desc">
          This is a sample description for the perfume card. It is long enough
          to test the text clamping behavior within the card component.
          The description provides details about the perfume, including its
          long-lasting quality, good fragrance, and top-notch
          craftsmanship.
        </p>
      </div>

      <div className="card-footer">
        <button className="card-btn">View</button>
      </div>
    </div>
  );
}

export default Card;
