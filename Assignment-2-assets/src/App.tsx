import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

export type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

export type BasketItem = Product & {
  basketQuantity: number
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  
  // New States for Sorting, Stock filtering, and the Basket
  const [sortOption, setSortOption] = useState<string>('AtoZ');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  // ===== Hooks =====
  // 5.2 - Added dependencies so the products update when the sorting or inStock states change
  useEffect(() => updateSearchedProducts(), [searchTerm, sortOption, inStockOnly]);

  // ===== Basket management =====
  function showBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

  // 5.3 - Adding item to basket or incrementing quantity
  function addToBasket(product: Product) {
    setBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.id === product.id);
      if (existingItem) {
        return prevBasket.map(item => 
          item.id === product.id ? { ...item, basketQuantity: item.basketQuantity + 1 } : item
        );
      } else {
        return [...prevBasket, { ...product, basketQuantity: 1 }];
      }
    });
  }

  // 5.4 - Removing item from basket or decrementing quantity
  function removeFromBasket(productId: number) {
    setBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.id === productId);
      if (existingItem && existingItem.basketQuantity > 1) {
        return prevBasket.map(item => 
          item.id === productId ? { ...item, basketQuantity: item.basketQuantity - 1 } : item
        );
      } else {
        return prevBasket.filter(item => item.id !== productId);
      }
    });
  }

  // ===== Search, Filter, and Sort =====
  function updateSearchedProducts(){
    let holderList: Product[] = itemList;

    // 1. Search text filter
    let filtered = holderList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. In Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.quantity > 0);
    }

    // 3. Sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'AtoZ': return a.name.localeCompare(b.name);
        case 'ZtoA': return b.name.localeCompare(a.name);
        case '£LtoH': return a.price - b.price;
        case '£HtoL': return b.price - a.price;
        case '*LtoH': return a.rating - b.rating;
        case '*HtoL': return b.rating - a.rating;
        default: return 0;
      }
    });

    setSearchedProducts(filtered);
  }

  // ===== 5.1 Results Indicator Calculation =====
  let indicatorText = "";
  if (searchTerm === '') {
    indicatorText = searchedProducts.length === 1 ? '1 Product' : `${searchedProducts.length} Products`;
  } else {
    if (searchedProducts.length === 0) {
      indicatorText = 'No search results found';
    } else if (searchedProducts.length === 1) {
      indicatorText = '1 Result';
    } else {
      indicatorText = `${searchedProducts.length} Results`;
    }
  }

  // ===== 5.4 Calculate total cost =====
  const totalCost = basket.reduce((sum, item) => sum + (item.price * item.basketQuantity), 0);

  return (
    <div id="container"> 
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png" alt="Logo"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png" alt="Basket"></img>
        </div>
        
        {/* ===== 5.4 Visualising the basket ===== */}
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          
          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basket.map(item => (
                <div key={item.name} className="shopping-row">
                  <div className="shopping-information">
                    <p>{item.name} (£{item.price.toFixed(2)}) - {item.basketQuantity}</p>
                  </div>
                  <button onClick={() => removeFromBasket(item.id)}>Remove</button>
                </div>
              ))}
              <p>Total: £{totalCost.toFixed(2)}</p>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)}></input>
        <div id="control-area">
          
          {/* 5.2 Hooked up the select and checkbox to our state */}
          <select onChange={e => setSortOption(e.target.value)} value={sortOption}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" onChange={e => setInStockOnly(e.target.checked)} checked={inStockOnly}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      
      {/* 5.1 Rendering the indicator */}
      <p id="results-indicator">{indicatorText}</p>
      
      {/* Passing our add to basket function as a prop */}
      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
  )
}

export default App