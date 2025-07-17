import { useState, useEffect } from 'react';
import './RestaurantSpinner.css';

const foodEmojis = ['🍕', '🍔', '🍟', '🌮', '🍣', '🍜', '🍩', '🥗', '🥟', '🍙', '🍰', '🧁'];

export default function RestaurantSpinner() {
  const [food, setFood] = useState('🍜');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomFood = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
      setFood(randomFood);
    }, 500); // Change emoji every 0.5 seconds

    return () => clearInterval(interval); // Cleanup when unmounted
  }, []);

  return (
    <div className="spinner-wrapper">
      <div className="food-spinner">{food}</div>
      <p className="spinner-text">Loading deliciousness...</p>
    </div>
  );
}
