import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({
  className,
  children,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300",
        hover &&
          "hover:shadow-xl hover:-translate-y-1 hover:border-primary-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-2 pb-6", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-h3 font-bold leading-tight tracking-tight text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}
