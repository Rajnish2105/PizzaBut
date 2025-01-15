import React from "react";
import PizzaItem from "./PizzaItem";

interface Item {
  _id: string;  // Changed from id: number
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  type: 'base' | 'sauce' | 'cheese' | 'veggie';
}

interface PizzaSectionProps {
  title: string;
  items: Item[];
  selectedItems: string[];  // Changed from number[] to string[]
  onSelect: (id: string) => void;  // Changed parameter type to string
  multiSelect?: boolean;
}

const PizzaSection: React.FC<PizzaSectionProps> = ({
  title,
  items,
  selectedItems,
  onSelect,
  multiSelect = false,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <PizzaItem
            key={item._id}
            _id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            isSelected={selectedItems.includes(item._id)}
            onSelect={() => onSelect(item._id)}
            type={multiSelect ? "checkbox" : "radio"}
          />
        ))}
      </div>
    </section>
  );
};

export default PizzaSection;
