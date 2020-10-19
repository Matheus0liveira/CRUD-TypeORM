import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeRemove, BeforeUpdate} from "typeorm";

import bcrypt from 'bcryptjs';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    authorized: string;


    @BeforeInsert()
    @BeforeUpdate()
    @BeforeUpdate()
    hashPassword(){
        this.password =  bcrypt.hashSync(this.password, 10);
    }
};