type OrderLike = {
  invalidated: boolean;
  createdAt: string | number;
  [key: string]: unknown;
};

export const getLastValidOrder = <T extends OrderLike>(
  orders: Array<T>
): T | null => {
  const validOrders = orders.filter((order) => !order.invalidated);
  let largestCreatedAt = 0,
    orderIndex = undefined;
  validOrders.forEach((order, index) => {
    const createdAt = Number(order.createdAt);
    if (createdAt > largestCreatedAt) {
      largestCreatedAt = createdAt;
      orderIndex = index;
    }
  });
  return orderIndex !== undefined ? validOrders[orderIndex] : null;
};
