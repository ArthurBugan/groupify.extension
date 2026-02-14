import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useState, useEffect, useCallback, useRef } from "react"
import { Plus, Check, Loader2, X } from "lucide-react"
import { QueryClientProvider } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { cn, sleep } from "@/lib/utils"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { useUser } from "@/hooks/useQuery/useUser"
import { createChannel } from "@/hooks/useQuery/useChannels"
import { queryClient } from "@/hooks/utils/queryClient"

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
  return document.querySelector("#owner.ytd-watch-metadata")
}

// Extract channel info from YouTube video page
const getChannelInfoFromVideo = () => {
  let channelId = ""
  let channelName = ""
  let thumbnail = ""
  let channelUrl = ""
  let channelHandle = ""

  // PRIORITY 1: Try to get the actual UC channel ID from ytInitialData
  // This is embedded in the page and contains the externalId (UC...)
  try {
    const scripts = document.querySelectorAll("script")
    for (const script of scripts) {
      const text = script.textContent || ""
      // Look for externalId in ytInitialData
      const externalIdMatch = text.match(/"externalId":"(UC[^"]+)"/)
      if (externalIdMatch) {
        channelId = externalIdMatch[1]
        console.log("[Groupify] Found UC ID from ytInitialData:", channelId)
        break
      }
      // Alternative: look in ytConfig
      const ytConfigMatch = text.match(/"channelId":"(UC[^"]+)"/)
      if (ytConfigMatch) {
        channelId = ytConfigMatch[1]
        console.log("[Groupify] Found UC ID from ytConfig:", channelId)
        break
      }
    }
  } catch (e) {
    console.error("[Groupify] Error extracting from page data:", e)
  }

  // PRIORITY 2: Get from the owner section - this contains the uploader/streamer
  // This is the most reliable location for the channel that created the video/stream
  const ownerSection =
    document.querySelector("#owner.ytd-watch-metadata") ||
    document.querySelector("ytd-video-owner-renderer")

  if (ownerSection) {
    // Look for the channel link with the avatar - this is always the uploader
    // The avatar link is the most specific indicator of the channel owner
    const avatarLink = ownerSection.querySelector(
      '#avatar a[href*="/channel/"], #avatar a[href*="/@"]'
    ) as HTMLAnchorElement

    if (avatarLink && avatarLink.href) {
      const href = avatarLink.href
      channelUrl = href

      const channelMatch = href.match(/\/channel\/(UC[^\/\?]+)/)
      const handleMatch = href.match(/\/@([^\/\?]+)/)

      if (channelMatch && !channelId) {
        channelId = channelMatch[1]
      }

      if (handleMatch) {
        channelHandle = "@" + handleMatch[1]
        // Only use handle as fallback if we don't have UC ID
        if (!channelId) {
          channelId = channelHandle
        }
      }
    }

    // Get channel name from the owner-name element
    const nameEl = ownerSection.querySelector(
      "#owner-name a, #upload-info ytd-channel-name a, a#owner-name"
    )
    if (nameEl && nameEl.textContent) {
      const name = nameEl.textContent.trim()
      if (name && name.length < 100 && !name.includes("•")) {
        channelName = name
      }
    }

    // Get thumbnail from avatar in owner section
    const avatarImg = ownerSection.querySelector("#avatar img")
    if (avatarImg) {
      thumbnail = (avatarImg as HTMLImageElement).src
    }
  }

  // PRIORITY 3: Try to get from video meta tags
  if (!channelId) {
    const channelLink = document.querySelector(
      'meta[itemprop="channelId"], meta[property="og:video:tag"][content*="UC"]'
    ) as HTMLMetaElement
    if (channelLink && channelLink.content) {
      channelId = channelLink.content
    }
  }

  console.log("[Groupify] Channel Info:", {
    channelId,
    channelName,
    thumbnail,
    channelUrl,
    channelHandle
  })

  return { channelId, channelName, thumbnail, channelUrl }
}

// Get icon URL from icon name
const getIconUrl = (iconName: string) => {
  if (!iconName) return "https://api.iconify.design/lucide/folder-kanban.svg"
  if (iconName.startsWith("http")) return iconName
  const normalizedIcon = iconName.replace(":", "/")
  return `https://api.iconify.design/${normalizedIcon}.svg`
}

