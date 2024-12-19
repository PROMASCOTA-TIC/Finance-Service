import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'TAXES',
    timestamps: true
})
export class Tax extends Model{

    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        field: 'ID',
    })
    id: string;

    @Column({
        type: DataType.DATE,  
        allowNull: false,
        field: 'TAXES_DATE',
    })
    taxesDate: Date

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'TOTAL_COMMISSIONS',
    })
    totalCommissions: number

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'IVA_CALCULATED',
    })
    ivaCalculated: number

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'NET_PROFIT',
    })
    netProfit: number

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
