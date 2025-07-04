"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Package } from "lucide-react";
import { handleAPICall, methodENUM } from "@/lib/api";
import { toast } from "sonner";

interface PackageSize {
  _id: string;
  sizeName: string;
  sizeValue?: string;
  sizeUnit?: string;
}

export default function PackageSizesPage() {
  const [packageSizes, setPackageSizes] = useState<PackageSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    sizeName: "",
    sizeValue: "",
    sizeUnit: "",
  });

  useEffect(() => {
    fetchPackageSizes();
  }, []);

  const fetchPackageSizes = async () => {
    try {
      const response = await handleAPICall("/api/package-size", methodENUM.GET);
      if (response?.data) {
        setPackageSizes(response.data);
      }
    } catch (error) {
      console.error("Error fetching package sizes:", error);
      toast.error("Failed to fetch package sizes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await handleAPICall("/api/package-size", methodENUM.POST, formData);
      if (response?.success) {
        toast.success("Package size created successfully!");
        setFormData({ sizeName: "", sizeValue: "", sizeUnit: "" });
        setShowForm(false);
        fetchPackageSizes();
      } else {
        toast.error(response?.error || "Failed to create package size");
      }
    } catch (error) {
      console.error("Error creating package size:", error);
      toast.error("An error occurred while creating the package size");
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-4 w-full h-full">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Package Size Management</h1>
          <p className="text-muted-foreground">Manage product package sizes</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Package Size"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Package Size</CardTitle>
            <CardDescription>Create a new package size option</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizeName">Size Name *</Label>
                  <Input
                    id="sizeName"
                    value={formData.sizeName}
                    onChange={(e) => handleInputChange("sizeName", e.target.value)}
                    placeholder="e.g., Small, Medium, Large"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeValue">Size Value</Label>
                  <Input
                    id="sizeValue"
                    value={formData.sizeValue}
                    onChange={(e) => handleInputChange("sizeValue", e.target.value)}
                    placeholder="e.g., 250, 500, 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeUnit">Size Unit</Label>
                  <Input
                    id="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={(e) => handleInputChange("sizeUnit", e.target.value)}
                    placeholder="e.g., ml, g, oz"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2"
                >
                  {formLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create Package Size
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Package Sizes</CardTitle>
          <CardDescription>All available package size options</CardDescription>
        </CardHeader>
        <CardContent>
          {packageSizes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No package sizes found. Create your first package size above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size Name</TableHead>
                  <TableHead>Size Value</TableHead>
                  <TableHead>Size Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageSizes.map((packageSize) => (
                  <TableRow key={packageSize._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-sm">
                          {packageSize.sizeName}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {packageSize.sizeValue || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {packageSize.sizeUnit || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 