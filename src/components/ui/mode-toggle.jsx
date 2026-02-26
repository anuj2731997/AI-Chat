"use client";

import * as React from "react";
import { Sunrise, Sunset } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null;

  const isLight = resolvedTheme === "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      {isLight ? (
        <Sunset className="size-5" />
      ) : (
        <Sunrise className="size-5" />
      )}
    </Button>
  );
}