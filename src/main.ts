import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

// Customer Aggregate
let customer = new Customer("123", "Lucimarck J S Dias");
const address = new Address("Rua Um", 123, "123456-789", "Jangada");
customer.Address = address;
customer.activate();

// Order Aggregate
const item1 = new OrderItem("1", "Item 1", 10);
const item2 = new OrderItem("2", "Item 2", 20);
const order = new Order("1", "123", [item1, item2]);