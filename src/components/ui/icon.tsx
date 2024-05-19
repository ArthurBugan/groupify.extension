import * as Fa6Icons from "react-icons/fa6"
import * as FcIcons from "react-icons/fc"
import * as HeroIcons2 from "react-icons/hi2"
import type { IconType } from "react-icons/lib"
import * as LuIcons from "react-icons/lu"

export type IconMap = Record<string, IconType>
export type Library = "fc" | "hi" | "lu" | "fa"

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
  fa: Fa6Icons,
  fc: FcIcons,
  hi: HeroIcons2,
  lu: LuIcons
}

export const returnLibraryIcons = (lib: Library) => {
  return LibraryIcons[lib]
}
