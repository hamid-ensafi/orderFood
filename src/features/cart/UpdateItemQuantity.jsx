import React from 'react'
import Button from '../../ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseItem, getCurrentQuantityById, increaseItem } from './sliceCart'

function UpdateItemQuantity({ id }) {
    const dispatch = useDispatch()
    const QuantityItem = useSelector(getCurrentQuantityById(id))
   
    return (
        <div className='flex gap-2'>
            <Button onClick={() => dispatch(increaseItem(id))} type='rounded'>+</Button>
             <p>{QuantityItem}</p>
            <Button onClick={() => dispatch(decreaseItem(id))} type='rounded'>-</Button>
        </div>
    )
}

export default UpdateItemQuantity