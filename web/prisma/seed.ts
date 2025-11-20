import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@9melody.local' },
    update: {},
    create: { email: 'admin@9melody.local', password: 'changeme', name: 'Admin' }
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@9melody.local' },
    update: {},
    create: { email: 'author@9melody.local', password: 'changeme', name: 'Author' }
  });

  const post = await prisma.post.upsert({
    where: { slug: 'welcome-to-9melody' },
    update: {},
    create: {
      title: 'Welcome to 9Melody',
      slug: 'welcome-to-9melody',
      content: '<p>Chào mừng đến với 9Melody - studio phát triển game indie.</p>',
      excerpt: 'Chào mừng đến với 9Melody',
      authorId: author.id,
      published: true
    }
  });

  const job = await prisma.job.upsert({
    where: { slug: 'frontend-engineer' },
    update: {},
    create: {
      title: 'Frontend Engineer',
      slug: 'frontend-engineer',
      description: 'We are looking for a frontend engineer...',
      location: 'Remote',
      type: 'FULL_TIME',
      isPublished: true
    }
  });

  console.log({ adminId: admin.id, postId: post.id, jobId: job.id });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
