import Card from '../ui/Card';
import './CardGrid.css';
import '../../styles/sections.css'
import { useAppSelector } from '../../app/hooks';

function CardGrid() {
const { user } = useAppSelector((state) => state?.auth);

console.log("user in card:", user);

  return (
    <div className="card-grid">
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card/>
      <Card />
      <Card />
    </div>
  );
}

export default CardGrid;
