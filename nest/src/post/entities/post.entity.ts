import { Category } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Post{ //Post 테이블
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    title:string;
    @Column()
    content:string;
    @Column()
    author:string;
    @Column()
    @ManyToOne(()=>Category,category=>category.name)
    category:string;
    @CreateDateColumn()
    created_at:string;
    @UpdateDateColumn()
    updated_at:string;
}