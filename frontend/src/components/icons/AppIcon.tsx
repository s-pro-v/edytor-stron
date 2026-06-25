import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Contact,
  Copy,
  Copyright,
  CreditCard,
  Download,
  Eye,
  File,
  FileText,
  Gem,
  GripVertical,
  Heading1,
  Heading2,
  Heading3,
  HelpCircle,
  Image,
  Layout,
  LayoutGrid,
  Link,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  MousePointerClick,
  Palette,
  Phone,
  Plus,
  Quote,
  Rocket,
  Save,
  Send,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Tablet,
  Tag,
  Target,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import type { IconName } from "./iconRegistry";
import { resolveIconName } from "./iconRegistry";

const ICON_COMPONENTS: Record<IconName, LucideIcon> = {
  menu: Menu,
  target: Target,
  "file-text": FileText,
  sparkles: Sparkles,
  image: Image,
  mail: Mail,
  "arrow-down-to-line": ArrowDownToLine,
  megaphone: Megaphone,
  "help-circle": HelpCircle,
  "message-square": MessageSquare,
  "credit-card": CreditCard,
  "bar-chart-3": BarChart3,
  file: File,
  rocket: Rocket,
  "building-2": Building2,
  palette: Palette,
  gem: Gem,
  zap: Zap,
  wrench: Wrench,
  tag: Tag,
  link: Link,
  "heading-1": Heading1,
  "heading-2": Heading2,
  "heading-3": Heading3,
  "mouse-pointer-click": MousePointerClick,
  layout: Layout,
  "align-left": AlignLeft,
  contact: Contact,
  copyright: Copyright,
  plus: Plus,
  x: X,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "arrow-right": ArrowRight,
  phone: Phone,
  "map-pin": MapPin,
  check: Check,
  quote: Quote,
  send: Send,
  "grip-vertical": GripVertical,
  copy: Copy,
  settings: Settings,
  monitor: Monitor,
  tablet: Tablet,
  smartphone: Smartphone,
  sun: Sun,
  moon: Moon,
  "layout-grid": LayoutGrid,
  "trash-2": Trash2,
  eye: Eye,
  download: Download,
  save: Save,
  star: Star,
  type: FileText,
};

interface Props {
  name: IconName | string | null | undefined;
  size?: number;
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}

export function AppIcon({
  name,
  size = 16,
  className = "app-icon",
  strokeWidth = 2,
  "aria-hidden": ariaHidden = true,
}: Props) {
  const resolved = resolveIconName(name);
  if (!resolved) return null;

  const Icon = ICON_COMPONENTS[resolved];
  if (!Icon) return null;

  return (
    <Icon
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
    />
  );
}

export {
  MODULE_ICONS,
  TEMPLATE_ICONS,
  FEATURE_ICON_OPTIONS,
  resolveIconName,
  resolveModuleIcon,
} from "./iconRegistry";
