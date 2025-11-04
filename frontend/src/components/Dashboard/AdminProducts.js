import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
// import "./toggle.css"; // ✅ CSS import

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, productId: null, status: null });

  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.products);
      setFiltered(data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const result = products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term) ||
        (p.stock <= 5 && term === "low stock")
    );
    setFiltered(result);
    setCurrentPage(0);
  };

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayedProducts = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const openConfirm = (id, status) => {
    setConfirmDialog({ open: true, productId: id, status });
  };

  const handleToggle = async () => {
    const { productId, status } = confirmDialog;
    try {
      const { data } = await axios.patch(`/api/products/${productId}/active`, { isActive: status });
      setProducts(products.map(p => p._id === productId ? { ...p, isActive: status } : p));
      setFiltered(filtered.map(p => p._id === productId ? { ...p, isActive: status } : p));
      alert(data.message);
      setConfirmDialog({ open: false, productId: null, status: null });
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <div className="container">
      <h1 className="title">Admin Products Panel</h1>

      <input
        type="text"
        placeholder="Search by name / category / low stock"
        onChange={handleSearch}
        className="search-input"
      />

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category?.name || "N/A"}</td>
              <td className={product.stock <= 5 ? "low-stock" : ""}>{product.stock}</td>
              <td>${product.price}</td>
              <td>
                {product.isActive ? <CheckCircle className="active-icon" /> : <Cancel className="inactive-icon" />}
              </td>
              <td>
                <Button
                  variant="contained"
                  color={product.isActive ? "error" : "success"}
                  onClick={() => openConfirm(product._id, !product.isActive)}
                >
                  {product.isActive ? "Make Inactive" : "Make Active"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-wrapper">
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          pageClassName="page-item"
          activeClassName="active-page"
          previousClassName="page-item"
          nextClassName="page-item"
        />
      </div>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>Are you sure you want to {confirmDialog.status ? "Activate" : "Deactivate"} this product?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleToggle}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
