import { Comment } from "../../comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class NestedComment {
  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => Comment, comment => comment.nestedComments)
  @JoinColumn({ name: 'commentId' })
  comment: Comment

  @Column()
  commentId:number
  
  @Column()
  author:string
  
  @Column()
  content:string

  @CreateDateColumn()
    createdAt : string
  
  @UpdateDateColumn()
  updatedAt : string
}