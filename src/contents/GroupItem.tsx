import type { PlasmoGetInlineAnchor } from "plasmo"
import { BiChevronRight } from "react-icons/bi"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"

import type { GroupType } from "./Sidebar"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return null
}

const GroupItem: React.FC<GroupType> = (g) => {
  return (
    <Collapsible className="w-full group/child">
      <div className="px-6 my-4 flex flex-row items-center">
        <CollapsibleTrigger>
          <Button variant="ghost">
            <BiChevronRight
              size={20}
              className="transition-all text-primary group-data-[state='open']/child:rotate-90"
            />
          </Button>
        </CollapsibleTrigger>

        <p className="text-primary text-2xl">{g.name}</p>
      </div>
      <CollapsibleContent>
        <p className="text-primary text-2xl">Lista de canais</p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GroupItem
