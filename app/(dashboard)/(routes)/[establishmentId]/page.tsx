import { CreditCard, DollarSign, Package } from "lucide-react";

import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardPage: React.FC = async () => {

  const totalRevenue = await getTotalRevenue();
  const graphRevenue = await getGraphRevenue();
  const salesCount = await getSalesCount();
  const stockCount = await getStockCount();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Heading title="Dashboard" />
          <DatePickerWithRange />
        </div>


        <Tabs defaultValue="overview" >
            <TabsList>
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="analitics">Análises</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                {/* Total em vendas */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total em vendas
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                  </CardContent>
                </Card>
                {/* vendas */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{salesCount}</div>
                  </CardContent>
                </Card>
                {/* Produtos em estoque */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produtos em estoque</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stockCount}</div>
                  </CardContent>
                </Card>
              </div>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visão geral</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={graphRevenue} />
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;