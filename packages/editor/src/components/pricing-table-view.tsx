"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { useCallback, useMemo } from "react"
import type {
  PricingTableRow,
  PricingTableAttributes,
  DiscountType,
} from "../extensions/pricing-table"

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getCurrencySymbol(currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(0)
    .replace(/\d/g, "")
    .trim()
}

/* ------------------------------------------------------------------ */
/*  Settings Bar                                                       */
/* ------------------------------------------------------------------ */

function SettingsBar({
  currency,
  showQuantity,
  discountType,
  discountValue,
  taxRate,
  onUpdate,
}: Pick<
  PricingTableAttributes,
  "currency" | "showQuantity" | "discountType" | "discountValue" | "taxRate"
> & {
  onUpdate: (attrs: Partial<PricingTableAttributes>) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: "8px 8px 0 0",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        fontSize: "13px",
        color: "var(--text-secondary)",
      }}
    >
      {/* Currency */}
      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        Currency
        <select
          value={currency}
          onChange={(e) => onUpdate({ currency: e.target.value })}
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "13px",
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {/* Show quantity toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <input
          type="checkbox"
          checked={showQuantity}
          onChange={(e) => onUpdate({ showQuantity: e.target.checked })}
          style={{ accentColor: "var(--accent)" }}
        />
        Qty column
      </label>

      {/* Discount */}
      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        Discount
        <select
          value={discountType}
          onChange={(e) =>
            onUpdate({
              discountType: e.target.value as DiscountType,
              discountValue:
                e.target.value === "none" ? 0 : discountValue,
            })
          }
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "13px",
          }}
        >
          <option value="none">None</option>
          <option value="percentage">%</option>
          <option value="fixed">Fixed</option>
        </select>
        {discountType !== "none" && (
          <input
            type="number"
            min={0}
            step={discountType === "percentage" ? 1 : 0.01}
            value={discountValue}
            onChange={(e) =>
              onUpdate({ discountValue: parseFloat(e.target.value) || 0 })
            }
            style={{
              width: "64px",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "13px",
              textAlign: "right",
            }}
          />
        )}
      </label>

      {/* Tax */}
      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        Tax %
        <input
          type="number"
          min={0}
          step={0.1}
          value={taxRate}
          onChange={(e) =>
            onUpdate({ taxRate: parseFloat(e.target.value) || 0 })
          }
          style={{
            width: "56px",
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "13px",
            textAlign: "right",
          }}
        />
      </label>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Row component                                                      */
/* ------------------------------------------------------------------ */

