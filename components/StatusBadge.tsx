import { StudentStatus, getStatusColors, getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: StudentStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = getStatusColors(status)
  const label = getStatusLabel(status)

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${colors.bg} ${colors.text}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
      {label}
    </span>
  )
}
