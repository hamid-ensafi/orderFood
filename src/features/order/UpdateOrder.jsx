import React from 'react'
import Button from '../../ui/Button'
import { useFetcher } from 'react-router-dom'
import { updateOrder } from '../../services/apiRestaurant'

function UpdateOrder({ order }) {
    const fetcher = useFetcher()
    return (
        <fetcher.Form method='PATCH'>
            <Button type={'primary'}>Make priority</Button>
        </fetcher.Form>
    )
}

export default UpdateOrder
{/* <p className="font-bold">
To pay on delivery: {formatCurrency(order.orderPrice + order.priorityPrice)}
</p> */}

export async function action({request,params}){
    const data={priority:true}
    await updateOrder(params.orderId,data)
    return null 
}