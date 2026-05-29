"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader, AlertCircle } from "lucide-react";
import { getLuluCostsAction } from "@/app/dashboard/orders/action";
import { toast } from "sonner";

interface CostBreakdown {
  productCost: number;
  shippingCost: number;
  totalCost: number;
}

export default function ProfitCalculationTab({ order }: { order: any }) {
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getLuluCostsAction(order.id);
        if (!res.success) {
          const errorMessage = res.error || "Failed to load costs";
          setError(errorMessage);
          toast.error(errorMessage);
          return;
        }
        // Success
        setCosts(res.cost);
      } catch (error: any) {
        const errorMessage =
          error?.message || error?.error || "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
  }, [order.id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          gap: "1rem",
          color: "var(--text-dim)",
        }}
      >
        <Loader size={32} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
          Fetching Lulu costs...
        </p>
      </div>
    );
  }

  if (error || !costs) {
    return (
      <div
        style={{
          background: "rgba(239, 68, 68, 0.06)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <AlertCircle
          size={22}
          style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}
        />
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              color: "#ef4444",
              fontWeight: 900,
              fontSize: "1.05rem",
            }}
          >
            Error Fetching Costs
          </h3>
          <p
            style={{
              margin: 0,
              color: "var(--text-main)",
              fontSize: "0.92rem",
              fontWeight: 600,
            }}
          >
            {error || "Could not retrieve Lulu costs"}
          </p>
        </div>
      </div>
    );
  }

  // Get order price from database
  const ourPrice = order.grossAmount || 0;
  const luluTotalCost = costs.totalCost || 0;
  const profit = ourPrice - luluTotalCost;
  const profitMargin = luluTotalCost > 0 ? (profit / luluTotalCost) * 100 : 0;
  const isProfitable = profit > 0;
  const profitColor = isProfitable ? "#10b981" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Status Alert */}
      {!isProfitable && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.06)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "16px",
            padding: "1.5rem",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          <TrendingDown
            size={22}
            style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                color: "#ef4444",
                fontWeight: 900,
                fontSize: "1.05rem",
              }}
            >
              ⚠️ Loss Alert
            </h3>
            <p
              style={{
                margin: 0,
                color: "var(--text-main)",
                fontSize: "0.92rem",
                fontWeight: 600,
              }}
            >
              This order is operating at a loss. Review pricing.
            </p>
          </div>
        </div>
      )}

      {/* Main KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* What We Charged */}
        <div
          style={{
            background: "var(--surface-light)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 900,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.5rem",
            }}
          >
            What We Charged
          </span>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 950,
              color: "#3b82f6",
              letterSpacing: "-0.5px",
            }}
          >
            ${ourPrice.toFixed(2)}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "var(--text-dim)",
              fontWeight: 500,
            }}
          >
            Our selling price
          </p>
        </div>

        {/* What Lulu Charges */}
        <div
          style={{
            background: "var(--surface-light)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 900,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.5rem",
            }}
          >
            Lulu Total Cost
          </span>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 950,
              color: "#ef4444",
              letterSpacing: "-0.5px",
            }}
          >
            ${luluTotalCost.toFixed(2)}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "var(--text-dim)",
              fontWeight: 500,
            }}
          >
            Product + shipping
          </p>
        </div>

        {/* Profit */}
        <div
          style={{
            background: isProfitable
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
            border: `1px solid ${isProfitable ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            borderRadius: "16px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.5rem",
            }}
          >
            {isProfitable ? (
              <TrendingUp size={18} style={{ color: "#10b981" }} />
            ) : (
              <TrendingDown size={18} style={{ color: "#ef4444" }} />
            )}
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Our Profit
            </span>
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 950,
              color: profitColor,
              letterSpacing: "-0.5px",
            }}
          >
            ${Math.abs(profit).toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--text-dim)",
              fontWeight: 600,
            }}
          >
            Margin:{" "}
            <strong style={{ color: profitColor }}>
              {profitMargin.toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "var(--surface-light)",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            fontWeight: 900,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "var(--text-dim)",
          }}
        >
          Cost Breakdown
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                }}
              >
                Product Cost (Lulu)
              </td>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "right",
                  fontWeight: 800,
                  color: "#ef4444",
                  fontSize: "0.95rem",
                }}
              >
                ${costs.productCost.toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                }}
              >
                Shipping Cost (Lulu)
              </td>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "right",
                  fontWeight: 800,
                  color: "#ef4444",
                  fontSize: "0.95rem",
                }}
              >
                ${costs.shippingCost.toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: "2px solid var(--primary-color)" }}>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  fontWeight: 900,
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                }}
              >
                Total Lulu Cost
              </td>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "right",
                  fontWeight: 900,
                  color: "#ef4444",
                  fontSize: "1rem",
                }}
              >
                ${luluTotalCost.toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                }}
              >
                Our Selling Price
              </td>
              <td
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "right",
                  fontWeight: 800,
                  color: "#3b82f6",
                  fontSize: "0.95rem",
                }}
              >
                ${ourPrice.toFixed(2)}
              </td>
            </tr>
            <tr
              style={{
                background: isProfitable
                  ? "rgba(16, 185, 129, 0.06)"
                  : "rgba(239, 68, 68, 0.06)",
              }}
            >
              <td
                style={{
                  padding: "1.2rem 1.5rem",
                  fontWeight: 900,
                  color: "var(--text-main)",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Profit / Loss
              </td>
              <td
                style={{
                  padding: "1.2rem 1.5rem",
                  textAlign: "right",
                  fontWeight: 950,
                  color: profitColor,
                  fontSize: "1.1rem",
                }}
              >
                ${profit.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
