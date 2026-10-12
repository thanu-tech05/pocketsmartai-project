import { forwardRef } from 'react'
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

export type IconType = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
>

export const RupeeIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function RupeeIcon(props, ref) {
    return (
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
        strokeWidth={1.5}
        ref={ref}
        {...props}
      >
        <path d="M6 3h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 8h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 13h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 13c6 0 6-10 0-10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 13l8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
) as IconType
