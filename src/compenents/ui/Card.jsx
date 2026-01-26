import './Card.css';

function Card() {
  return (
    <div className="card">
      
      <div className="card-image">
        Image
      </div>

      <div className="card-body">
        <h3 className="card-title">Card Title</h3>
        <p className="card-desc">
          Ye thori si description hai jo card ka purpose explain karti hai.
        </p>
      </div>

      <div className="card-footer">
        <button className="card-btn">View</button>
      </div>

    </div>
  );
}

export default Card;
