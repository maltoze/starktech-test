"use client";

import {
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { IRespStockOption, IStockOption } from "../types";

interface ApiResponse {
  msg: string;
  status: number;
  data: IRespStockOption[];
  total: number;
  originalTotal?: number;
}

interface SearchAutoCompleteProps {
  onValueChange?: (value: IStockOption | null) => void;
}

export default function SearchAutoComplete({
  onValueChange,
}: SearchAutoCompleteProps) {
  const [stockOptions, setStockOptions] = useState<IStockOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fetchStockOptions = async (searchQuery?: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/stock-options?stock_id=${searchQuery ?? ""}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === 200) {
        const formattedOptions: IStockOption[] = data.data.map((stock) => ({
          label: `${stock.stock_name} (${stock.stock_id})`,
          value: stock.stock_id,
        }));
        setStockOptions(formattedOptions);
      } else {
        throw new Error(data.msg || "Failed to fetch stock options");
      }
    } catch (err) {
      console.error("Error fetching stock options:", err);
      setStockOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchStockOptions = useMemo(
    () =>
      debounce((searchQuery?: string) => {
        fetchStockOptions(searchQuery);
      }, 300),
    []
  );

  useEffect(() => {
    fetchStockOptions();
  }, []);

  useEffect(() => {
    return () => {
      debouncedFetchStockOptions.cancel();
    };
  }, [debouncedFetchStockOptions]);

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);

    // 检查是否选择了某个选项
    const selectedOption = stockOptions.find(
      (option) => option.label === newInputValue
    );
    if (selectedOption) {
      onValueChange?.(selectedOption);
      return;
    }

    if (newInputValue && /^[0-9A-Za-z]+$/.test(newInputValue)) {
      debouncedFetchStockOptions(newInputValue);
    } else if (!newInputValue) {
      debouncedFetchStockOptions.cancel();
      onValueChange?.(null);
      fetchStockOptions();
    }
  };

  return (
    <div className="w-full max-w-[400px] px-4">
      <Autocomplete
        options={stockOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.label
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
        freeSolo
        disableClearable
        loading={loading}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="輸入台／美股代號，查看公司價值"
            size="small"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Search className="text-black/54" />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
    </div>
  );
}
