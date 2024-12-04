import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id : number

  @Column()
  postId : number
  
  @Column()
  author : string

  @Column()
  content : string

  @CreateDateColumn()
  createAt : string

  @UpdateDateColumn()
  updateAt : string
}
