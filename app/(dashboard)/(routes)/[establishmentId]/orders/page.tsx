import { getAuthToken } from "@/utils/get-token";
import { getOrdersByEstablishment } from "./__actions/actions";
import { OrderClient } from "./components/client";
import { OrdersForm } from "./components/ordersForm";

interface OrdersPageProps {
  params: Promise<{
    establishmentId: string;
  }>
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const { establishmentId } = await params;
  const token = await getAuthToken();

  const orders = await getOrdersByEstablishment(establishmentId, token)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-9 p-8 pt-6">
        <OrderClient items={orders}/>
        <OrdersForm 
          initialOrders={orders}
          establishmentId={establishmentId}
        />
      </div>
    </div>
  );
};

export default OrdersPage;