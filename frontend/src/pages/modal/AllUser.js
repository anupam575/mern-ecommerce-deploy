import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Productmodal.css';

const ProductModal = () => {
  const [open, setOpen] = useState(false);

  const productItems = [
  { name: "Admin User Panel  ", link: "/admin/admin-panel" },
 
  // आगे और items भी add कर सकते हैं
];

  return (
    <li className="product-modal">
      <div onClick={() => setOpen(!open)} className="create-toggle">
        All user {open ? "▲" : "▼"}
      </div>

      {open && (
        <ul className="create-submenu">
          {productItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive ? "create-link active" : "create-link"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ProductModal;
