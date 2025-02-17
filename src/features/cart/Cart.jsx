import { Link } from 'react-router-dom';
import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import CartItem from './CartItem';
import { clearCart, getCart, getUserName } from './sliceCart';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from './EmptyCart';

function Cart() {
  const cart = useSelector(getCart)
  const username = useSelector(getUserName)
  const dispatch = useDispatch()
  function handleClearCart() {
    dispatch(clearCart())
  }
  if (cart.length <= 0) return <EmptyCart></EmptyCart>
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">

        {cart.map((item) => <CartItem item={item} key={item.pizzaId} />)}
        
      </ul>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Order pizzas
        </Button>

        <Button onClick={handleClearCart} type="secondary">Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
