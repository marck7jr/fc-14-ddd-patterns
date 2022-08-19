import OrderItem from "./order_item";

export default class Order {
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }
    
    get items(): OrderItem[] {
        return this._items;
    }

    changeCustomer(customerId: string) : void {
        if (customerId.length === 0){
            throw new Error("customerId is required");
        }
        
        this._customerId = customerId;
    }

    addItem(item: OrderItem) : void {
        if (item == undefined){
            throw new Error("item is required");
        }
        
        // Prevents duplicates items
        this._items = this._items.filter(x => x.id != item.id);
        this._items.push(item);
    }
    
    removeItem(item: OrderItem) : void {        
        this._items = this._items.filter(x => x != item);
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }

        if (this._customerId.length === 0) {
            throw new Error("CustomerId is required");
        }

        if (this._items.length === 0) {
            throw new Error("Items are required");
        }

        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error("Quantity must be greater than zero")
        }

        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.total(), 0);
    }
}