import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShopNowButtonProps extends React.ComponentProps<"button"> {
  label?: string
}

function ShopNowButton({ label = "Shop Now", className, onClick, disabled, ...props }: ShopNowButtonProps) {
  return (
    <Button
      className={cn("shop-now-btn", className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </Button>
  )
}

export { ShopNowButton }
