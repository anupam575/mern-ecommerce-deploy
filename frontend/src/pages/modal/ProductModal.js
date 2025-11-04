import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Productmodal.css';

const ProductModal = () => {
  const [open, setOpen] = useState(false);

  const productItems = [
{ name: "All Product", link: "/admin/admin-products" },

     { name: "ALl Product", link: "/admin/create-product" },
  { name: "Create Category", link: "/admin/create-category" },
  { name: "All Category", link: "/admin/category" },
 
];

  return (
    <li className="product-modal">
      <div onClick={() => setOpen(!open)} className="create-toggle">
        Create product {open ? "▲" : "▼"}
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
