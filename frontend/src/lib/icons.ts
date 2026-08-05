/**
 * icons.ts
 *
 * Registro de iconos Tabler usados en el proyecto.
 * Cada icono se importa como SVG raw (?raw) para mantener la app estática.
 *
 * Para agregar un icono nuevo:
 *   1. Importar el SVG desde `@tabler/icons/icons/outline/<nombre>.svg?raw`
 *   2. Agregar al map `ICONS`
 *
 * NOTA: usamos paths relativos (../../../node_modules/...) porque el sufijo `?raw`
 * de Vite no funciona bien con alias absolutos de package en algunos casos.
 *
 * Iconos disponibles: https://tabler.io/icons
 */
import stethoscope from "../../node_modules/@tabler/icons/icons/outline/stethoscope.svg?raw";
import calendar from "../../node_modules/@tabler/icons/icons/outline/calendar.svg?raw";
import calendarEvent from "../../node_modules/@tabler/icons/icons/outline/calendar-event.svg?raw";
import calendarExclamation from "../../node_modules/@tabler/icons/icons/outline/calendar-exclamation.svg?raw";
import calendarPlus from "../../node_modules/@tabler/icons/icons/outline/calendar-plus.svg?raw";
import calendarWeek from "../../node_modules/@tabler/icons/icons/outline/calendar-week.svg?raw";
import calendarStats from "../../node_modules/@tabler/icons/icons/outline/calendar-stats.svg?raw";
import calendarClock from "../../node_modules/@tabler/icons/icons/outline/calendar-clock.svg?raw";
import users from "../../node_modules/@tabler/icons/icons/outline/users.svg?raw";
import user from "../../node_modules/@tabler/icons/icons/outline/user.svg?raw";
import userCog from "../../node_modules/@tabler/icons/icons/outline/user-cog.svg?raw";
import home from "../../node_modules/@tabler/icons/icons/outline/home-2.svg?raw";
import barbell from "../../node_modules/@tabler/icons/icons/outline/barbell.svg?raw";
import dumbbell from "../../node_modules/@tabler/icons/icons/outline/dumbbell.svg?raw";
import swimming from "../../node_modules/@tabler/icons/icons/outline/swimming.svg?raw";
import massage from "../../node_modules/@tabler/icons/icons/outline/massage.svg?raw";
import stretching from "../../node_modules/@tabler/icons/icons/outline/stretching.svg?raw";
import walk from "../../node_modules/@tabler/icons/icons/outline/walk.svg?raw";
import beach from "../../node_modules/@tabler/icons/icons/outline/beach.svg?raw";
import bolt from "../../node_modules/@tabler/icons/icons/outline/bolt.svg?raw";
import flame from "../../node_modules/@tabler/icons/icons/outline/flame.svg?raw";
import chartLine from "../../node_modules/@tabler/icons/icons/outline/chart-line.svg?raw";
import messageCircle from "../../node_modules/@tabler/icons/icons/outline/message-circle.svg?raw";
import message2 from "../../node_modules/@tabler/icons/icons/outline/message-2.svg?raw";
import mail from "../../node_modules/@tabler/icons/icons/outline/mail.svg?raw";
import brandWhatsapp from "../../node_modules/@tabler/icons/icons/outline/brand-whatsapp.svg?raw";
import bellRinging from "../../node_modules/@tabler/icons/icons/outline/bell-ringing.svg?raw";
import bellOff from "../../node_modules/@tabler/icons/icons/outline/bell-off.svg?raw";
import receipt from "../../node_modules/@tabler/icons/icons/outline/receipt.svg?raw";
import settings from "../../node_modules/@tabler/icons/icons/outline/settings.svg?raw";
import logout from "../../node_modules/@tabler/icons/icons/outline/logout.svg?raw";
import boxSeam from "../../node_modules/@tabler/icons/icons/outline/box.svg?raw";
import alertTriangle from "../../node_modules/@tabler/icons/icons/outline/alert-triangle.svg?raw";
import clipboardList from "../../node_modules/@tabler/icons/icons/outline/clipboard-list.svg?raw";
import clipboardCheck from "../../node_modules/@tabler/icons/icons/outline/clipboard-check.svg?raw";
import check from "../../node_modules/@tabler/icons/icons/outline/check.svg?raw";
import plus from "../../node_modules/@tabler/icons/icons/outline/plus.svg?raw";
import x from "../../node_modules/@tabler/icons/icons/outline/x.svg?raw";
import circleDot from "../../node_modules/@tabler/icons/icons/outline/circle-dot.svg?raw";
import circleCheck from "../../node_modules/@tabler/icons/icons/outline/circle-check.svg?raw";
import circleX from "../../node_modules/@tabler/icons/icons/outline/circle-x.svg?raw";
import sparkles from "../../node_modules/@tabler/icons/icons/outline/sparkles.svg?raw";
import shieldLock from "../../node_modules/@tabler/icons/icons/outline/shield-lock.svg?raw";
import currencyDollar from "../../node_modules/@tabler/icons/icons/outline/currency-dollar.svg?raw";
import chartPie from "../../node_modules/@tabler/icons/icons/outline/chart-pie.svg?raw";
import chartBar from "../../node_modules/@tabler/icons/icons/outline/chart-bar.svg?raw";
import layoutDashboard from "../../node_modules/@tabler/icons/icons/outline/layout-dashboard.svg?raw";
import layoutGrid from "../../node_modules/@tabler/icons/icons/outline/layout-grid.svg?raw";
import clock from "../../node_modules/@tabler/icons/icons/outline/clock.svg?raw";
import clock24 from "../../node_modules/@tabler/icons/icons/outline/clock-24.svg?raw";
import hourglass from "../../node_modules/@tabler/icons/icons/outline/hourglass.svg?raw";
import search from "../../node_modules/@tabler/icons/icons/outline/search.svg?raw";
import filter from "../../node_modules/@tabler/icons/icons/outline/filter.svg?raw";
import refresh from "../../node_modules/@tabler/icons/icons/outline/refresh.svg?raw";
import arrowRight from "../../node_modules/@tabler/icons/icons/outline/arrow-right.svg?raw";
import chevronLeft from "../../node_modules/@tabler/icons/icons/outline/chevron-left.svg?raw";
import chevronRight from "../../node_modules/@tabler/icons/icons/outline/chevron-right.svg?raw";
import doorEnter from "../../node_modules/@tabler/icons/icons/outline/door-enter.svg?raw";
import listCheck from "../../node_modules/@tabler/icons/icons/outline/list-check.svg?raw";
import list from "../../node_modules/@tabler/icons/icons/outline/list.svg?raw";
import worldUpload from "../../node_modules/@tabler/icons/icons/outline/world-upload.svg?raw";
import history from "../../node_modules/@tabler/icons/icons/outline/history.svg?raw";
import pencil from "../../node_modules/@tabler/icons/icons/outline/pencil.svg?raw";
import download from "../../node_modules/@tabler/icons/icons/outline/download.svg?raw";
import eye from "../../node_modules/@tabler/icons/icons/outline/eye.svg?raw";
import send from "../../node_modules/@tabler/icons/icons/outline/send.svg?raw";
import activity from "../../node_modules/@tabler/icons/icons/outline/activity.svg?raw";

