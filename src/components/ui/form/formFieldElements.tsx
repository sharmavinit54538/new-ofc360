import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormFieldContext, FormItemContext } from "./formContexts";

export const Form = FormProvider;

export const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => {
  return (<FormFieldContext.Provider value={{ name: props.name }}><Controller {...props} /></FormFieldContext.Provider>);
};

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (<FormItemContext.Provider value={{ id }}><div ref={ref} className={cn("space-y-2", className)} {...props} /></FormItemContext.Provider>);
});
FormItem.displayName = "FormItem";