// Simple Select Component with Search
const SimpleSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  searchable = false
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; icon?: string }[]
  placeholder: string
  disabled?: boolean
  searchable?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }
    // Use click instead of mousedown to avoid conflicts
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, searchable])

  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          !disabled && setIsOpen(!isOpen)
        }}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md transition-colors",
          "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700",
          "text-gray-900 dark:text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && (
            <img
              src={getIconUrl(selectedOption.icon)}
              alt=""
              className="w-5 h-5 shrink-0"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://api.iconify.design/lucide/folder-kanban.svg"
              }}
            />
          )}
          <span
            className={cn(
              !selectedOption && "text-gray-500 dark:text-gray-400",
              "truncate"
            )}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <svg
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-72 overflow-hidden flex flex-col">
          {/* Debug info */}
          <div className="px-2 py-1 text-xs text-gray-500 border-b">
            Options: {options.length} | Filtered: {filteredOptions.length}
          </div>

          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groups..."
                  className={cn(
                    "w-full pl-9 pr-3 py-2 text-sm rounded-md",
                    "bg-gray-50 dark:bg-gray-800",
                    "border border-gray-300 dark:border-gray-600",
                    "text-gray-900 dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  )}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    // Stop YouTube shortcuts from triggering
                    e.stopPropagation()
                  }}
                  onKeyUp={(e) => {
                    // Stop YouTube shortcuts from triggering
                    e.stopPropagation()
                  }}
                  onKeyPress={(e) => {
                    // Stop YouTube shortcuts from triggering
                    e.stopPropagation()
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearchQuery("")
                      inputRef.current?.focus()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-72">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No groups found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    // Use onMouseDown to fire before clickOutside
                    e.preventDefault()
                    e.stopPropagation()
                    console.log(
                      "[Groupify] Selecting group:",
                      option.value,
                      option.label
                    )
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchQuery("")
                  }}
                  className={cn(
                    "w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center gap-2",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20",
                    value === option.value &&
                      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  )}>
                  {option.icon && (
                    <img
                      src={getIconUrl(option.icon)}
                      alt=""
                      className="w-5 h-5 shrink-0 pointer-events-none"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://api.iconify.design/lucide/folder-kanban.svg"
                      }}
                    />
                  )}
                  <span className="truncate pointer-events-none">
                    {option.label}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Results Count */}
          {searchable && searchQuery && (
            <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {filteredOptions.length} of {options.length} groups
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Simple Modal Component
const SimpleModal = ({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[2147483647]"
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}>
        <div
          className={cn(
            "bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg pointer-events-auto",
            "border border-gray-200 dark:border-gray-800",
            "animate-in fade-in zoom-in duration-200"
          )}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  )
}

const QuickAddButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [channelInfo, setChannelInfo] = useState({
    channelId: "",
    channelName: "",
    thumbnail: "",
    channelUrl: ""
  })
  const [existingGroup, setExistingGroup] = useState<{
    id: string
    name: string
    icon?: string
  } | null>(null)

  const { userData } = useUser()
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    limit: 100,
    includeChannels: true
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      setChannelInfo(getChannelInfoFromVideo())
      setSelectedGroup("")
    }
  }, [isModalOpen])

  // Get current video/channel identifier for tracking changes
  const videoId =
    new URLSearchParams(window.location.search).get("v") ||
    window.location.pathname
  const currentPath = window.location.pathname + window.location.search

  // Check if channel is already in a group
  useEffect(() => {
    const info = getChannelInfoFromVideo()
    console.log("[Groupify] Checking if channel is in group:", info)
    if (!info.channelId || !groupsData?.data) {
      setExistingGroup(null)
      return
    }

    // Check all groups for this channel
    for (const group of groupsData.data) {
      if (group.channels) {
        const found = group.channels.find((ch: any) => {
          const storedChannelId = ch.channelId || ch.url || ""
          const searchChannelId = info.channelId || ""

          if (storedChannelId === searchChannelId) return true
          if (storedChannelId.includes(searchChannelId)) return true
          if (searchChannelId.includes(storedChannelId)) return true

          const storedHandle = storedChannelId
            .replace("/@", "@")
            .replace("/channel/", "")
          const searchHandle = searchChannelId
            .replace("/@", "@")
            .replace("/channel/", "")
          if (storedHandle === searchHandle) return true

          return false
        })
        if (found) {
          console.log("[Groupify] Found channel in group:", group.name, found)
          setExistingGroup({
            id: group.id,
            name: group.name,
            icon: group.icon
          })
          return
        }
      }
    }
    setExistingGroup(null)
  }, [groupsData?.data, videoId])

  const handleAddChannel = useCallback(async () => {
    if (!selectedGroup || !channelInfo.channelId) return

    setIsLoading(true)
    try {
      await createChannel({
        name: channelInfo.channelName || channelInfo.channelId,
        channelId: channelInfo.channelId,
        url: channelInfo.channelId,
        thumbnail: channelInfo.thumbnail,
        groupId: selectedGroup
      })

      setIsModalOpen(false)
      setSelectedGroup("")

      // Show success notification
      const notification = document.createElement("div")
      notification.className = cn(
        "fixed bottom-4 right-4 z-[2147483647] px-4 py-3 rounded-lg shadow-lg",
        "bg-green-600 text-white text-sm font-medium",
        "animate-in slide-in-from-bottom-2 fade-in"
      )
      notification.textContent = "Channel added to group!"
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
    } catch (error) {
      console.error("Error adding channel:", error)

      // Show error notification
      const notification = document.createElement("div")
      notification.className = cn(
        "fixed bottom-4 right-4 z-[2147483647] px-4 py-3 rounded-lg shadow-lg",
        "bg-red-600 text-white text-sm font-medium",
        "animate-in slide-in-from-bottom-2 fade-in"
      )
      notification.textContent = "Failed to add channel"
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup, channelInfo])

  if (!userData?.email) return null

  const isVideoPage =
    window.location.pathname === "/watch" &&
    window.location.search.includes("v=")
  const isShortPage = window.location.pathname.startsWith("/shorts/")

  if (!isVideoPage && !isShortPage) return null

  const groupOptions =
    groupsData?.data?.map((group: any) => ({
      value: group.id,
      label: group.name,
      icon: group.icon || "lucide:folder-kanban"
    })) || []

  console.log("[Groupify] groupOptions:", groupOptions)
  console.log("[Groupify] selectedGroup:", selectedGroup)
  console.log("[Groupify] existingGroup:", existingGroup)

  return (
    <div className={cn(isDarkMode && "dark")}>
      {existingGroup ? (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
          <Check className="h-4 w-4" />
          <span className="font-medium">Added to {existingGroup.name}</span>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-white mt-6 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 h-9 px-3 text-sm font-medium">
          <Plus className="h-6 w-6" />
          <span>Add to Group</span>
        </Button>
      )}

      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Channel to Group
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Channel Info */}
          {channelInfo.channelName && (
            <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
              {channelInfo.thumbnail && (
                <img
                  src={channelInfo.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-base text-gray-900 dark:text-white truncate">
                  {channelInfo.channelName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {channelInfo.channelId}
                </p>
              </div>
            </div>
          )}

          {/* Group Selection */}
          <div className="space-y-3 mb-8">
            <label className="text-base font-medium text-gray-700 dark:text-white">
              Select Group
            </label>
            <SimpleSelect
              value={selectedGroup}
              onChange={(val) => {
                console.log("[Groupify] Group selected:", val)
                setSelectedGroup(val)
              }}
              options={groupOptions}
              placeholder="Choose a group..."
              disabled={isLoadingGroups}
              searchable={true}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="px-6 dark:bg-gray-800 dark:text-white dark:border-gray-700">
              Cancel
            </Button>
            <Button
              onClick={handleAddChannel}
              disabled={!selectedGroup || isLoading}
              className="gap-2 px-6 dark:bg-white dark:text-black">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Add Channel
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}

function QuickAddWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuickAddButton />
    </QueryClientProvider>
  )
}

export default QuickAddWithProvider
