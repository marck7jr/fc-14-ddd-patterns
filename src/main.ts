import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

// Customer Aggregate
let customer = new Customer("123", "Lucimarck J S Dias");
const address = new Address("Rua Um", 123, "123456-789", "Jangada");
customer.Address = address;
customer.activate();

// Order Aggregate
const item1 = new OrderItem("1", "Item 1", 10, "1", 1);
const item2 = new OrderItem("2", "Item 2", 20, "2", 2);
const order = new Order("1", "123", [item1, item2]);