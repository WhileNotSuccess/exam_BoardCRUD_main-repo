import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:number
}