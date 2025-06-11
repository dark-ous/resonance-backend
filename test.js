import prisma from './src/config/prismaClient.js';

async function clearThreads() {
  await prisma.thread.deleteMany({});
  console.log('All threads deleted');
}

clearThreads()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