const ICONS: Record<string, string> = {
  stethoscope,
  calendar,
  "calendar-event": calendarEvent,
  "calendar-exclamation": calendarExclamation,
  "calendar-plus": calendarPlus,
  "calendar-week": calendarWeek,
  "calendar-stats": calendarStats,
  "calendar-clock": calendarClock,
  users,
  user,
  "user-cog": userCog,
  home,
  barbell,
  dumbbell,
  swimming,
  massage,
  stretching,
  walk,
  beach,
  bolt,
  flame,
  "chart-line": chartLine,
  "message-circle": messageCircle,
  "message-2": message2,
  mail,
  "brand-whatsapp": brandWhatsapp,
  "bell-ringing": bellRinging,
  "bell-off": bellOff,
  receipt,
  settings,
  logout,
  "box-seam": boxSeam,
  "alert-triangle": alertTriangle,
  "clipboard-list": clipboardList,
  "clipboard-check": clipboardCheck,
  check,
  plus,
  x,
  "circle-dot": circleDot,
  "circle-check": circleCheck,
  "circle-x": circleX,
  sparkles,
  "shield-lock": shieldLock,
  "currency-dollar": currencyDollar,
  "chart-pie": chartPie,
  "chart-bar": chartBar,
  "layout-dashboard": layoutDashboard,
  "layout-grid": layoutGrid,
  clock,
  "clock-24": clock24,
  hourglass,
  search,
  filter,
  refresh,
  "arrow-right": arrowRight,
  "chevron-left": chevronLeft,
  "chevron-right": chevronRight,
  "door-enter": doorEnter,
  "list-check": listCheck,
  list,
  "world-upload": worldUpload,
  history,
  pencil,
  download,
  eye,
  send,
  activity,
};

export function getIcon(name: string): string {
  const svg = ICONS[name];
  if (!svg) {
    throw new Error(`Icon "${name}" no encontrado en @lib/icons.ts. Agregalo.`);
  }
  return svg;
}
