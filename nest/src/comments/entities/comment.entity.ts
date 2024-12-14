import { NestedComment } from '../../nested-comment/entities/nested-comment.entity';
import { Post } from "../../post/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id : number

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

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

  @OneToMany(() => NestedComment, nestedComment => nestedComment.comment)
  nestedComments: NestedComment[];
}
