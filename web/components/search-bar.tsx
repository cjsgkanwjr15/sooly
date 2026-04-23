"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    const next = new URLSearchParams(params);
    if (q) next.set("q", q);
    else next.delete("q");
    startTransition(() => {
      router.push(`/products${next.toString() ? `?${next.toString()}` : ""}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <Input
        type="search"
        placeholder="제품·양조장 검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 w-40 sm:w-56"
        aria-label="검색"
      />
    </form>
  );
}
