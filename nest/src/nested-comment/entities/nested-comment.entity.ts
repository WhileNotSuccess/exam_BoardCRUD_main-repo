import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NestedComment {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  commentId:number
  
  @Column()
  author:string
  
  @Column()
  content:string
}