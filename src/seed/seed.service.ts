import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hashSync } from 'bcrypt'
import { ProductsService } from '../products/products.service'
import { User } from '../auth/entities/user.entity'
import { initialData } from './data/seed-data'

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed() {
    await this.deleteTables()

    const firstUser = await this.insertUsers()

    await this.insertProducts(firstUser)

    return 'SEED executes'
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder()

    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users

    const users: User[] = []

    seedUsers.forEach(({ password, ...rest }) => {
      const user = {
        password: hashSync(password, 10),
        ...rest
      }
      
      users.push(this.userRepository.create(user))
    })

    await this.userRepository.save(users)

    return users[0]
  }

  private async insertProducts(user: User) {
    const products = initialData.products

    const insertPromises = []

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user))
    })

    await Promise.all(insertPromises)

    return true
  }
}
