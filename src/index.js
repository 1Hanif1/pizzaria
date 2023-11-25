import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import "./index.css"

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];


function App(){
  return(
    <div className="container">
    <Header />
    <Menu />
    <Footer />
    </div>
  )
}

function Header(){
  return <header className="header">
    <h1>Hanif's Pizzaria</h1>
  </header>
}

function Menu(){

  const numOfPizzas = pizzaData.length;

  return <main className="menu">
  <h2>Our menu</h2>

  {
    numOfPizzas > 0 ?
    <>
    <p>Authentic Italian Cuisine. 6 creative dishes to choose from. All from  our stone oven, all organic, all delicious</p>
  <ul className="pizzas">
  {
    pizzaData.map(pizza => <Pizza data={pizza} key={pizza.name}/>)
  }
  </ul>
    </> : <p> We are still working on our menu. Please come back again</p>
  }

  </main>
}

function Pizza({data: pizza}){
  return <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`} key={pizza.name}>
  <img src={pizza.photoName} alt="pizza" />
  <div>
    <h3>{pizza.name}</h3>
    <p>{pizza.ingredients}</p>
    {
      pizza.soldOut ? <span>SOLD OUT</span> : <span>Price: {pizza.price}</span>
    }
  </div>
  </li>
}

function PizzaListItem({name, image, price, quantity, cart, updateCart}){
  
  const decreaseItem = (args) => {  
    const [pizzaName] = args;
    let updatedCart = [...cart];
    const pizzaIndex = updatedCart.findIndex(pizza => pizza.name === pizzaName);
    updatedCart[pizzaIndex].quantity -= 1;

    if(updatedCart[pizzaIndex].quantity <= 0) updatedCart.splice(pizzaIndex, 1);
    updateCart(updatedCart);
  }

  const increaseItem = (args) => {
    const [pizzaName] = args;
    let updatedCart = [...cart];
    const pizzaIndex = updatedCart.findIndex(pizza => pizza.name === pizzaName);
    updatedCart[pizzaIndex].quantity += 1;
    updateCart(updatedCart);
  }

  return(
    <tr className="pizzaListItem">
    <td className="pizzaListItem__name">
      <img src={image} alt="Pizza Salamino"/>
      {name}
    </td>
    <td className="pizzaListItem__price">{price}</td>
    <td className="pizzaListItem__totalprice">{price * quantity}</td>
    <td className="pizzaListItem__quantity">
      <span className="pizzaListItem__quantity--negative" onClick={decreaseItem.bind(this, [name])}>-</span>
      <span className="pizzaListItem__quantity--number">{quantity}</span>
      <span className="pizzaListItem__quantity--positive" onClick={increaseItem.bind(this, [name])}>+</span>
    </td>
  </tr>
  )
}

function OrderForm({closeFormFunction}){
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); 

  useEffect(() => calculateTotalPrice(cart), [cart]);

  const calculateTotalPrice = (cart) => {
    let price = 0;
    cart.forEach(pizza => price += pizza.price * pizza.quantity);
    setTotalPrice(price);
  } 



  function addToCart(){
    const selectInput = document.querySelector(".orderform__pizzas > select")
    const selectedPizza = selectInput.options[selectInput.selectedIndex].value;

    // check if food already exists in the cart
    let index = cart.findIndex(pizza => pizza.name === selectedPizza);
    
    // If element already exists, update the quantity by 1
    if(index !== -1){
      const updatedCart = cart.map((pizza, idx) => {
        if (idx === index) {
          return {
            ...pizza,
            quantity: pizza.quantity + 1,
          };
        }
        return pizza;
      });

      setCart(updatedCart);
    } else {
    
    // Add The Element from drop down to cart
    const pizza = pizzaData.find(pizza => pizza.name === selectedPizza);
    pizza.quantity = 1;
    setCart(cart => [...cart, pizza])
    }
  }

  // Function
    // Pass down the function, along with cart, to the component
    // Component does changes to the cart items
      // the updated cart is then passed as argument to the function
      // The function then handles the state of the cart in the parent component

  // The problem with the previous code seems to be with component update. 
  // I Will need to see how React re renders components

  function updateCartFunction(updatedCart){
    setCart(updatedCart);
  }


  return <>
  <div className="orderFormModal" onClick={closeFormFunction}></div>
  <div className="orderform">
    <h1>Please Enter Your Details 🤳</h1>
    <div className="orderform__userdetails">
      <span>Name</span>
      <input type="text" placeholder="Enter you name"/>
      <span>Contact</span>
      <input type="number" placeholder="Enter you phone number"/>
      <span>Address</span>
      <input type="text" placeholder="Enter your address"/>
    </div>
    <div className="orderform__pizzas">
      <h2>Add the pizzas you want 🍕</h2>
      <select>
        {
          pizzaData.map(pizza => <option value={pizza.name} key={pizza.name}>{pizza.name}</option>)
        }
      </select>
      <button onClick={addToCart}>ADD</button>
    </div>
    <div className="orderform__pizzalist">
      <div className="orderform__pizzalist--container">
      <table>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Total</th>
          <th>Quantity</th>
        </tr>
        {
          cart.map(pizza => <PizzaListItem 
              name={pizza.name} 
              image={pizza.photoName} 
              price={pizza.price} 
              quantity={pizza.quantity}
              cart={cart}
              updateCart={updateCartFunction}/>
            )
        }
      </table>
      </div>
      <p className="orderform__pizzalist--total">Total: {totalPrice} <span>Order</span></p>
    </div>
  </div>
  </>
}

function Order({ closeHour }){
  const [showForm, setShowForm] = useState(false);
  const closeForm = () => setShowForm(false);
  return (
    <>
    {showForm && <OrderForm closeFormFunction={closeForm}/>}
    <div className="order">
    <p>
      We are open until {closeHour}:00. Come Visit us or Order online.
    </p>
    <button className="btn" onClick={() => setShowForm(true)}>Order</button>
  </div>
  </>
  )
}

function Footer(){
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 24;
  const isOpen = hour >= openHour && hour <= closeHour;

  return <footer className="footer"> 
    {
      isOpen ? <Order closeHour={closeHour}/> : (
        <p>Sorry we are closed. Please visit us between {openHour}:00 AM - {closeHour}:00 PM</p>
      )
    }
  </footer>
}



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)