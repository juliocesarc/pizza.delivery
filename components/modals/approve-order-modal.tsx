"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useOrderModalStore } from "@/hooks/use-order-modal";
import {
    CheckCircle,
    Clock,
    AlertCircle,
    DollarSign,
    User,
    Phone,
    MapPin
} from "lucide-react";

const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
        case 'pendente':
            return {
                text: 'Pendente',
                color: 'bg-orange-100 text-orange-700 border-orange-200',
                icon: Clock
            };
        case 'preparing':
        case 'preparando':
            return {
                text: 'Preparando',
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: Clock
            };
        case 'ready':
        case 'pronto':
            return {
                text: 'Pronto',
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircle
            };
        default:
            return {
                text: status,
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: AlertCircle
            };
    }
};

export const ApproveOrderModal = () => {
    const {
        modalType,
        isOpen,
        selectedOrder,
        closeModal,
        onApproveCallback,
        onRejectCallback
    } = useOrderModalStore();

    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    const isApproveModalOpen = isOpen && modalType === 'approve';

    if (!selectedOrder) return null;

    const statusInfo = getStatusInfo(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    const handleApprove = async () => {
        try {
            setLoading(true);

            const response = await axios.patch(`/api/orders/${selectedOrder.id}/status`, {
                status: 'APPROVED', 
                reason: undefined,
                notes: undefined,
            }); 
                

            toast.success('Pedido aprovado com sucesso!');

            if (onApproveCallback) {
                onApproveCallback(selectedOrder.id);
            }

            closeModal();
        } catch (error: any) {
            console.error('Erro ao aprovar pedido:', error);

            if (error.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                // Redirecionar para login se necessário
            } else {
                toast.error(error.response?.data?.message || 'Erro ao aprovar pedido');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setLoading(true);

            if (!notes.trim()) {
                toast.error('Adicione uma observação para rejeitar o pedido');
                return;
            }

            const response = await axios.patch(`/api/orders/${selectedOrder.id}/status`, {
                rejectionReason: notes.trim(),
                rejectedAt: new Date().toISOString(),
                status: 'cancelled'
            });

            toast.success('Pedido rejeitado');

            if (onRejectCallback) {
                onRejectCallback(selectedOrder.id);
            }

            closeModal();
        } catch (error: any) {
            console.error('Erro ao rejeitar pedido:', error);

            if (error.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
            } else {
                toast.error(error.response?.data?.message || 'Erro ao rejeitar pedido');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal
            isOpen={isApproveModalOpen}
            onClose={closeModal}
            title="Aprovar Pedido"
            description={`Revise e aprove o pedido`}
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">

                {/* Header com Status */}
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-100">
                        <StatusIcon className="h-5 w-5 text-gray-400" />
                        <div>
                            <h3 className="font-semibold">Pedido #{selectedOrder.id}</h3>
                            <p className="text-sm text-gray-400">
                                {format(selectedOrder.createdAt, "dd/MM/yyyy 'às' HH:mm", {
                                    locale: ptBR
                                })}
                            </p>
                        </div>
                    </div>
                    <Badge className={statusInfo.color}>
                        {statusInfo.text}
                    </Badge>
                </div>

                {/* Informações do Cliente */}
                <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Informações do Cliente
                    </h4>
                    <div className="grid grid-cols-1 gap-2 pl-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">Atendente:</span>
                            <span className="text-sm">Web (Site Mobile)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">Forma de entrega:</span>
                            <span className="text-sm">Entrega em domicílio</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">Nome:</span>
                            <span className="text-sm">{selectedOrder.customerName}</span>
                        </div>
                        {selectedOrder.customerPhone && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold">Telefone:</span>
                                <span className="text-sm">{selectedOrder.customerPhone}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">Endereço:</span>
                            <span className="text-sm capitalize">Rua Ângela Alves de Jorge Souza, 50</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Itens do Pedido */}
                <div className="space-y-3">
                    <h4 className="text-lg font-medium">Itens do Pedido</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-start p-3 bg-slate-900 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-100">{item.quantity}x - {item.productName}</p>
                                    {item.options && item.options.length > 0 && (
                                        <div className="flex items-center pl-8 space-x-4 mt-2">
                                            <ul className="list-disc pl-4 text-sm text-gray-300">
                                                {item.options.map((option: any, idx: number) => (
                                                    <li key={idx}>{option.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm">
                                        R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-100">Taxa de entrega:</span>
                        <span className="text-gray-200">R$ 0,00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-100">Desconto:</span>
                        <span className="text-gray-200">R$ 0,00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-100">Total do pedido:</span>
                        <span className="text-gray-200">R$ 0,00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-100">Dinheiro:</span>
                        <span className="text-gray-200">R$ 16,90 (Troco 33,90)</span>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-3 pt-4">
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={loading}
                        className="flex-1 text-gray-100"
                    >
                        {loading ? "Rejeitando..." : "Rejeitar"}
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-gray-100"
                    >
                        {loading ? "Aprovando..." : "Aprovar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};