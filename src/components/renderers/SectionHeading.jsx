import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function SectionHeading({ elementConfig, overrideData }) {
  const c = config.colors; const f = config.font; const w = config.worker;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const title = useContent(elementConfig.content?.titleKey, "");
  const we = w.earnings || {};
  return (
    <h3 style={{
      fontSize: we.subheading?.fontSize || f.title || '20px', fontWeight: we.subheading?.fontWeight || 700,
      color: we.subheading?.color || c.textPrimary, marginBottom: we.subheading?.marginBottom || '12px', ...overrideStyles,
    }}>{title}</h3>
  );
}