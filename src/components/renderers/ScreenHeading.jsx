import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function ScreenHeading({ elementConfig, overrideData }) {
  const c = config.colors; const w = config.worker; const f = config.font;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const title = useContent(elementConfig.content?.titleKey, "");
  const ws = w.jobs?.heading || w.earnings?.heading || w.schedule?.heading || {};
  return (
    <h2 style={{
      fontSize: ws.fontSize || f.heading || '24px', fontWeight: ws.fontWeight || 700,
      color: ws.color || c.textPrimary, marginBottom: ws.marginBottom || '20px', ...overrideStyles,
    }}>{title}</h2>
  );
}