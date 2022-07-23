import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit test", () => {

    it("should get total of all orders", () => {

        // Arrange
        const orderItem1 = new OrderItem("1", "OrderItem 1", 100, "1", 1);
        const orderItem2 = new OrderItem("2", "OrderItem 2", 200, "1", 2);

        const order1 = new Order("1", "1", [orderItem1]);
        const order2 = new Order("2", "2", [orderItem2]);

        // Act
        const total = OrderService.total([order1, order2]);

        // Assert
        expect(total).toBe(500);

    });

});