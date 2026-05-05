import { useState, useEffect } from "react";
import { getMyRequests, cancelRequest } from "../../../Service/BorrowService";

export default function useRequests() {
  const user   = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [requests,  setRequests]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [toast,     setToast]     = useState(null);
  const [canceling, setCanceling] = useState(null); 


  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getMyRequests(userId);
      setRequests(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [userId]);


  const handleCancel = async (reqId) => {
    if (!window.confirm("Cancel this borrow request?")) return;
    setCanceling(reqId);
    try {
      await cancelRequest(userId, reqId);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      setToast({ type: "success", text: "Request cancelled successfully." });
    } catch (err) {
      setToast({
        type: "error",
        text: err?.response?.data?.message || "Failed to cancel request.",
      });
    } finally {
      setCanceling(null);
    }
  };

  return { requests, loading, error, toast, canceling, handleCancel };
}