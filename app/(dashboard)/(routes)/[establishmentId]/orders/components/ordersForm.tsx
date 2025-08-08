"use client"

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, CheckCircle, MapPin, Store, SquarePen, Check } from 'lucide-react';
import { useOrderModalStore } from '@/hooks/use-order-modal';

interface OrderOptions {
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  options?: OrderOptions[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  items: OrderItem[];
}

interface OrdersFormProps {
  initialOrders: Order[];
  establishmentId: string
}

export const OrdersForm = ({ initialOrders, establishmentId }: OrdersFormProps) => {
  const [orders, setOrders] = useState(() => {
    const organizedOrders = {
      pending: initialOrders.filter(order => order.status === 'PENDENTE'),
      preparing: initialOrders.filter(order => order.status === 'APPROVED'),
      ready: initialOrders.filter(order => order.status === 'PRONTO')
    };
    return organizedOrders;
  });
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)

  const { openApproveModal } = useOrderModalStore()

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('https://api.pizzarianapole.com.br/ws')
      //const ws = new WebSocket('http://localhost:3333/ws')

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'AUTHENTICATE',
          establishmentId
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'NEW_ORDER') {
            const newOrder: Order = {
              id: data.data.id,
              customerName: data.data.customerName,
              customerPhone: data.data.customerPhone,
              status: 'PENDENTE',
              items: data.data.items,
              totalAmount: data.data.totalAmount,
              createdAt: new Date(data.data.createdAt)
            }

            // Adiciona o novo pedido à lista de pedidos pendentes
            setOrders(prev => ({
              ...prev,
              pending: [...prev.pending, newOrder]
            }))
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error)
        }
      }

      ws.onclose = () => {
        setTimeout(connectWebSocket, 3000)
      }

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error)
      }

      setWebsocket(ws)
    }

    connectWebSocket()

    return () => {
      websocket?.close()
    }
  }, [])

  const handleApproveOrder = (orderId: string) => {
    const order = orders.pending.find(o => o.id === orderId);
    if (order) {
      setOrders(prev => ({
        ...prev,
        pending: prev.pending.filter(o => o.id !== orderId),
        preparing: [...prev.preparing, { ...order, status: 'PREPARANDO' }]
      }));
    }
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(prev => ({
      ...prev,
      pending: prev.pending.filter(o => o.id !== orderId)
    }));
  };

  const handleMarkAsReady = (orderId: string) => {
    const order = orders.preparing.find(o => o.id === orderId);
    if (order) {
      setOrders(prev => ({
        ...prev,
        preparing: prev.preparing.filter(o => o.id !== orderId),
        ready: [...prev.ready, { ...order, status: 'PRONTO' }]
      }));
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    // Remove o pedido da lista (pedido concluído)
    setOrders(prev => ({
      ...prev,
      ready: prev.ready.filter(o => o.id !== orderId)
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const OrderCard: React.FC<{ order: Order; status: string }> = ({ order, status }) => (
    <Card
      className="flex justify-between items-center cursor-pointer mb-4 bg-slate-800 border-l-4 border-l-blue-500 p-4"
      onClick={() => openApproveModal(
        order,
        handleApproveOrder,
        handleRejectOrder
      )}
    >
      <div className='flex gap-3 items-center'>
        <span className='flex items-center justify-center p-2 bg-slate-700 rounded-md'>
          <Store className="h-6 w-6" />
        </span>
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold'>{order.customerName}</h3>
          <p className='text-sm text-gray-400'>{formatTime(new Date(order.createdAt))}</p>
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        {status !== 'pending' && (
          <Check className="h-6 w-6 p-1 cursor-pointer bg-green-500 text-white rounded-md"
            onClick={() => handleCompleteOrder(order.id)}
          />
        )}
        <SquarePen className="h-8 w-8 p-1 cursor-pointer text-gray-500" />
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Pedidos Pendentes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Pendentes de Aprovação</h2>
          <Badge variant="secondary">{orders.pending.length}</Badge>
        </div>

        <div className="min-h-[400px] rounded-lg p-4">
          {orders.pending.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              Nenhum pedido pendente
            </p>
          ) : (
            orders.pending.map((order) => (
              <OrderCard key={order.id} order={order} status="pending" />
            ))
          )}
        </div>
      </div>

      {/* Coluna 2: Em Preparo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Em Preparo</h2>
          <Badge variant="secondary">{orders.preparing.length}</Badge>
        </div>

        <div className="min-h-[400px] rounded-lg p-4">
          {orders.preparing.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              Nenhum pedido em preparo
            </p>
          ) : (
            orders.preparing.map((order) => (
              <OrderCard key={order.id} order={order} status="APPROVED" />
            ))
          )}
        </div>
      </div>

      {/* Coluna 3: Prontos */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Prontos</h2>
          <Badge variant="secondary">{orders.ready.length}</Badge>
        </div>

        <div className="min-h-[400px] rounded-lg p-4">
          {orders.ready.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              Nenhum pedido pronto
            </p>
          ) : (
            orders.ready.map((order) => (
              <OrderCard key={order.id} order={order} status="ready" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};