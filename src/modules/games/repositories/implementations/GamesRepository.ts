import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .select('game.title')
      .where('game.title ilike :title', { title: `%${param}%` })
      .getMany()

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = this.repository.query('SELECT count(*) FROM games');
    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect("game.users", "user")
      .where('game.id = :id', { id })
      .getOne();

    const users = game?.users || [];

    return users;
  }
}
