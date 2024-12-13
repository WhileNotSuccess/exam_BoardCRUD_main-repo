import { Post } from "../../post/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class Category {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Post, post => post.category)
    posts: Post[];
}
