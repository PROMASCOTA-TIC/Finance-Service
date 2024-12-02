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
    
    @Column({
        type: DataType.DATE,  
        allowNull: false,
        field: 'CREATEDAT',
    })
    createdAt: Date;

    @Column({
        type:  DataType.DATE,   
        allowNull: true,
        field: 'UPDATEDAT',
    })
    updatedAt?: Date;

    @Column({
        type:  DataType.DATE, 
        allowNull: true,
        field: 'DELETEDAT',
    })
    deletedAt?: Date;
}
