import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '../../prisma/client';

jest.mock('../../prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
  supabase: null,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>; 