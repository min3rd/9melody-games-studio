import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // create a sample user and posts
  const user = await prisma.user.upsert({
    where: { email: 'hello@9melody.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'hello@9melody.com',
      password: 'password' // NOTE: do not use plaintext in production
    }
  })

  await prisma.post.createMany({
    data: [
      { title: 'Welcome to 9Melody', content: 'This is a demo post.', authorId: user.id },
      { title: 'Another post', content: 'This demonstrates Prisma seed.' }
    ],
    skipDuplicates: true
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
