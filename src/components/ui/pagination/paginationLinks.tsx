import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { PaginationItem } from "./paginationItems";

export type PaginationLinkProps = { isActive?: boolean } & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;
export const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (<a aria-current={isActive ? "page" : undefined} className={cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size }), className)} {...props} />);
export const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (<PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}><ChevronLeft className="h-4 w-4" /><span>Previous</span></PaginationLink>);
export const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (<PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}><span>Next</span><ChevronRight className="h-4 w-4" /></PaginationLink>);
export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (<span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}><MoreHorizontal className="h-4 w-4" /><span className="sr-only">More pages</span></span>);