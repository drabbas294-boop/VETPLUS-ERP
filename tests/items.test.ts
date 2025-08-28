jest.mock('@/lib/prisma', () => ({
  prisma: {
    item: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/items/route';
import { prisma } from '@/lib/prisma';

describe('items API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns items', async () => {
    const items = [
      { id: '1', sku: 'sku', name: 'Item1', category: 'RAW_MATERIAL', uom: 'kg', createdAt: 'now', updatedAt: 'now' },
    ];
    (prisma.item.findMany as jest.Mock).mockResolvedValue(items);

    const res = await GET();
    const data = await res.json();

    expect(prisma.item.findMany).toHaveBeenCalled();
    expect(data).toEqual(items);
  });

  it('POST creates an item with valid data', async () => {
    const body = { sku: 'sku1', name: 'Item', category: 'RAW_MATERIAL', uom: 'kg' };
    const created = { id: '1', ...body, createdAt: 'now', updatedAt: 'now' };
    (prisma.item.create as jest.Mock).mockResolvedValue(created);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(prisma.item.create).toHaveBeenCalledWith({ data: body });
    expect(data).toEqual(created);
  });

  it('POST returns 400 for invalid data', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(prisma.item.create).not.toHaveBeenCalled();
    expect(res.status).toBe(400);
  });
});
