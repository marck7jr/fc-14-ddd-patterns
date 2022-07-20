import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Lucimarck");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        // Arrage
        const customer = new Customer("123", "Lucimarck");
        
        // Act
        customer.changeName("Luci");

        // Assert
        expect(customer.name).toBe("Luci");
    });

    it("should activate customer", () => {
        // Arrage
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Stret 1", 123, "123456-789", "Jangada");
        customer.Address = address;

        // Act
        customer.activate();

        // Assert
        expect(customer.isActive()).toBe(true);
    });

    it("should throw error when address is undefined when you active a customer", () => {

        expect(() => {
            const customer = new Customer("1", "Customer 1");    
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");    
        
    });

    it("should deactivate customer", () => {
        // Arrage
        const customer = new Customer("1", "Customer 1");

        // Act
        customer.deactivate();

        // Assert
        expect(customer.isActive()).toBe(false);
    });
});