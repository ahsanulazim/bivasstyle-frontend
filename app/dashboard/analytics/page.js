"use client";

import { getAnalyticsSummary } from "@/api/analyticsApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import AnalyticsHeader from "@/components/dashboard/analytics/AnalyticsHeader";
import FinancialSummaryCards from "@/components/dashboard/analytics/FinancialSummaryCards";
import InventoryAlertCard from "@/components/dashboard/analytics/InventoryAlertCard";
import KpiCardsGrid from "@/components/dashboard/analytics/KpiCardsGrid";
import OrderFunnelChart from "@/components/dashboard/analytics/OrderFunnelChart";
import PaymentMethodsChart from "@/components/dashboard/analytics/PaymentMethodsChart";
import ProductVelocityTabs from "@/components/dashboard/analytics/ProductVelocityTabs";
import SalesTrendChart from "@/components/dashboard/analytics/SalesTrendChart";
import StatusDistributionChart from "@/components/dashboard/analytics/StatusDistributionChart";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AnalyticsPage = () => {
  const [selectedRange, setSelectedRange] = useState("30d");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["analyticsSummary", selectedRange],
    queryFn: () => getAnalyticsSummary({ range: selectedRange }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  const summary = data?.data || {};
  const kpis = summary.kpis || {};
  const orderFunnel = summary.orderFunnel || [];
  const timelineData = summary.timelineData || [];
  const statusData = summary.statusData || [];
  const paymentData = summary.paymentData || [];
  const topSellingProducts = summary.topSellingProducts || [];
  const leastSellingProducts = summary.leastSellingProducts || [];
  const lowStockAlerts = summary.lowStockAlerts || [];
  const couponUsage = summary.couponUsage || [];

  return (
    <div className="space-y-6">
      <Breadcrumbs title="Analytics & Reports" />

      {/* Header with Title, Range Filter, Refresh & Export Reports */}
      <AnalyticsHeader
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 1. KPI Stat Cards Grid (Revenue, Orders, AOV, Conversion Rate, Repeat Rate) */}
      <KpiCardsGrid kpis={kpis} />

      {/* 2. Order Fulfillment Conversion Funnel */}
      <OrderFunnelChart orderFunnel={orderFunnel} kpis={kpis} />

      {/* 3. Sales & Revenue Trend Chart */}
      <SalesTrendChart timelineData={timelineData} isLoading={isLoading} />

      {/* 4. Secondary Breakdown: Status Lifecycle & Payment Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <StatusDistributionChart statusData={statusData} />
        </div>
        <div className="lg:col-span-6">
          <PaymentMethodsChart
            paymentData={paymentData}
            totalOrders={kpis.totalOrders || 0}
          />
        </div>
      </div>

      {/* 5. Product Sales Velocity (Top-Selling vs Least-Selling) & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <ProductVelocityTabs
            topSellingProducts={topSellingProducts}
            leastSellingProducts={leastSellingProducts}
          />
        </div>
        <div className="lg:col-span-4">
          <InventoryAlertCard lowStockAlerts={lowStockAlerts} />
        </div>
      </div>

      {/* 6. Financial Health & Promotional Breakdown */}
      <FinancialSummaryCards kpis={kpis} couponUsage={couponUsage} />
    </div>
  );
};

export default AnalyticsPage;
