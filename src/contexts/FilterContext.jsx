import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
import Toast from '../components/Toast'
import { classNames } from "../utils";

export const FilterContext = React.createContext()

export function useFilter() {
    return useContext(FilterContext)
}

export default function FilterProvider({ children }) {
    const [filters, setFilters] = useState({})

    const value = {
        filters,
        setFilters,
    }

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

