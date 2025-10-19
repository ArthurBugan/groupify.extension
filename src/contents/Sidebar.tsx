import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { sleep } from "@/lib/utils"
import { useUser } from "@/hooks/useQuery/useUser"

import GroupItem from "./GroupItem"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/hooks/utils/queryClient"
import { Loader2 } from "lucide-react"

interface ApiGroup {
  id: string;
  name: string;
  channelCount: number;
  category: string;
  createdAt: string;
  icon: string;
  parentId: string | null;
  nestingLevel: number;
  displayOrder: number;
}

interface TableGroup extends ApiGroup {
  order: any
  expanded: boolean;
}

const transformApiGroups = (apiGroups?: ApiGroup[]): TableGroup[] => {
  if (!apiGroups) return [];

  return apiGroups?.map((group, index) => ({
    id: group.id,
    name: group.name,
    channelCount: group.channelCount || 0,
    category: group.category || "General",
    createdAt: new Date(group.createdAt).toLocaleDateString(),
    icon: group.icon || "FolderKanban",
    parentId: group.parentId || null,
    expanded: false,
    nestingLevel: group.nestingLevel || 0,
    order: group.displayOrder || index,
    displayOrder: group.displayOrder === undefined || group.displayOrder === null ? index : group.displayOrder,
  }));
};

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("ytd-guide-entry-renderer:nth-child(3)")
}

const Sidebar = () => {
  const { userData, loading: isLoadingUser, error: userError } = useUser();
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({limit: 100});
  const [groups, setGroups] = useState<TableGroup[]>([]);

  useEffect(() => {
    if (groupsData?.data) {
      setGroups(transformApiGroups(groupsData.data as ApiGroup[]));
    }
  }, [groupsData?.data]);

  const toggleExpand = (id: string) => {
    setGroups(
      groups.map((group) =>
        group.id === id ? { ...group, expanded: !group.expanded } : group,
      ),
    );
  };

 	const getSortedGroups = () => {
		const result: TableGroup[] = [];
		const processedGroups = new Set<string>();

		// First, add all groups that don't have parents in the current dataset
		// This includes actual root groups and orphaned child groups whose parents are on other pages
		const groupsWithoutParentsInDataset = groups.filter((group) => {
			if (group.parentId === null) return true;
			// Check if parent exists in current dataset
			const parentExists = groups.some((g) => g.id === group.parentId);
			return !parentExists;
		});

		// Sort groups without parents by order
		const sortedRootGroups = groupsWithoutParentsInDataset.sort(
			(a, b) => a.order - b.order,
		);

		const addGroupAndChildren = (group: TableGroup) => {
			if (processedGroups.has(group.id)) return;

			result.push(group);
			processedGroups.add(group.id);

			// Add children if expanded (only if they exist in current dataset)
			if (group.expanded) {
				const children = groups
					.filter((g) => g.parentId === group.id)
					.sort((a, b) => a.order - b.order);
				children.forEach(addGroupAndChildren);
			}
		};

		sortedRootGroups.forEach(addGroupAndChildren);
		return result;
	};

  const sortedGroups = getSortedGroups();

  console.log(sortedGroups)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      };
    }
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (isLoadingGroups) {
    return (
      <div className="flex flex-col mt-2 w-full">
        <hr className="mb-3 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <Loader2 className="m-auto animate-spin dark:text-white text-black" />
        <div className="flex gap-y-4 w-full">
          <div className="flex items-center px-4 my-3 w-full">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 animate-spin border-t-gray-900" />
            </div>
            <p className="m-auto text-xl text-primary dark:text-white">
              {chrome.i18n.getMessage("sidebar_loading")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex flex-col w-full">
        <hr className="mb-3 h-px bg-gray-200 border-0 dark:bg-gray-700" />

        <div className="flex gap-y-4 w-full">
          <div className="flex items-center px-4 my-3 w-full">
            <Button
              variant="destructive"
              className="m-auto text-xl text-primary dark:text-white"
              onClick={() =>
                window.open("https://groupify.dev/dashboard/groups")
              }>
              {chrome.i18n.getMessage("sidebar_unauthorized")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  console.log(groupsData)

  return (
    <div className="flex gap-y-4 w-full">
      <Collapsible className="w-full group">
        <div className="flex flex-row justify-between items-center px-2 my-3">
          <CollapsibleTrigger asChild>
            <Button
              className="flex justify-start items-center w-full"
              variant="ghost">
              <div className="flex flex-row gap-x-2">
                <BiChevronRight
                  className="transition-all text-primary h-10 w-10 group-data-[state='open']:rotate-90 dark:text-white"
                />
                <p className="text-xl text-primary dark:text-white">
                  {chrome.i18n.getMessage("sidebar_groups")}
                </p>
              </div>
            </Button>
          </CollapsibleTrigger>

          <Button
            onClick={() => window.open("https://groupify.dev/dashboard/groups")}
            variant="ghost">
            <BiFolderPlus size={16} className="text-primary dark:text-white" />
          </Button>
        </div>
        <CollapsibleContent className="space-y-2">
          {!sortedGroups?.length && (
            <span className="flex flex-row justify-between items-center px-4 my-2 text-sm text-primary dark:text-white">
              {chrome.i18n.getMessage("sidebar_groups_not_found")}
            </span>
          )}
          {sortedGroups?.map?.((g) => (
            <div key={g.id} className={`pl-${g.nestingLevel * 8}`}>
              <GroupItem {...g} toggleExpand={toggleExpand} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}


function SidebarWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
    </QueryClientProvider>
  );
}

export default SidebarWithProvider;
