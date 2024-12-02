import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table
export class Expense extends Model {
    
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    category: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expenseDate: Date;
    
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    price: number;
    
    @CreatedAt
    createdAt: Date;
    
    @UpdatedAt
    updatedAt: Date;
    
    @DeletedAt
    deletedAt: Date;
}
