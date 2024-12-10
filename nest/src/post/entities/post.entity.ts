import { Category } from "src/category/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];
}