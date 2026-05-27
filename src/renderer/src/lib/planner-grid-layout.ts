/** Week grid keys for ref.4 planner bootstrap (visual slot per task index). */

export const PLANNER_WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const
export const PLANNER_HOURS = ['08:00', '12:00', '16:00', '20:00'] as const

export type PlannerWeekDay = (typeof PLANNER_WEEK_DAYS)[number]
export type PlannerHour = (typeof PLANNER_HOURS)[number]

export function plannerCellKey(day: PlannerWeekDay, hour: PlannerHour): string {
  return `${day}-${hour}`
}

export function plannerCellKeyForTaskIndex(index: number): string {
  const day = PLANNER_WEEK_DAYS[index % PLANNER_WEEK_DAYS.length]!
  const hour = PLANNER_HOURS[Math.floor(index / PLANNER_WEEK_DAYS.length) % PLANNER_HOURS.length]!
  return plannerCellKey(day, hour)
}
