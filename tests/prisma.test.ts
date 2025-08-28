import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('prisma client', () => {
  it('exports a PrismaClient instance', () => {
    expect(prisma).toBeInstanceOf(PrismaClient);
  });
});
