/**
 * Transactional email rendering + dispatch.
 *
 * How it works:
 * 1. Calling code constructs an email payload (subject, html, text)
 * 2. We write a doc to the `mail` collection in Firestore
 * 3. The Firebase "Trigger Email" extension watches that collection and
 *    actually sends the email via the SMTP provider configured during install
 *
 * Setup is one-time and lives in the Firebase Console — no Cloud Functions
 * to write or deploy on our end.
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Order, OrderStatus } from './db';
import { courierLabel, getCourierTrackingUrl } from './couriers';
import { formatPrice } from './utils';

// ─── Brand constants ─────────────────────────────────────────────
// Tweak any of these and every email picks up the change.
const BRAND = {
  name: 'Shop Ash',
  tagline: 'Maison de Horlogerie',
  primaryColor: '#a67c00',
  foregroundColor: '#111111',
  mutedColor: '#6B6B6B',
  borderColor: '#E5E2DC',
  softBg: '#F5F3EE',
};

const siteUrl = (): string => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theshopash-9f604.firebaseapp.com';
};

// ─── Low-level send queue ────────────────────────────────────────
interface MailMessage {
  to: string | string[];
  bcc?: string;
  message: { subject: string; html: string; text: string };
}

export const sendEmail = async (m: MailMessage): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, 'mail'), {
      ...m,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Email failure should never break the underlying business action
    console.error('[Emails] Failed to queue mail:', error);
  }
};

// ─── HTML helpers ────────────────────────────────────────────────
const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderItemsTable = (order: Order): string => {
  const rows = order.products
    .map(
      (p) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid ${BRAND.borderColor};vertical-align:top;width:64px;">
          ${
            p.image
              ? `<img src="${escapeHtml(
                  p.image
                )}" width="56" height="64" alt="" style="display:block;width:56px;height:64px;object-fit:cover;background:${BRAND.softBg};border:0;" />`
              : `<div style="width:56px;height:64px;background:${BRAND.softBg};"></div>`
          }
        </td>
        <td style="padding:14px 0 14px 16px;border-bottom:1px solid ${BRAND.borderColor};vertical-align:top;">
          ${
            p.brand
              ? `<div style="font:500 10px/1.6 Helvetica,Arial,sans-serif;letter-spacing:3px;color:${BRAND.primaryColor};text-transform:uppercase;margin-bottom:4px;">${escapeHtml(
                  p.brand
                )}</div>`
              : ''
          }
          <div style="font:300 16px/1.3 Georgia,'Times New Roman',serif;color:${BRAND.foregroundColor};">${escapeHtml(
            p.title
          )}</div>
          <div style="font:400 12px/1.5 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};margin-top:6px;">Qty ${
            p.quantity
          } · ${escapeHtml(formatPrice(p.pricePKR, 'PKR'))}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid ${BRAND.borderColor};vertical-align:top;text-align:right;font:500 14px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.foregroundColor};white-space:nowrap;">
          ${escapeHtml(formatPrice(p.pricePKR * p.quantity, 'PKR'))}
        </td>
      </tr>`
    )
    .join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-top:8px;">
      ${rows}
      <tr>
        <td colspan="2" style="padding:18px 0 4px 0;font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">Subtotal</td>
        <td style="padding:18px 0 4px 0;text-align:right;font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">${escapeHtml(
          formatPrice(order.totalPricePKR, 'PKR')
        )}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:4px 0;font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">Shipping</td>
        <td style="padding:4px 0;text-align:right;font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.primaryColor};">Complimentary</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:14px 0 0 0;border-top:1px solid ${BRAND.borderColor};font:500 14px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.foregroundColor};text-transform:uppercase;letter-spacing:2px;">Total</td>
        <td style="padding:14px 0 0 0;border-top:1px solid ${BRAND.borderColor};text-align:right;font:300 22px/1.2 Georgia,'Times New Roman',serif;color:${BRAND.primaryColor};white-space:nowrap;">${escapeHtml(
          formatPrice(order.totalPricePKR, 'PKR')
        )}</td>
      </tr>
    </table>`;
};

interface ShellParams {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const renderEmailShell = ({
  preheader,
  eyebrow,
  heading,
  intro,
  body,
  ctaLabel,
  ctaUrl,
}: ShellParams): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.softBg};font-family:Helvetica,Arial,sans-serif;color:${BRAND.foregroundColor};">
  <!-- Preheader (hidden in body but appears in inbox preview) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.softBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid ${BRAND.borderColor};">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 32px 24px 32px;border-bottom:1px solid ${BRAND.borderColor};">
              <div style="font:300 26px/1 Georgia,'Times New Roman',serif;letter-spacing:8px;color:${BRAND.foregroundColor};">SHOP ASH</div>
              <div style="font:500 9px/1 Helvetica,Arial,sans-serif;letter-spacing:5px;color:${BRAND.mutedColor};text-transform:uppercase;margin-top:8px;">${BRAND.tagline}</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 24px 32px;">
              <div style="font:500 10px/1 Helvetica,Arial,sans-serif;letter-spacing:5px;color:${BRAND.primaryColor};text-transform:uppercase;margin-bottom:16px;">${escapeHtml(eyebrow)}</div>
              <h1 style="margin:0 0 16px 0;font:300 28px/1.2 Georgia,'Times New Roman',serif;color:${BRAND.foregroundColor};">${escapeHtml(heading)}</h1>
              <p style="margin:0 0 24px 0;font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">${intro}</p>
              ${body}
              ${
                ctaLabel && ctaUrl
                  ? `
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td style="background:${BRAND.foregroundColor};padding:14px 32px;">
                    <a href="${escapeHtml(ctaUrl)}" style="font:600 11px/1 Helvetica,Arial,sans-serif;letter-spacing:3px;color:#ffffff;text-decoration:none;text-transform:uppercase;">${escapeHtml(ctaLabel)}</a>
                  </td>
                </tr>
              </table>`
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px;border-top:1px solid ${BRAND.borderColor};background:${BRAND.softBg};">
              <p style="margin:0 0 10px 0;font:400 12px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">
                Questions? Reply to this email or contact our concierge team.
              </p>
              <p style="margin:0;font:400 11px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">
                <a href="${siteUrl()}" style="color:${BRAND.primaryColor};text-decoration:none;">theshopash.com</a>
                · concierge@shopash.com
              </p>
              <p style="margin:16px 0 0 0;font:500 9px/1.4 Helvetica,Arial,sans-serif;letter-spacing:3px;color:${BRAND.mutedColor};text-transform:uppercase;">© ${new Date().getFullYear()} Shop Ash · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const renderText = (lines: string[]): string => lines.filter(Boolean).join('\n');

// ─── Email: order confirmation ───────────────────────────────────
export const buildOrderConfirmationEmail = (order: Order) => {
  const orderUrl = order.userId
    ? `${siteUrl()}/account/orders/${order.id}`
    : `${siteUrl()}/track`;

  const itemsTable = renderItemsTable(order);

  const shippingBlock = `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:32px;border:1px solid ${BRAND.borderColor};">
      <tr>
        <td style="padding:18px 22px;background:${BRAND.softBg};font:500 10px/1 Helvetica,Arial,sans-serif;letter-spacing:4px;color:${BRAND.mutedColor};text-transform:uppercase;">Shipping to</td>
      </tr>
      <tr>
        <td style="padding:18px 22px;font:400 14px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.foregroundColor};">
          ${escapeHtml(order.customerName)}<br/>
          <span style="color:${BRAND.mutedColor};">${escapeHtml(order.address)}<br/>${escapeHtml(order.country)}<br/>${escapeHtml(order.phone)}</span>
        </td>
      </tr>
    </table>`;

  const orderMeta = `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="padding:14px 18px;background:${BRAND.softBg};border-left:2px solid ${BRAND.primaryColor};">
          <div style="font:500 10px/1 Helvetica,Arial,sans-serif;letter-spacing:4px;color:${BRAND.mutedColor};text-transform:uppercase;">Order number</div>
          <div style="font:300 22px/1.2 Georgia,'Times New Roman',serif;color:${BRAND.foregroundColor};margin-top:6px;letter-spacing:2px;">${escapeHtml(order.id ?? '')}</div>
        </td>
      </tr>
    </table>`;

  const html = renderEmailShell({
    preheader: `Thank you for your order ${order.id}. We've received it and will be in touch shortly.`,
    eyebrow: 'Order Confirmed',
    heading: 'Thank you for your order',
    intro: `We've received your order and our concierge team is preparing it for authentication and dispatch. You'll receive an update as soon as it ships.`,
    body: orderMeta + itemsTable + shippingBlock,
    ctaLabel: 'View order',
    ctaUrl: orderUrl,
  });

  const text = renderText([
    `Thank you for your order from Shop Ash.`,
    ``,
    `Order: ${order.id}`,
    `Total: ${formatPrice(order.totalPricePKR, 'PKR')}`,
    ``,
    `Items:`,
    ...order.products.map(
      (p) => `  · ${p.title} x ${p.quantity} — ${formatPrice(p.pricePKR * p.quantity, 'PKR')}`
    ),
    ``,
    `Shipping to:`,
    `  ${order.customerName}`,
    `  ${order.address}, ${order.country}`,
    `  ${order.phone}`,
    ``,
    `Track or view your order: ${orderUrl}`,
    ``,
    `— Shop Ash`,
  ]);

  return {
    to: order.email,
    message: {
      subject: `Your order has been confirmed · ${order.id}`,
      html,
      text,
    },
  };
};

// ─── Email: shipped ─────────────────────────────────────────────
export const buildShippedEmail = (order: Order) => {
  const orderPageUrl = order.userId
    ? `${siteUrl()}/account/orders/${order.id}`
    : `${siteUrl()}/track`;

  const courierName = courierLabel(order.courier);
  const courierTrackUrl = getCourierTrackingUrl(order.courier, order.trackingNumber);
  const ctaUrl = courierTrackUrl ?? orderPageUrl;
  const ctaLabel = courierTrackUrl ? `Track with ${courierName}` : 'Track order';

  const trackingBlock = order.trackingNumber
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;border:1px solid ${BRAND.primaryColor};">
        <tr>
          <td style="padding:18px 22px;">
            <div style="font:500 10px/1 Helvetica,Arial,sans-serif;letter-spacing:4px;color:${BRAND.primaryColor};text-transform:uppercase;">Courier · ${escapeHtml(courierName)}</div>
            <div style="font:500 18px/1.2 Helvetica,Arial,sans-serif;color:${BRAND.foregroundColor};margin-top:6px;letter-spacing:2px;">${escapeHtml(order.trackingNumber)}</div>
            ${
              courierTrackUrl
                ? `<div style="margin-top:10px;font:400 12px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">Tap the button below to view live status with ${escapeHtml(courierName)}.</div>`
                : ''
            }
          </td>
        </tr>
      </table>`
    : '';

  const html = renderEmailShell({
    preheader: `Your order ${order.id} is on its way${courierTrackUrl ? ` via ${courierName}.` : '.'}`,
    eyebrow: 'In Transit',
    heading: 'Your timepiece is on its way',
    intro: `Your order has been authenticated, packed, and handed to ${courierTrackUrl ? courierName : 'our insured courier'}. Estimated arrival is 3–5 business days.`,
    body: trackingBlock + renderItemsTable(order),
    ctaLabel,
    ctaUrl,
  });

  const text = renderText([
    `Your Shop Ash order is on its way.`,
    ``,
    `Order: ${order.id}`,
    order.trackingNumber ? `${courierName} tracking: ${order.trackingNumber}` : '',
    courierTrackUrl ? `Live tracking: ${courierTrackUrl}` : '',
    `View order: ${orderPageUrl}`,
    ``,
    `— Shop Ash`,
  ]);

  return {
    to: order.email,
    message: {
      subject: `Your order is on its way · ${order.id}`,
      html,
      text,
    },
  };
};

// ─── Email: out for delivery ────────────────────────────────────
export const buildOutForDeliveryEmail = (order: Order) => {
  const orderPageUrl = order.userId
    ? `${siteUrl()}/account/orders/${order.id}`
    : `${siteUrl()}/track`;
  const courierName = courierLabel(order.courier);
  const courierTrackUrl = getCourierTrackingUrl(order.courier, order.trackingNumber);
  const ctaUrl = courierTrackUrl ?? orderPageUrl;
  const ctaLabel = courierTrackUrl ? `Track with ${courierName}` : 'Track order';

  const html = renderEmailShell({
    preheader: `Your order ${order.id} is out for delivery today.`,
    eyebrow: 'Out for Delivery',
    heading: 'Arriving today',
    intro: `Our ${courierTrackUrl ? courierName + ' courier' : 'courier'} is on the final leg of your delivery. Please ensure someone is available to sign for the package.`,
    body: order.trackingNumber
      ? `<p style="margin:0;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.mutedColor};">${escapeHtml(courierName)} tracking: <strong style="color:${BRAND.foregroundColor};letter-spacing:1px;">${escapeHtml(order.trackingNumber)}</strong></p>`
      : '',
    ctaLabel,
    ctaUrl,
  });

  const text = renderText([
    `Your Shop Ash order ${order.id} is out for delivery today.`,
    order.trackingNumber ? `${courierName} tracking: ${order.trackingNumber}` : '',
    courierTrackUrl ? `Live tracking: ${courierTrackUrl}` : '',
    ``,
    `View order: ${orderPageUrl}`,
    ``,
    `— Shop Ash`,
  ]);

  return {
    to: order.email,
    message: {
      subject: `Out for delivery today · ${order.id}`,
      html,
      text,
    },
  };
};

// ─── Email: delivered ───────────────────────────────────────────
export const buildDeliveredEmail = (order: Order) => {
  const html = renderEmailShell({
    preheader: `Your order ${order.id} has arrived. Welcome to the Shop Ash family.`,
    eyebrow: 'Delivered',
    heading: 'Welcome to the family',
    intro: `Your timepiece has arrived. Thank you for choosing Shop Ash — we hope it brings you years of considered moments. Should you ever need servicing, authentication, or want to add to your collection, our concierge is always at your service.`,
    body: renderItemsTable(order),
    ctaLabel: 'Browse the collection',
    ctaUrl: `${siteUrl()}/shop`,
  });

  const text = renderText([
    `Your Shop Ash order ${order.id} has been delivered. Welcome to the family.`,
    ``,
    `Browse: ${siteUrl()}/shop`,
    ``,
    `— Shop Ash`,
  ]);

  return {
    to: order.email,
    message: {
      subject: `Welcome to the Shop Ash family · ${order.id}`,
      html,
      text,
    },
  };
};

// ─── Email: cancelled ───────────────────────────────────────────
export const buildCancelledEmail = (order: Order) => {
  const html = renderEmailShell({
    preheader: `Your order ${order.id} has been cancelled.`,
    eyebrow: 'Cancelled',
    heading: 'Your order has been cancelled',
    intro: `Your order has been cancelled. If this was unexpected or you have any questions, please reply to this email and our concierge will be in touch immediately.`,
    body: renderItemsTable(order),
    ctaLabel: 'Contact concierge',
    ctaUrl: `${siteUrl()}/contact`,
  });

  const text = renderText([
    `Your Shop Ash order ${order.id} has been cancelled.`,
    ``,
    `Contact: ${siteUrl()}/contact`,
    ``,
    `— Shop Ash`,
  ]);

  return {
    to: order.email,
    message: {
      subject: `Order cancelled · ${order.id}`,
      html,
      text,
    },
  };
};

// ─── Dispatch ────────────────────────────────────────────────────
export const sendOrderConfirmationEmail = async (order: Order): Promise<void> => {
  if (!order.email) return;
  await sendEmail(buildOrderConfirmationEmail(order));
};

/**
 * Sends the appropriate email when an order's status changes.
 * Returns silently if the new status doesn't have an email template.
 */
export const sendOrderStatusEmail = async (
  order: Order,
  newStatus: OrderStatus
): Promise<void> => {
  if (!order.email) return;

  switch (newStatus) {
    case 'shipped':
      return sendEmail(buildShippedEmail({ ...order, status: newStatus }));
    case 'out-for-delivery':
      return sendEmail(buildOutForDeliveryEmail({ ...order, status: newStatus }));
    case 'delivered':
      return sendEmail(buildDeliveredEmail({ ...order, status: newStatus }));
    case 'cancelled':
      return sendEmail(buildCancelledEmail({ ...order, status: newStatus }));
    default:
      return;
  }
};
