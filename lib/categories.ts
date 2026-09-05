import { Zap, Users, ShoppingCart, Car, Home, MoreHorizontal, type LucideIcon } from "lucide-react"
import { Category as PrismaCategory } from "@/lib/generated/prisma/client"


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

// Frontend (lowercase) -> Database (UPPERCASE)
export function toDbCategory(id: CategoryId): PrismaCategory {
  return id.toUpperCase() as PrismaCategory
}

// Database (UPPERCASE) -> Frontend (lowercase)
export function fromDbCategory(category: PrismaCategory): CategoryId {
  return category.toLowerCase() as CategoryId
}