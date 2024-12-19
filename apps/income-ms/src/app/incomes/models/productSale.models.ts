import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({ tableName: 'PRODUCT_SALE' })
export class ProductSale extends Model {

    @Column({
        type: DataType.STRING, 
        primaryKey: true,
        unique: true,
        field: 'ID',
    })
    id: string;  

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ENTREPRENEUR_ID',
    })
    entrepreneurId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PRODUCT_ID',
    })
    productId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PRODUCT_CATEGORY',
    })
    productCategory: string;

    @Column({
        type: DataType.DECIMAL(10,2),
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
