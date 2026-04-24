import { Product } from '../App';

type ContentAreaProps = {
  itemList: Product[]
  addToBasket: (product: Product) => void
}

export const ProductList = (props: ContentAreaProps) => {
  return (
    <div id="productList">
      {props.itemList.map((item) => {
        return (
          <div key={item.name} className="product">	
            <div className="product-top-bar">
              <h2>{item.name}</h2>
              <p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
            </div>
            <img src={"./src/Assets/Product_Images/" + item.image_link} alt={item.name}></img>
            
            {/* ===== 5.3 Conditional button rendering ===== */}
            <button 
              value={item.id} 
              disabled={item.quantity === 0} 
              onClick={() => props.addToBasket(item)}
            >
              {item.quantity === 0 ? 'Out of stock' : 'Add to basket'}
            </button>
          </div>
        )
      })}
    </div>
  )
}