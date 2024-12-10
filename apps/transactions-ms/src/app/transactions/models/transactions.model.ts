import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ 
    tableName: 'TRANSACTION',
})
export class Transaction extends Model {

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
        field: 'TRANSACTION_DATE',
    })
    transactionDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ENTREPRENEUR_ID',
    })
    entrepreneurId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'STATE',
    })
    state: string;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'PRICE',
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
