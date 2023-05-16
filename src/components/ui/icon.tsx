import * as FcIcons from "react-icons/fc"
import type { IconType } from "react-icons/lib"

export type IconMap = Record<string, IconType>
export type Library = "fc"

interface IDynamicIcon {
  lib: Library
  icon: string
  size?: number
  className?: string
}

export const DynamicIcon: React.FC<IDynamicIcon> = ({
  lib,
  icon,
  size = 20,
  className
}) => {
  const Icon: IconType = (returnLibraryIcons(lib) as IconMap)[icon]

  return <Icon className={className} size={size} />
}

export const LibraryIcons = {
  fc: FcIcons
}

export const returnLibraryIcons = (lib: Library) => {
  return LibraryIcons[lib]
}
