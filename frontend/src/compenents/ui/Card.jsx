import "./Card.css";
import perfumeImg from "../../assets/perfume.jpg";
import { useAppSelector } from "../../app/hooks";

function Card() {
  const { user } = useAppSelector((state) => state?.auth);
  console.log("Card user: ",user )
  
  return (
    <div className="card">
      <div className="card-image">
        <img src={perfumeImg} alt="Perfume" />
      </div>

      <div className="card-body">
        <h3 className="card-title">
          Premium perfume for men: khjk{user.name}
        </h3>

        <p className="card-desc">
          {user}
        </p>
      </div>

      <div className="card-footer">
        <button className="card-btn">View</button>
      </div>
    </div>
  );
}

export default Card;
