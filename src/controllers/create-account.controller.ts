/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post , ConflictException} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body:any) {
    const {name, email, password} = body
    
    const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
            email,
        }, 
    })

    if(userWithSameEmail){
        throw new ConflictException('user with same e-mail address already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
