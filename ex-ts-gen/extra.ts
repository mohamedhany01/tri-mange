export default interface IEntity {
    id: string;
    getInfo(): string;
}


export class User implements IEntity {
    id: string;
    name: string;
    phoneNumber: string;

    constructor(id: string, name: string, phoneNumber: string) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    getInfo(): string {
        return `User: ${this.name}, Phone: ${this.phoneNumber}`;
    }
}

// Product entity
export class Product implements IEntity {
    id: string;
    name: string;
    totalPrice: number;

    constructor(id: string, name: string, totalPrice: number) {
        this.id = id;
        this.name = name;
        this.totalPrice = totalPrice;
    }

    getInfo(): string {
        return `Product: ${this.name}, Price: ${this.totalPrice}`;
    }
}

// Payment entity
export class Payment implements IEntity {
    id: string;
    note: string;
    amount: number;

    constructor(id: string, note: string, amount: number) {
        this.id = id;
        this.note = note;
        this.amount = amount;
    }

    getInfo(): string {
        return `Payment: ${this.note}, Amount: ${this.amount}`;
    }
}