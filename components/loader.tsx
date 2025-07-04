import { Loader2 } from "lucide-react";
import React from "react";

const LoaderComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default LoaderComponent;
