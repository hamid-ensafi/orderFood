import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalPrice } from '../cart/sliceCart';
import EmptyCart from '../cart/EmptyCart';
import store from '../../../store'
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';



// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const userName = useSelector((state) => state.user.username)
  const formErrors = useActionData();
  const [withPriority, setWithPriority] = useState(false);
  const totalCartPrice = useSelector(getTotalPrice)
  const dispatch = useDispatch()
  const priorityPrice = withPriority ? totalCartPrice * 20 / 100 : 0

  // const getAddress = useSelector(state => state.user.address)
  // const getPosition = useSelector(state => state.user.position)
  const { username, status: addressStatus, address, position, error } = useSelector(state => state.user)
  const totalPrice = totalCartPrice + priorityPrice
  const cart = useSelector(getCart)
  const isLoadingAddress = addressStatus === 'loading'
  if (!cart.length) return <EmptyCart></EmptyCart>
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input defaultValue={userName} className="input grow" type="text" name="customer" required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow relative">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {
            !position.latitude
             && 
            !position.longitude 
            && 
            <span className='absolute right-1 top-1'> <Button disabled={isLoadingAddress} onClick={(e) => {
              e.preventDefault()
              dispatch(fetchAddress())
            }} type='small'>get Address</Button> </span>}

            {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name='position' value={position.longitude ?`${position.latitude},${position.longitude}`:''}/>
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting ? 'Placing order....' : `Order now ${formatCurrency(totalPrice)} `}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect

  const newOrder = await createOrder(order);
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`);

}

export default CreateOrder;
