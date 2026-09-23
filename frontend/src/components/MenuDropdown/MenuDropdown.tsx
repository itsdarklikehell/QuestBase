import { useEffect, useRef } from "react"
import styles from "./MenuDropdown.module.css"

interface MenuDropdownProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;

  mobile?: boolean;
  textAlign?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
}

export default function MenuDropdown ({ 
  children, 
  open,
  onClose,
  triggerRef,
  mobile, 
  textAlign,
  style  
}: MenuDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node
      if (
        open &&  
        !ref.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [open, onClose, triggerRef])

  const menuClassName = [
    styles.menu_dropdown,
    open && styles.open,
    mobile && styles.mobile,
    textAlign === "right"
      ? styles.align_right
      : styles.align_left
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
        ref={ref}
        className={menuClassName}
        style={style}
      >
        {children}
      </div>
  )
}