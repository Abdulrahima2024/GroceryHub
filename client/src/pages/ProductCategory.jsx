import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories } from '../assets/assets'

const ProductCategory = () => {
  const { products } = useAppContext()
  const { category } = useParams()

  // Find matching category info
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  )

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    if (typeof product.category === "string") {
      return product.category.toLowerCase() === category
    }
    if (product.category?.category) {
      return product.category.category.toLowerCase() === category
    }
    return false
  })

  return (
    <div className="mt-16 px-4 md:px-8">
      {/* Category Heading */}
      {searchCategory && (
        <div className="flex flex-col items-start mb-8">
          <h2 className="text-2xl font-semibold uppercase tracking-wide">
            {searchCategory.text}
          </h2>
          <div className="mt-2 w-24 h-1 bg-primary rounded-full"></div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
          lg:grid-cols-5 gap-3 md:gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductCategory
