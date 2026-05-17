import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function StatusBanner({ elementConfig, overrideData }) {
  const c = config.colors;
  const w = config.worker;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const isOnline = overrideData?.isOnline ?? false;
  const txt = overrideData?.txt || {};
  const onlineTitle = txt.online || useContent(elementConfig.content?.onlineTitleKey, "You are online");
  const offlineTitle = txt.offline || useContent(elementConfig.content?.offlineTitleKey, "You are offline");
  const onlineSub = txt.receiving || useContent(elementConfig.content?.onlineSubtitleKey, "Receiving job requests");
  const offlineSub = txt.goOnline || useContent(elementConfig.content?.offlineSubtitleKey, "Go online");

  const nodeId = `${elementConfig.screen}.${elementConfig.id}`;
  return (
    <div data-node-id={nodeId} data-node-type={elementConfig.type} style={{ display: 'contents' }}>
      <div style={{
        background: isOnline ? (w.statusBannerOnline?.background || '#D1FAE5') : (w.statusBannerOffline?.background || '#FEE2E2'),
        borderLeft: `4px solid ${isOnline ? (w.statusBannerOnline?.borderLeftColor || c.accentGreen) : (w.statusBannerOffline?.borderLeftColor || c.accentRed)}`,
        padding: w.statusBanner?.padding || '14px 18px',
        marginBottom: w.statusBanner?.marginBottom || '20px',
        display: 'flex', alignItems: 'center', gap: w.statusBanner?.gap || '10px',
        ...overrideStyles,
      }}>
        <span style={{ fontSize: w.statusDot?.fontSize || '24px' }}>{isOnline ? '🟢' : '🔴'}</span>
        <div>
          <div style={{
            fontSize: w.statusTitle?.fontSize || '14px', fontWeight: w.statusTitle?.fontWeight || 600,
            color: isOnline ? (w.statusBannerOnline?.borderLeftColor || c.accentGreen) : (w.statusBannerOffline?.borderLeftColor || c.accentRed),
          }}>{isOnline ? onlineTitle : offlineTitle}</div>
          <div style={{ fontSize: w.statusSubtitle?.fontSize || '12px', color: w.statusSubtitle?.color || c.textSecondary }}>
            {isOnline ? onlineSub : offlineSub}
          </div>
        </div>
      </div>
    </div>
  );
}