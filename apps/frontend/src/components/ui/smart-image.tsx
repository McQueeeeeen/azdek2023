"use client";

import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  fallbackSrc = "/media/laundry-gel.svg",
  alt,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = useMemo(() => (failed ? fallbackSrc : src), [failed, fallbackSrc, src]);

  return <Image {...props} src={resolvedSrc} alt={alt} onError={() => setFailed(true)} />;
}
