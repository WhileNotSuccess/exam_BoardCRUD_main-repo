import { Comment } from "../../comments/entities/comment.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}