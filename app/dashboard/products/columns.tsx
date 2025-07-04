"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Edit, Trash2, Package, Tag } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { IProduct } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={product.productImages?.[0] || ""} 
              alt={product.productName}
            />
            <AvatarFallback>
              {product.productName?.charAt(0)?.toUpperCase() || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{product.productName}</span>
            <span className="text-sm text-muted-foreground">
              {product.barcode}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Brand
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-fit">
        {row.original.brand || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.category;
      if (!categories || categories.length === 0) {
        return <span className="text-muted-foreground">No category</span>;
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(categories) ? 
            categories.map((cat: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {cat.name || cat}
              </Badge>
            )) : 
            <Badge variant="outline" className="text-xs">
              {categories.name || categories}
            </Badge>
          }
        </div>
      );
    },
  },
  {
    accessorKey: "prices",
    header: "Prices",
    cell: ({ row }) => {
      const prices = row.original.prices;
      if (!prices || prices.length === 0) {
        return <span className="text-muted-foreground">No prices</span>;
      }
      
      return (
        <div className="flex flex-col gap-1">
          {prices.map((price: any, index: number) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              <Tag className="h-3 w-3" />
              <span className="font-medium">{price.platform}:</span>
              <span>${price.price}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "packageSize",
    header: "Package Size",
    cell: ({ row }) => {
      const packageSize = row.original.packageSize;
      if (!packageSize) {
        return <span className="text-muted-foreground">No size</span>;
      }
      
      return (
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {packageSize.sizeName} ({packageSize.sizeValue} {packageSize.sizeUnit})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "ingredients",
    header: "Ingredients",
    cell: ({ row }) => {
      const ingredients = row.original.ingredients;
      if (!ingredients || ingredients.length === 0) {
        return <span className="text-muted-foreground">No ingredients</span>;
      }
      
      const displayCount = 2;
      const totalCount = ingredients.length;
      
      return (
        <div className="flex flex-col gap-1">
          {ingredients.slice(0, displayCount).map((ingredient: any, index: number) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              <span>•</span>
              <span>{ingredient.ingredient?.name || ingredient.ingredient}</span>
              {ingredient.ingredientQuantity && (
                <span className="text-muted-foreground">
                  ({ingredient.ingredientQuantity})
                </span>
              )}
            </div>
          ))}
          {totalCount > displayCount && (
            <span className="text-xs text-muted-foreground">
              +{totalCount - displayCount} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productReview",
    header: "Rating",
    cell: ({ row }) => {
      const review = row.original.productReview;
      if (!review) {
        return <span className="text-muted-foreground">No reviews</span>;
      }
      
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">{review.averageRating?.toFixed(1) || "N/A"}</span>
            <span className="text-sm text-muted-foreground ml-1">/5</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({review.totalReviews || 0} reviews)
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
