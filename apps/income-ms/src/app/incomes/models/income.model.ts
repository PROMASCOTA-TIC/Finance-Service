import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({ tableName: 'INCOME' })
export class Income extends Model {

    @Column({
        type: DataType.STRING, 
        primaryKey: true,
        unique: true,
        field: 'ID',
    })
    id: string;  

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'INCOME_DATE',
    })
    incomeDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'USER_ID',
    })
    userId: number;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'AMOUNT',
    })
    amount: number;

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
