import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table(
    {
        tableName: 'EXPENSES',
        timestamps: true,
    }
)
export class Expense extends Model {
    
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        field: 'ID',
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'CATEGORY',
    })
    category: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'DESCRIPTION',
    })
    description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'EXPENSE_DATE',
    })
    expenseDate: Date;
    
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        field: 'PRICE',
    })
    price: number;
    
    @Column({
        type: DataType.DATE,  
        allowNull: false,
        field: 'CREATED_AT',
    })
    createdAt: Date;

    @Column({
        type:  DataType.DATE,   
        allowNull: true,
        field: 'UPDATED_AT',
    })
    updatedAt?: Date;

    @Column({
        type:  DataType.DATE, 
        allowNull: true,
        field: 'DELETED_AT',
    })
    deletedAt?: Date;
}
