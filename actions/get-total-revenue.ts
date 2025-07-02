import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async () => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      isPaid: true
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.items.reduce((orderSum, item) => {
      return orderSum + item.product.price
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};