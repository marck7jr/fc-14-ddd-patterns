import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items are empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    // Arrange
    const item1 = new OrderItem("1", "Item 1", 10, "Product 1", 1);
    const item2 = new OrderItem("2", "Item 2", 20, "Product 2", 2);
    const order1 = new Order("1", "1", [item1]);
    const order2 = new Order("2", "2", [item1, item2]);

    // Act
    const total1 = order1.total();
    const total2 = order2.total();

    // Assert
    expect(total1).toBe(10);
    expect(total2).toBe(50);
  });

  it("should throw error if some item quantity is less or equal zero", () => {
    // Assert
    expect(() => {
      // Arrange
      const item1 = new OrderItem("1", "Item 1", 10, "Product 1", 1);
      const item2 = new OrderItem("2", "Item 2", 20, "Product 2", -1);
      const order1 = new Order("2", "2", [item1, item2]);

      // Act
      const total1 = order1.total();
    }).toThrowError("Quantity must be greater than zero");
  });
});
