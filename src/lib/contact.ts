/**
 * One of the two listed numbers also answers on WhatsApp, which is how most
 * international enquiries actually arrive. That line links straight into a
 * chat; the other stays a plain dial link.
 */

const digits = (value: string) => value.replace(/\D/g, "");

export const isWhatsApp = (phone: string, whatsapp: string) =>
  Boolean(whatsapp) && digits(phone).endsWith(digits(whatsapp).slice(-9));

export const phoneLinkProps = (phone: string, whatsapp: string) =>
  isWhatsApp(phone, whatsapp)
    ? { href: `https://wa.me/${digits(whatsapp)}`, target: "_blank", rel: "noreferrer" }
    : { href: `tel:${phone.replace(/\s/g, "")}` };
