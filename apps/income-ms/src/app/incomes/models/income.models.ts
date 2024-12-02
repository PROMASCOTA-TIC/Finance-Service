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
    income_date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ENTREPRENEUR_ID',
    })
    entrepreneur_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PRODUCT_ID',
    })
    product_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PRODUCT_CATEGORY',
    })
    product_category: string;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'PRICE',
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
