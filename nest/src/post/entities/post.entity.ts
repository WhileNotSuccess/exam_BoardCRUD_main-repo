import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Post{ //Post 테이블
    @PrimaryGeneratedColumn()
    id:string;
    @Column()
    title:string;
    @Column()
    content:string;
    @Column()
    author:string;
    @Column()
    category:string;
    @Column()
    created_at:string;
    @Column()
    updated_at:string;

}