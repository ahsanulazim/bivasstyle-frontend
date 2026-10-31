"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const getSocketServerUrl = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socketUrl = getSocketServerUrl();
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const invalidateOrders = (eventName, payload) => {
      setLastEvent({ event: eventName, payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    };

    const invalidateProducts = (payload) => {
      setLastEvent({ event: "product:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["newArrivals"] });
    };

    const invalidateUsers = (payload) => {
      setLastEvent({ event: "user:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("users"),
      });
    };

    const invalidateCategories = (payload) => {
      setLastEvent({ event: "category:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    };

    const invalidateShipping = (payload) => {
      setLastEvent({ event: "shipping:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
    };

    const invalidateAttributes = (payload) => {
      setLastEvent({ event: "attribute:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    };

    const invalidateVariations = (payload) => {
      setLastEvent({ event: "variation:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["variations"] });
      queryClient.invalidateQueries({ queryKey: ["colorVariations"] });
      queryClient.invalidateQueries({ queryKey: ["sizeVariations"] });
    };

    const invalidateCoupons = (payload) => {
      setLastEvent({ event: "coupon:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["publicCoupons"] });
    };

    const invalidateReviews = (payload) => {
      setLastEvent({ event: "review:updated", payload, timestamp: new Date() });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    };

    const handleDashboardUpdate = (payload) => {
      setLastEvent({ event: "dashboard:update", payload, timestamp: new Date() });
      const type = payload?.type;
      if (type === "order") {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["orderDetails"] });
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else if (type === "product") {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product"] });
      } else if (type === "user") {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey.includes("users"),
        });
      } else if (type === "category") {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else if (type === "shipping") {
        queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      } else if (type === "attribute") {
        queryClient.invalidateQueries({ queryKey: ["attributes"] });
      } else if (type === "variation") {
        queryClient.invalidateQueries({ queryKey: ["variations"] });
        queryClient.invalidateQueries({ queryKey: ["colorVariations"] });
        queryClient.invalidateQueries({ queryKey: ["sizeVariations"] });
      } else if (type === "coupon") {
        queryClient.invalidateQueries({ queryKey: ["coupons"] });
        queryClient.invalidateQueries({ queryKey: ["publicCoupons"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey.includes("users"),
        });
      }
    };

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);

    socketInstance.on("order:created", (payload) =>
      invalidateOrders("order:created", payload),
    );
    socketInstance.on("order:updated", (payload) =>
      invalidateOrders("order:updated", payload),
    );
    socketInstance.on("order:deleted", (payload) =>
      invalidateOrders("order:deleted", payload),
    );
    socketInstance.on("product:updated", invalidateProducts);
    socketInstance.on("user:updated", invalidateUsers);
    socketInstance.on("category:updated", invalidateCategories);
    socketInstance.on("shipping:updated", invalidateShipping);
    socketInstance.on("attribute:updated", invalidateAttributes);
    socketInstance.on("variation:updated", invalidateVariations);
    socketInstance.on("coupon:updated", invalidateCoupons);
    socketInstance.on("review:updated", invalidateReviews);
    socketInstance.on("dashboard:update", handleDashboardUpdate);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("order:created");
      socketInstance.off("order:updated");
      socketInstance.off("order:deleted");
      socketInstance.off("product:updated");
      socketInstance.off("user:updated");
      socketInstance.off("category:updated");
      socketInstance.off("shipping:updated");
      socketInstance.off("attribute:updated");
      socketInstance.off("variation:updated");
      socketInstance.off("coupon:updated");
      socketInstance.off("review:updated");
      socketInstance.off("dashboard:update");
      socketInstance.disconnect();
    };
  }, [queryClient]);

  const contextValue = {
    socket,
    isConnected,
    lastEvent,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
