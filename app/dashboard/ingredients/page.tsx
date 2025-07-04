"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Loader2, Leaf } from "lucide-react";
import { handleAPICall, methodENUM } from "@/lib/api";
import { toast } from "sonner";

interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  commonUses: string[];
  healthFlag: "good" | "neutral" | "bad" | "dangerous";
  healthTags: string[];
  sources: string[];
  references: string[];
  createdAt: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commonUses: "",
    healthFlag: "neutral" as "good" | "neutral" | "bad" | "dangerous",
    healthTags: "",
    sources: "",
    references: "",
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await handleAPICall("/api/ingredient", methodENUM.GET);
      if (response) {
        setIngredients(response);
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      toast.error("Failed to fetch ingredients");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        commonUses: formData.commonUses.split(',').map(s => s.trim()).filter(s => s),
        healthFlag: formData.healthFlag,
        healthTags: formData.healthTags.split(',').map(s => s.trim()).filter(s => s),
        sources: formData.sources.split(',').map(s => s.trim()).filter(s => s),
        references: formData.references.split(',').map(s => s.trim()).filter(s => s),
      };

      const response = await handleAPICall("/api/ingredient", methodENUM.POST, submitData);
      if (response?.success) {
        toast.success("Ingredient created successfully!");
        setFormData({
          name: "",
          description: "",
          commonUses: "",
          healthFlag: "neutral",
          healthTags: "",
          sources: "",
          references: "",
        });
        setShowForm(false);
        fetchIngredients();
      } else {
        toast.error(response?.error || "Failed to create ingredient");
      }
    } catch (error) {
      console.error("Error creating ingredient:", error);
      toast.error("An error occurred while creating the ingredient");
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

  const getHealthFlagColor = (flag: string) => {
    switch (flag) {
      case "good": return "bg-green-100 text-green-800";
      case "neutral": return "bg-gray-100 text-gray-800";
      case "bad": return "bg-yellow-100 text-yellow-800";
      case "dangerous": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <h1 className="text-2xl font-bold">Ingredient Management</h1>
          <p className="text-muted-foreground">Manage product ingredients</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Ingredient"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Ingredient</CardTitle>
            <CardDescription>Create a new ingredient with health information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ingredient Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter ingredient name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthFlag">Health Flag</Label>
                  <Select
                    value={formData.healthFlag}
                    onValueChange={(value) => handleInputChange("healthFlag", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health flag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="bad">Bad</SelectItem>
                      <SelectItem value="dangerous">Dangerous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter ingredient description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commonUses">Common Uses (comma-separated)</Label>
                  <Input
                    id="commonUses"
                    value={formData.commonUses}
                    onChange={(e) => handleInputChange("commonUses", e.target.value)}
                    placeholder="e.g., preservative, flavoring, coloring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthTags">Health Tags (comma-separated)</Label>
                  <Input
                    id="healthTags"
                    value={formData.healthTags}
                    onChange={(e) => handleInputChange("healthTags", e.target.value)}
                    placeholder="e.g., natural, organic, artificial"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sources">Sources (comma-separated)</Label>
                  <Input
                    id="sources"
                    value={formData.sources}
                    onChange={(e) => handleInputChange("sources", e.target.value)}
                    placeholder="e.g., plant-based, synthetic, animal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="references">References (comma-separated)</Label>
                  <Input
                    id="references"
                    value={formData.references}
                    onChange={(e) => handleInputChange("references", e.target.value)}
                    placeholder="e.g., FDA, WHO, scientific papers"
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
                  Create Ingredient
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>All available ingredients with health information</CardDescription>
        </CardHeader>
        <CardContent>
          {ingredients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ingredients found. Create your first ingredient above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Health Flag</TableHead>
                  <TableHead>Common Uses</TableHead>
                  <TableHead>Health Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{ingredient.name}</div>
                          {ingredient.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {ingredient.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getHealthFlagColor(ingredient.healthFlag)}>
                        {ingredient.healthFlag}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ingredient.commonUses.slice(0, 2).map((use, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                        {ingredient.commonUses.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{ingredient.commonUses.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ingredient.healthTags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {ingredient.healthTags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{ingredient.healthTags.length - 2} more
                          </Badge>
                        )}
                      </div>
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