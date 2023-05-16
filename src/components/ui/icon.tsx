import * as FaIcons from "react-icons/fa"
import * as FcIcons from "react-icons/fc"
import * as HiIcons from "react-icons/hi"
import type { IconType } from "react-icons/lib"
import * as MdIcons from "react-icons/md"

export type IconMap = Record<string, IconType>
export type Library = "fa" | "md" | "hi" | "fc"

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
  fa: FaIcons,
  md: MdIcons,
  hi: HiIcons,
  fc: FcIcons
}

export const returnLibraryIcons = (lib: Library) => {
  return LibraryIcons[lib]
}