function PricingRow({
  row,
  index,
  totalRows,
  currency,
  showQuantity,
  onUpdateRow,
  onDeleteRow,
  onMoveRow,
}: {
  row: PricingTableRow
  index: number
  totalRows: number
  currency: string
  showQuantity: boolean
  onUpdateRow: (id: string, patch: Partial<PricingTableRow>) => void
  onDeleteRow: (id: string) => void
  onMoveRow: (fromIndex: number, direction: "up" | "down") => void
}) {
  const total = row.quantity * row.unitPrice
  const currencySymbol = getCurrencySymbol(currency)

  const cellStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderBottom: "1px solid var(--border-default)",
    verticalAlign: "middle",
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    border: "1px solid transparent",
    borderRadius: "4px",
    padding: "4px 6px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  }

  const inputFocusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "var(--border-default)"
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "transparent"
    },
  }

  return (
    <tr
      style={{
        opacity: row.optional && !row.checked ? 0.5 : 1,
      }}
    >
      {/* Drag / reorder */}
      <td style={{ ...cellStyle, width: "60px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveRow(index, "up")}
            title="Move up"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: index === 0 ? "default" : "pointer",
              opacity: index === 0 ? 0.3 : 1,
              fontSize: "12px",
              lineHeight: 1,
              padding: "2px",
            }}
          >
            ▲
          </button>
          <button
            type="button"
            disabled={index === totalRows - 1}
            onClick={() => onMoveRow(index, "down")}
            title="Move down"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: index === totalRows - 1 ? "default" : "pointer",
              opacity: index === totalRows - 1 ? 0.3 : 1,
              fontSize: "12px",
              lineHeight: 1,
              padding: "2px",
            }}
          >
            ▼
          </button>
        </div>
      </td>

      {/* Optional toggle */}
      <td style={{ ...cellStyle, width: "36px", textAlign: "center" }}>
        {row.optional ? (
          <input
            type="checkbox"
            checked={row.checked}
            onChange={(e) =>
              onUpdateRow(row.id, { checked: e.target.checked })
            }
            title="Include this optional item"
            style={{ accentColor: "var(--accent)" }}
          />
        ) : (
          <span
            style={{ color: "var(--text-secondary)", fontSize: "12px" }}
            title="Required item"
          >
            ●
          </span>
        )}
      </td>

      {/* Description */}
      <td style={cellStyle}>
        <input
          type="text"
          value={row.description}
          onChange={(e) =>
            onUpdateRow(row.id, { description: e.target.value })
          }
          placeholder="Item description"
          style={inputStyle}
          {...inputFocusProps}
        />
      </td>

      {/* Quantity */}
      {showQuantity && (
        <td style={{ ...cellStyle, width: "80px" }}>
          <input
            type="number"
            min={0}
            step={1}
            value={row.quantity}
            onChange={(e) =>
              onUpdateRow(row.id, {
                quantity: parseFloat(e.target.value) || 0,
              })
            }
            style={{ ...inputStyle, textAlign: "right" }}
            {...inputFocusProps}
          />
        </td>
      )}

      {/* Unit Price */}
      <td style={{ ...cellStyle, width: "130px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {currencySymbol}
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={row.unitPrice}
            onChange={(e) =>
              onUpdateRow(row.id, {
                unitPrice: parseFloat(e.target.value) || 0,
              })
            }
            style={{ ...inputStyle, textAlign: "right" }}
            {...inputFocusProps}
          />
        </div>
      </td>

      {/* Total */}
      <td
        style={{
          ...cellStyle,
          width: "120px",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary)",
          fontWeight: 500,
        }}
      >
        {formatMoney(total, currency)}
      </td>

      {/* Actions */}
      <td style={{ ...cellStyle, width: "70px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() =>
              onUpdateRow(row.id, { optional: !row.optional })
            }
            title={row.optional ? "Make required" : "Make optional"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: row.optional
                ? "var(--accent)"
                : "var(--text-secondary)",
              fontSize: "14px",
              padding: "2px",
            }}
          >
            {row.optional ? "◉" : "○"}
          </button>
          <button
            type="button"
            onClick={() => onDeleteRow(row.id)}
            title="Delete row"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              padding: "2px",
            }}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ------------------------------------------------------------------ */
/*  Summary Section                                                    */
/* ------------------------------------------------------------------ */

function SummarySection({
  rows,
  discountType,
  discountValue,
  taxRate,
  currency,
}: Pick<
  PricingTableAttributes,
  "rows" | "discountType" | "discountValue" | "taxRate" | "currency"
>) {
  const subtotal = rows.reduce((sum, r) => {
    if (r.optional && !r.checked) return sum
    return sum + r.quantity * r.unitPrice
  }, 0)

  const discountAmount =
    discountType === "percentage"
      ? subtotal * (discountValue / 100)
      : discountType === "fixed"
        ? discountValue
        : 0

  const afterDiscount = Math.max(0, subtotal - discountAmount)
  const taxAmount = taxRate > 0 ? afterDiscount * (taxRate / 100) : 0
  const grandTotal = afterDiscount + taxAmount

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontVariantNumeric: "tabular-nums",
  }

  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: "2px solid var(--border-default)",
        maxWidth: "320px",
        marginLeft: "auto",
        fontSize: "14px",
        color: "var(--text-secondary)",
      }}
    >
      <div style={rowStyle}>
        <span>Subtotal</span>
        <span style={{ color: "var(--text-primary)" }}>
          {formatMoney(subtotal, currency)}
        </span>
      </div>

      {discountType !== "none" && discountAmount > 0 && (
        <div style={rowStyle}>
          <span>
            Discount
            {discountType === "percentage" ? ` (${discountValue}%)` : ""}
          </span>
          <span style={{ color: "var(--accent)" }}>
            −{formatMoney(discountAmount, currency)}
          </span>
        </div>
      )}

      {taxRate > 0 && (
        <div style={rowStyle}>
          <span>Tax ({taxRate}%)</span>
          <span style={{ color: "var(--text-primary)" }}>
            {formatMoney(taxAmount, currency)}
          </span>
        </div>
      )}

      <div
        style={{
          ...rowStyle,
          borderTop: "1px solid var(--border-default)",
          marginTop: "8px",
          paddingTop: "8px",
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--text-primary)",
        }}
      >
        <span>Total</span>
        <span style={{ color: "var(--accent)" }}>
          {formatMoney(grandTotal, currency)}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main View                                                          */
