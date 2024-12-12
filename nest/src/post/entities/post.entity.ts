import { Category } from "../../category/entities/category.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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
    category:string;

    @CreateDateColumn()
    createdAt:string;
    @UpdateDateColumn()
    updatedAt:string;
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];
}