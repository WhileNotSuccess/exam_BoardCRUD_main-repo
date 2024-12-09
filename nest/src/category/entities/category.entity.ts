import { Post } from "src/post/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class Category{
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    @OneToMany(()=>Post,post=>post.category)
    name:string;
}