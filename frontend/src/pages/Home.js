import React from 'react';
import Middle from './Middle';
import CategorySection from './CategorySection';
import FeaturedProducts from './FeaturedProducts'; // 👈 Add this
import Footer from './footer'; // ✅ correct path

function Home() {
  return (
    <div>
      <Middle />
      <CategorySection />
      <FeaturedProducts /> {/* 👈 Add here */}
      <Footer />
    </div>
  );
}

export default Home;
