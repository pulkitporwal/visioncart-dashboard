"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { handleAPICall, methodENUM } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleAPICall("/api/product", methodENUM.GET);

        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage and create products</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/products/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
