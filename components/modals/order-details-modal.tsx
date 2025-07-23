"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderModalStore } from "@/hooks/use-order-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'preparing':
    case 'preparando':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
    case 'pronto':
      return 'bg-green-100 text-green-800';
    case 'delivered':
    case 'entregue':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'Pendente';
    case 'preparing': return 'Preparando';
    case 'ready': return 'Pronto';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

export const OrderDetailsModal = () => {
  const { modalType, isOpen, selectedOrder, closeModal } = useOrderModalStore();
  
  const isDetailsModalOpen = isOpen && modalType === 'details';

  if (!selectedOrder) return null;

  return (
    <Modal
      isOpen={isDetailsModalOpen}
      onClose={closeModal}
      title={`Pedido #${selectedOrder.id}`}
      description="Detalhes completos do pedido"
    >
      <div className="space-y-6">
        {/* Informações do Cliente */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Informações do Cliente</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Nome:</strong> {selectedOrder.customerName}</p>
            <p><strong>Telefone:</strong> {selectedOrder.customerPhone || 'Não informado'}</p>
            <p><strong>Tipo:</strong> {selectedOrder.orderType}</p>
            {selectedOrder.tableNumber && (
              <p><strong>Mesa:</strong> {selectedOrder.tableNumber}</p>
            )}
          </div>
        </div>

        {/* Status e Data */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-2">Status</h3>
            <Badge className={getStatusColor(selectedOrder.status)}>
              {getStatusText(selectedOrder.status)}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Criado em</p>
            <p className="font-medium">
              {format(selectedOrder.createdAt, "dd/MM/yyyy 'às' HH:mm", { 
                locale: ptBR 
              })}
            </p>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Itens do Pedido</h3>
          {selectedOrder.items && selectedOrder.items.length > 0 ? (
            <div className="space-y-2">
              {selectedOrder.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum item encontrado</p>
          )}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Total</h3>
            <p className="font-bold text-xl">
              R$ {selectedOrder.totalAmount?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={closeModal} className="flex-1">
            Fechar
          </Button>
          {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
            <Button className="flex-1">
              Atualizar Status
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};