import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";
import { resolveBookingActions } from "../../utils/bookingActionResolver.js";
import { dispatchBookingCommand } from "../../utils/bookingCommandDispatcher.js";

function JobRow({ booking, statusBadgeKeys, w, c }) {
  const statusKey = statusBadgeKeys[booking.status];
  const statusLabel = useContent(statusKey, booking.status);
  return (
    <div key={booking.id} style={{
      background: w.jobs?.card?.background || c.bgSurface,
      border: w.jobs?.card?.border || `1px solid ${c.border}`,
      borderRadius: w.jobs?.card?.borderRadius || '12px',
      padding: w.jobs?.card?.padding || '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: w.jobs?.header?.marginBottom || '8px' }}>
        <span style={{ fontWeight: w.jobs?.serviceName?.fontWeight || 600, color: w.jobs?.serviceName?.color || c.textPrimary }}>{booking.service_name}</span>
        <span style={{
          fontSize: w.statusBadge?.fontSize || '14px', fontWeight: w.statusBadge?.fontWeight || 700,
          padding: w.statusBadge?.padding || '2px 10px', borderRadius: w.statusBadge?.borderRadius || '12px',
          background: booking.status === 'pending' ? (w.statusPending?.background || '#FED7AA') : (w.statusOther?.background || '#DBEAFE'),
          color: booking.status === 'pending' ? (w.statusPending?.color || c.accentOrange) : (w.statusOther?.color || c.accentBlue),
        }}>{statusLabel}</span>
      </div>
      <div style={{ fontSize: w.jobs?.info?.fontSize || '14px', color: w.jobs?.info?.color || c.textSecondary, marginBottom: w.jobs?.info?.marginBottom || '12px' }}>
        {booking.services_snapshot?.length > 0 ? (
          <>
            <strong>Services:</strong> {booking.services_snapshot.slice(0,2).map(s=>s.label).join(', ')}
            {booking.services_snapshot.length>2&&` +${booking.services_snapshot.length-2} more`}
            <div style={{ fontSize:'var(--font-body)', fontWeight:700, color:'var(--accent-green)', marginTop:4 }}>
              Rs {parseFloat(booking.booking_total_price||booking.price).toLocaleString()}
            </div>
          </>
        ) : (
          <>Customer: {booking.customer_name} | {booking.job_size}<div style={{fontSize:'10px',opacity:.7,marginTop:2}}>Booking #{booking.id}</div></>
        )}
      </div>
      {resolveBookingActions(booking).length > 0 && (
        <div style={{ display:'flex', gap: w.jobs?.actions?.gap || '8px', marginTop:'10px' }}>
          {resolveBookingActions(booking).map(btn => (
            <button key={btn.id} onClick={async e=>{ e.stopPropagation(); try{ await dispatchBookingCommand({ action:btn.action, bookingId:booking.id }); }catch(err){ alert(err.message); } }} style={{
              padding: w.jobs?.actionBtn?.padding || '8px 16px', borderRadius: w.jobs?.actionBtn?.borderRadius || '8px',
              border: btn.variant==='danger'?`1px solid ${c.border}`:'none',
              background: btn.variant==='success'?c.accentGreen: btn.variant==='danger'?'transparent':c.accentBlue,
              color: btn.variant==='danger'?c.textSecondary:'#fff', cursor:'pointer', fontSize:'14px', fontWeight:600,
            }}>{btn.label}</button>
          ))}
        </div>
      )}
      {(booking.status==='accepted'||booking.status==='onway') && booking.id && (
        <div style={{ marginTop:8, textAlign:'right' }}>
          <button onClick={e=>{ e.stopPropagation(); window.location.href=`/inbox?bookingId=${booking.id}` }} style={{
            padding:'6px 14px', borderRadius:'var(--radius-sm)', border:'1px solid var(--accent-blue)',
            background:'var(--accent-blue-light)', color:'var(--accent-blue)', fontSize:12, fontWeight:600, cursor:'pointer'
          }}>💬 Message</button>
        </div>
      )}
    </div>
  );
}

export default function JobCardRenderer({ elementConfig, overrideData }) {
  const c = config.colors;
  const w = config.worker;
  const bookings = overrideData?.bookings || [];
  const statusBadgeKeys = elementConfig.content?.statusBadgeKeys || {};
  const emptyMsg = useContent("empty.noBookings", "No job requests yet.");

  if (bookings.length === 0) {
    return <div style={{ textAlign:'center', padding: w.jobs?.empty?.padding || '40px', color: w.jobs?.empty?.color || c.textSecondary }}>{emptyMsg}</div>;
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: w.jobs?.list?.gap || '12px' }}>
      {bookings.map(booking => (
        <JobRow key={booking.id} booking={booking} statusBadgeKeys={statusBadgeKeys} w={w} c={c} />
      ))}
    </div>
  );
}