import './Card.css';

function Card() {
  return (
    <div className="card">
      <div className="card-image">img</div>
      <h3 className="card-title">Title</h3>
      <p className="card-desc">Description</p>
      <button>View</button>
    </div>
  );
}

export default Card;
