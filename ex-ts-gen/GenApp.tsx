import React from "react";
import IEntity, { Payment, Product, User } from "./extra";

interface IEntityProps {
    entity: IEntity;
}

export const EntityDisplay: React.FC<IEntityProps> = ({ entity }) => {
    console.log(entity);
    return (
        <div>
            <h2>Entity Details</h2>
            <p>{entity.getInfo()}</p>
            {/* Render additional fields based on entity type */}
            {entity instanceof User && (
                <div>
                    <p>Name: {entity.name}</p>
                    <p>Phone: {entity.phoneNumber}</p>
                </div>
            )}
            {entity instanceof Product && (
                <div>
                    <p>Product Name: {entity.name}</p>
                    <p>Total Price: ${entity.totalPrice}</p>
                </div>
            )}
            {entity instanceof Payment && (
                <div>
                    <p>Note: {entity.note}</p>
                    <p>Amount: ${entity.amount}</p>
                </div>
            )}
        </div>
    );
};