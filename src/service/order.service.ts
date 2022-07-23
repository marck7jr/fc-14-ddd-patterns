import Order from "../entity/order";

export default class OrderService {
    
    static total(orders: Order[]): number {
        return orders.reduce((acc, order) => acc + order.total(), 0);
    }
}