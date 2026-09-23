"use client";

import { useState } from "react";
import { companyBrands } from "@/lib/visual-cases";

export function BrandMark({ company }: { company: string }) {
  const [failed, setFailed] = useState(false);
  const brand = companyBrands[company.toLowerCase()];
  return (
    <span className="brand-mark">
      {brand?.file && !failed ? (
        <img
          src={`/brands/${brand.file}.png`}
          alt={`${company} logo`}
          width={240}
          height={80}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="brand-fallback">{company}</span>
      )}
    </span>
  );
}
