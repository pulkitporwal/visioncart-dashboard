"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { handleAPICall, methodENUM } from "@/lib/api";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [packageSizes, setPackageSizes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    brand: "",
    barcode: "",
    category: [] as string[],
    productImages: [] as string[],
    prices: [{ platform: "", price: "" }],
    packageSize: "" as string,
    otherAvailablePackageSize: [] as string[],
    ingredients: [{ ingredient: "", ingredientQuantity: "" }],
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [categoriesRes, packageSizesRes, ingredientsRes] = await Promise.all([
        handleAPICall("/api/category", methodENUM.GET),
        handleAPICall("/api/package-size", methodENUM.GET),
        handleAPICall("/api/ingredient", methodENUM.GET),
      ]);

      if (categoriesRes) setCategories(categoriesRes);
      if (packageSizesRes) setPackageSizes(packageSizesRes);
      if (ingredientsRes) setIngredients(ingredientsRes);
    } catch (error) {
      console.error("Error fetching form data:", error);
      toast.error("Failed to load form data");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (index: number, field: string, value: string) => {
    const newPrices = [...formData.prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setFormData(prev => ({ ...prev, prices: newPrices }));
  };

  const addPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, { platform: "", price: "" }]
    }));
  };

  const removePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: "", ingredientQuantity: "" }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({
      ...formData,
      category: formData.category.includes(categoryId)
        ? formData.category.filter(id => id !== categoryId)
        : [...formData.category, categoryId]
    });
  };

  const handlePackageSizeChange = (packageSizeId: string) => {
    setFormData({
      ...formData,
      otherAvailablePackageSize: formData.otherAvailablePackageSize.includes(packageSizeId)
        ? formData.otherAvailablePackageSize.filter(id => id !== packageSizeId)
        : [...formData.otherAvailablePackageSize, packageSizeId]
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      productImages: [...formData.productImages, ...imageUrls]
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await handleAPICall("/api/product", methodENUM.POST, formData);
      
      if (response) {
        toast.success("Product created successfully!");
        router.push("/dashboard/products");
      } 
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An error occurred while creating the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 border"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Product</h1>
          <p className="text-muted-foreground">Add a new product to your inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 py-5">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  placeholder="Enter product barcode"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange("productDescription", e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select product categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category: any) => (
                  <div key={category._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={category._id}
                      checked={formData.category.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="rounded"
                    />
                    <Label htmlFor={category._id} className="text-sm">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Images</span>
                  </div>
                </Label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {formData.productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.productImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Size</CardTitle>
              <CardDescription>Select primary package size and other available sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="packageSize">Primary Package Size</Label>
                <Select
                  value={formData.packageSize}
                  onValueChange={(value) => handleInputChange("packageSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary package size" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageSizes.map((packageSize: any) => (
                      <SelectItem key={packageSize._id} value={packageSize._id}>
                        {packageSize.sizeName} ({packageSize.sizeValue} {packageSize.sizeUnit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Other Available Sizes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {packageSizes.map((packageSize: any) => (
                    <div key={packageSize._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`other-${packageSize._id}`}
                        checked={formData.otherAvailablePackageSize.includes(packageSize._id)}
                        onChange={() => handlePackageSizeChange(packageSize._id)}
                        className="rounded"
                      />
                      <Label htmlFor={`other-${packageSize._id}`} className="text-sm">
                        {packageSize.sizeName} ({packageSize.sizeValue} {packageSize.sizeUnit})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set prices for different platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.prices.map((price, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Platform (e.g., Amazon, Walmart)"
                      value={price.platform}
                      onChange={(e) => handlePriceChange(index, "platform", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Price"
                      value={price.price}
                      onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                    />
                  </div>
                  {formData.prices.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrice(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPrice}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Price
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>List the ingredients and their quantities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select
                      value={ingredient.ingredient}
                      onValueChange={(value) => handleIngredientChange(index, "ingredient", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((ing: any) => (
                          <SelectItem key={ing._id} value={ing._id}>
                            {ing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Quantity"
                      value={ingredient.ingredientQuantity}
                      onChange={(e) => handleIngredientChange(index, "ingredientQuantity", e.target.value)}
                    />
                  </div>
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 