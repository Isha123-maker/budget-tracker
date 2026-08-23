import { Zap, Users, ShoppingCart, Car, Home, MoreHorizontal, type LucideIcon } from "lucide-react"

export type CategoryId = "utilities" | "committees" | "groceries" | "transport" | "rent" | "other"

export interface Category {
  id: CategoryId
  label: string
  icon: LucideIcon
}

export const CATEGORIES: Category[] = [
  { id: "utilities", label: "Utilities", icon: Zap },
  { id: "committees", label: "Committees", icon: Users },
  { id: "groceries", label: "Groceries", icon: ShoppingCart },
  { id: "transport", label: "Transport", icon: Car },
  { id: "rent", label: "Rent", icon: Home },
  { id: "other", label: "Other", icon: MoreHorizontal },
]

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`
}