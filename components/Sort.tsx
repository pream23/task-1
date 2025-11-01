"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/contants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SortProps {
  className?: string;
}

const Sort = ({ className }: SortProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current sort value from URL or default to newest first
  const currentSort = searchParams.get("sort") || "$createdAt-desc";
  const [selectedSort, setSelectedSort] = useState(currentSort);

  // Update local state when URL changes (for back/forward navigation)
  useEffect(() => {
    const urlSort = searchParams.get("sort") || "$createdAt-desc";
    setSelectedSort(urlSort);
  }, [searchParams]);

  // Create query string with updated sort parameter
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      
      // Reset to first page when sorting changes
      params.delete("page");
      
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    
    // Update URL with new sort parameter
    const queryString = createQueryString("sort", value);
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use replace to avoid adding to browser history for each sort change
    router.replace(newUrl, { scroll: false });
  };

  return (
    <Select value={selectedSort} onValueChange={handleSortChange}>
      <SelectTrigger className={`sort-select ${className || ""}`}>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="sort-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;