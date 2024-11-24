import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  type: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @ManyToOne(() => Category, (category) => category.transactions)
  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL', // when category is deleted the Xactions belonging to it receive category 'NULL' // OWNFIX: missing this line
    // onDelete: 'CASCADE', // when category is deleted the Xactions belonging to it are also deleted
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('numeric', { scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
