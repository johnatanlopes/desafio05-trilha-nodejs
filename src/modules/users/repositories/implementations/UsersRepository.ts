import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository.findOne(user_id, {
      relations: ['games']
    });
    
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        created_at,
        updated_at
      FROM
        users
      ORDER BY 
        first_name
    `;

    const users = this.repository.query(sql);

    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        created_at,
        updated_at
      FROM
        users
      WHERE
        first_name ilike $1
        AND
        last_name ilike $2
    `;

    const users = this.repository.query(sql, [first_name, last_name]);

    return users;
  }
}