/* ------------------------------------------------------------------ */

export function PricingTableView({ node, updateAttributes }: NodeViewProps) {
  const {
    rows,
    discountType,
    discountValue,
    taxRate,
    currency,
    showQuantity,
  } = node.attrs as PricingTableAttributes

  const handleUpdate = useCallback(
    (attrs: Partial<PricingTableAttributes>) => {
      updateAttributes(attrs)
    },
    [updateAttributes]
  )

  const handleUpdateRow = useCallback(
    (id: string, patch: Partial<PricingTableRow>) => {
      const nextRows = (rows as PricingTableRow[]).map((r) =>
        r.id === id ? { ...r, ...patch } : r
      )
      updateAttributes({ rows: nextRows })
    },
    [rows, updateAttributes]
  )

  const handleDeleteRow = useCallback(
    (id: string) => {
      const nextRows = (rows as PricingTableRow[]).filter((r) => r.id !== id)
      if (nextRows.length === 0) return // keep at least one row
      updateAttributes({ rows: nextRows })
    },
    [rows, updateAttributes]
  )

  const handleAddRow = useCallback(() => {
    const nextRows: PricingTableRow[] = [
      ...(rows as PricingTableRow[]),
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        optional: false,
        checked: true,
      },
    ]
    updateAttributes({ rows: nextRows })
  }, [rows, updateAttributes])

  const handleMoveRow = useCallback(
    (fromIndex: number, direction: "up" | "down") => {
      const currentRows = [...(rows as PricingTableRow[])]
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1
      if (toIndex < 0 || toIndex >= currentRows.length) return
      const item = currentRows[fromIndex]
      currentRows.splice(fromIndex, 1)
      currentRows.splice(toIndex, 0, item)
      updateAttributes({ rows: currentRows })
    },
    [rows, updateAttributes]
  )

  const typedRows = rows as PricingTableRow[]

  const headerCellStyle: React.CSSProperties = {
    padding: "8px 10px",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-secondary)",
    borderBottom: "2px solid var(--border-default)",
    backgroundColor: "var(--bg-surface)",
  }

  return (
    <NodeViewWrapper
      data-type="pricingTable"
      className="my-4"
      draggable
      data-drag-handle=""
    >
      <div
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "var(--bg-elevated)",
        }}
      >
        {/* Settings */}
        <SettingsBar
          currency={currency}
          showQuantity={showQuantity}
          discountType={discountType}
          discountValue={discountValue}
          taxRate={taxRate}
          onUpdate={handleUpdate}
        />

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: "60px" }} />
                <th style={{ ...headerCellStyle, width: "36px" }} />
                <th style={{ ...headerCellStyle, textAlign: "left" }}>
                  Description
                </th>
                {showQuantity && (
                  <th
                    style={{
                      ...headerCellStyle,
                      width: "80px",
                      textAlign: "right",
                    }}
                  >
                    Qty
                  </th>
                )}
                <th
                  style={{
                    ...headerCellStyle,
                    width: "130px",
                    textAlign: "right",
                  }}
                >
                  Unit Price
                </th>
                <th
                  style={{
                    ...headerCellStyle,
                    width: "120px",
                    textAlign: "right",
                  }}
                >
                  Total
                </th>
                <th style={{ ...headerCellStyle, width: "70px" }} />
              </tr>
            </thead>
            <tbody>
              {typedRows.map((row, index) => (
                <PricingRow
                  key={row.id}
                  row={row}
                  index={index}
                  totalRows={typedRows.length}
                  currency={currency}
                  showQuantity={showQuantity}
                  onUpdateRow={handleUpdateRow}
                  onDeleteRow={handleDeleteRow}
                  onMoveRow={handleMoveRow}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <div style={{ padding: "8px 12px" }}>
          <button
            type="button"
            onClick={handleAddRow}
            style={{
              background: "none",
              border: "1px dashed var(--border-default)",
              borderRadius: "6px",
              color: "var(--text-secondary)",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "13px",
              width: "100%",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)"
              e.currentTarget.style.borderColor = "var(--accent)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)"
              e.currentTarget.style.borderColor = "var(--border-default)"
            }}
          >
            + Add row
          </button>
        </div>

        {/* Summary */}
        <SummarySection
          rows={typedRows}
          discountType={discountType}
          discountValue={discountValue}
          taxRate={taxRate}
          currency={currency}
        />
      </div>
    </NodeViewWrapper>
  )
}
