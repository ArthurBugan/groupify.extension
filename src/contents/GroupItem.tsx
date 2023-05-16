import type { PlasmoGetInlineAnchor } from "plasmo"
import { BiChevronRight, BiEdit } from "react-icons/bi"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { DynamicIcon } from "~components/ui/icon"
import { getFamily } from "~lib/utils"

import type { GroupType } from "./Sidebar"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return null
}

const GroupItem: React.FC<GroupType> = (g) => {
  return (
    <Collapsible className="w-full group/child">
      <div className="px-4 my-2 flex flex-row items-center justify-between">
        <CollapsibleTrigger>
          <Button variant="ghost">
            <BiChevronRight
              size={16}
              className="transition-all text-primary group-data-[state='open']/child:rotate-90"
            />
          </Button>
        </CollapsibleTrigger>

        <p className="text-primary truncate text-lg">{g.name}</p>
        <DynamicIcon lib={getFamily(g.icon)} icon={g.icon} />

        <Button variant="ghost">
          <BiEdit size={16} className="transition-all text-primary" />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="px-4 my-1 flex flex-row items-center justify-between">
          <p className="text-primary text-xl">Lista de canais</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GroupItem
