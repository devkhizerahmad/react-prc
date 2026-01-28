import Card from '../ui/Card';
import './CardGrid.css';
import '../../styles/sections.css'

function CardGrid() {
  return (
    <div className="card-grid">
      <Card title="Card 1" description="This is card 1" />
      <Card title="Card 2" description="This is card 2" />
      <Card title="Card 3" description="This is card 3" />
      <Card title="Card 4" description="This is card 4" />
      <Card title="Card 5" description="This is card 5" />
      <Card title="Card 6" description/>
      <Card title="Card 7" description="This is card 7" />
      <Card title="Card 8" description="This is card 8" />
      <Card title="Card 9" description="This is card 9" />
      <Card title="Card 10" />
      <Card title="Card 11" />
      <Card title="Card 12" />
    </div>
  );
}

export default CardGrid;
