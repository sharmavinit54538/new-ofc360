import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />);
export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />);
export const DrawerTitle = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>>(({ className, ...props }, ref) => (<DrawerPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />));
export const DrawerDescription = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>>(({ className, ...props }, ref) => (<DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />));