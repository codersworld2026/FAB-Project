import type { ComponentType } from 'react';
import {
  HomeIcon,
  LessonIcon,
  SeriesIcon,
  ActivityIcon,
  AssessmentIcon,
  UsersIcon,
  AccountIcon,
  SupportIcon,
} from './icons';

export interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

/** Primary navigation — shared by the desktop nav and the mobile drawer. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home', Icon: HomeIcon },
  { href: '/dashboard/lessons', label: 'Lessons', Icon: LessonIcon },
  { href: '/dashboard/series', label: 'Lesson series', Icon: SeriesIcon },
  { href: '/dashboard/activity-sheets', label: 'Activity sheets', Icon: ActivityIcon },
  { href: '/dashboard/assessments', label: 'Assessments', Icon: AssessmentIcon },
  { href: '/dashboard/teams', label: 'Teams', Icon: UsersIcon },
  { href: '/dashboard/account', label: 'My account', Icon: AccountIcon },
  { href: '/dashboard/support', label: 'Support', Icon: SupportIcon },
];

/** Active-state matcher: exact for Home, prefix for the rest. */
export function isNavActive(pathname: string, href: string): boolean {
  return href === '/dashboard'
    ? pathname === '/dashboard'
    : pathname.startsWith(href);
}
