import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Plus, Check, Loader2, X, UserPlus, Layers } from "lucide-react"
import { QueryClientProvider } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, sleep } from "@/lib/utils"
import { createChannel } from "@/hooks/useQuery/useChannels"
import { queryClient } from "@/hooks/utils/queryClient"
import { useUser } from "@/hooks/useQuery/useUser"
import { useGroups } from "@/hooks/useQuery/useGroups"

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
  console.log("[Groupify] QuickAddButton: Starting anchor detection...")
  
  // Wait for YouTube to fully load - video owner section
  await sleep(2000)
  
  // Try to find the owner section multiple times with delays
  const selectors = [
    "#owner.ytd-watch-metadata",
    "ytd-video-owner-renderer"
  ]

  for (let i = 0; i < 3; i++) {
    console.log(`[Groupify] QuickAddButton: Attempt ${i + 1}/3 to find anchor...`)
    for (const selector of selectors) {
      const anchor = document.querySelector(selector)
      if (anchor) {
        console.log("[Groupify] QuickAddButton: Found anchor via", selector)
        return anchor
      }
    }
    // Wait between retries
    await sleep(1000)
  }
  
  console.warn("[Groupify] QuickAddButton: Could not find specific anchor, falling back to body")
  return document.body
}

// Extract channel info from YouTube video page
const getChannelInfoFromVideo = () => {
  let channelId = ""
  let channelName = ""
  let thumbnail = ""
  let channelUrl = ""
  let channelHandle = ""

  // PRIORITY 1: Try to get the actual UC channel ID from ytInitialData
  try {
    const scripts = document.querySelectorAll("script")
    for (const script of scripts) {
      const text = script.textContent || ""
      const externalIdMatch = text.match(/"externalId":"(UC[^"]+)"/)
      if (externalIdMatch) {
        channelId = externalIdMatch[1]
        break
      }
      const ytConfigMatch = text.match(/"channelId":"(UC[^"]+)"/)
      if (ytConfigMatch) {
        channelId = ytConfigMatch[1]
        break
      }
    }
  } catch (e) {
    console.error("[Groupify] Error extracting from page data:", e)
  }

  // PRIORITY 2: Get from the owner section
  const ownerSection =
    document.querySelector("#owner.ytd-watch-metadata") ||
    document.querySelector("ytd-video-owner-renderer")

  if (ownerSection) {
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
        if (!channelId) {
          channelId = channelHandle
        }
      }
    }

    const nameEl = ownerSection.querySelector(
      "#owner-name a, #upload-info ytd-channel-name a, a#owner-name"
    )
    if (nameEl && nameEl.textContent) {
      const name = nameEl.textContent.trim()
      if (name && name.length < 100 && !name.includes("•")) {
        channelName = name
      }
    }

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

  return { channelId, channelName, thumbnail, channelUrl }
}

// Get icon URL from icon name
const getIconUrl = (iconName: string) => {
  if (!iconName) return "https://api.iconify.design/lucide/folder-kanban.svg"
  if (iconName.startsWith("http")) return iconName
  const normalizedIcon = iconName.replace(":", "/")
  return `https://api.iconify.design/${normalizedIcon}.svg`
}

// Simple Select Component with Search - Modernized UI
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
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, searchable])

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = useMemo(
    () =>
      searchQuery
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : options,
    [options, searchQuery]
  )

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
          "w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg transition-all",
          "bg-background dark:bg-card border-input dark:border-input/50",
          "text-foreground dark:text-card-foreground",
          "shadow-sm hover:bg-accent hover:border-primary/50 dark:hover:bg-accent/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-primary/20 border-primary dark:border-primary/50"
        )}>
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && (
            <img
              src={getIconUrl(selectedOption.icon)}
              alt=""
              className="w-5 h-5 shrink-0 rounded-sm"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://api.iconify.design/lucide/folder-kanban.svg"
              }}
            />
          )}
          <span
            className={cn(
              !selectedOption && "text-muted-foreground dark:text-muted-foreground/70",
              "truncate font-medium"
            )}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <svg
          className={cn(
            "w-4 h-4 transition-transform text-muted-foreground",
            isOpen && "rotate-180"
          )}
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
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-card border border-border dark:border-border/50 rounded-xl shadow-xl max-h-80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Search Input */}
          {searchable && (
            <div className="p-2.5 border-b border-border dark:border-border/50">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groups..."
                  className={cn(
                    "w-full pl-9 pr-3 py-2 text-sm rounded-md border",
                    "bg-transparent dark:bg-secondary/30",
                    "border-border dark:border-border/50",
                    "text-foreground dark:text-secondary-foreground",
                    "placeholder:text-muted-foreground dark:placeholder:text-secondary-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent",
                    "transition-colors"
                  )}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                  onKeyUp={(e) => {
                    e.stopPropagation()
                  }}
                  onKeyPress={(e) => {
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground dark:hover:text-secondary-foreground transition-colors">
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
          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-sm text-center">
                {searchQuery ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-muted-foreground dark:text-muted-foreground/70">
                      No groups found
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {options.length} total groups
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground dark:text-muted-foreground/70">
                    No groups available
                  </span>
                )}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchQuery("")
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-all flex items-center gap-3 rounded-lg",
                    "hover:bg-primary/10 dark:hover:bg-primary/5 hover:text-foreground dark:hover:text-card-foreground",
                    "focus:outline-none focus:bg-primary/20 dark:focus:bg-primary/10",
                    value === option.value &&
                      "bg-primary/15 dark:bg-primary/10 text-foreground dark:text-card-foreground font-medium shadow-sm"
                  )}>
                  {option.icon && (
                    <img
                      src={getIconUrl(option.icon)}
                      alt=""
                      className="w-5 h-5 shrink-0 rounded-sm"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://api.iconify.design/lucide/folder-kanban.svg"
                      }}
                    />
                  )}
                  <span className="truncate flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Results Count */}
          {searchable && searchQuery && (
            <div className="px-4 py-2 text-xs text-center border-t border-border dark:border-border/50 bg-muted/30 dark:bg-muted/10">
              {filteredOptions.length} of {options.length} groups
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Simple Modal Component - Modernized
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
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}>
        <div
          className={cn(
            "bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-border dark:border-border/50",
            "animate-in fade-in zoom-in-95 duration-200"
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

  const { userData, loading: isLoadingUser } = useUser()
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    limit: 100,
    includeChannels: true
  })

  // Dark mode detection with proper cleanup
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Reset modal state when opened
  useEffect(() => {
    if (isModalOpen) {
      setChannelInfo(getChannelInfoFromVideo())
      setSelectedGroup("")
    }
  }, [isModalOpen])

  // Track video changes for checking if channel is already in a group
  const videoId = useMemo(
    () =>
      new URLSearchParams(window.location.search).get("v") ||
      window.location.pathname,
    [window.location.search, window.location.pathname]
  )

  // Check if channel is already in a group
  useEffect(() => {
    const info = getChannelInfoFromVideo()
    if (!info.channelId || !groupsData?.data) {
      setExistingGroup(null)
      return
    }

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
        "fixed bottom-4 right-4 z-[2147483647] px-4 py-3 rounded-xl shadow-lg",
        "bg-emerald-600 text-white text-sm font-medium flex items-center gap-2",
        "animate-in slide-in-from-bottom-2 fade-in"
      )
      notification.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Channel added to group!`
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
    } catch (error) {
      console.error("Error adding channel:", error)

      const notification = document.createElement("div")
      notification.className = cn(
        "fixed bottom-4 right-4 z-[2147483647] px-4 py-3 rounded-xl shadow-lg",
        "bg-red-600 text-white text-sm font-medium flex items-center gap-2",
        "animate-in slide-in-from-bottom-2 fade-in"
      )
      notification.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Failed to add channel`
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup, channelInfo])

  const groupOptions = useMemo(
    () =>
      groupsData?.data?.map((group: any) => ({
        value: group.id,
        label: group.name,
        icon: group.icon || "lucide:folder-kanban"
      })) || [],
    [groupsData?.data]
  )

  // Only render if user is logged in and on video/shorts page
  // Don't return null immediately - let the anchor be found first
  console.log("[Groupify] QuickAddButton: Checking render conditions...")
  console.log("[Groupify] isLoadingUser:", isLoadingUser, "isLoadingGroups:", isLoadingGroups)
  console.log("[Groupify] userData?.email:", userData?.email)
  
  if (isLoadingUser || isLoadingGroups) {
    console.log("[Groupify] QuickAddButton: Returning placeholder (loading)")
    // Return a minimal placeholder to allow anchor finding
    return <div style={{ display: "none" }} data-groupify="placeholder" />
  }

  if (!userData?.email) {
    console.log("[Groupify] QuickAddButton: Returning null (no userData)")
    return null
  }

  const isVideoPage =
    window.location.pathname === "/watch" &&
    window.location.search.includes("v=")
  const isShortPage = window.location.pathname.startsWith("/shorts/")

  console.log("[Groupify] QuickAddButton: isVideoPage:", isVideoPage, "isShortPage:", isShortPage)

  if (!isVideoPage && !isShortPage) {
    console.log("[Groupify] QuickAddButton: Returning null (not video/shorts page)")
    return null
  }

  console.log("[Groupify] QuickAddButton: Rendering main component!")
  
  return (
    <div className={cn("flex items-center justify-center", isDarkMode && "dark")}>
      {existingGroup ? (
        // Already added state - show badge with gradient accent
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="h-4 w-4 shrink-0" />
          <span className="font-medium">Added to {existingGroup.name}</span>
        </div>
      ) : (
        // Add button with modern gradient styling
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "gap-3 h-11 px-4 text-base font-medium rounded-xl shadow-sm hover:shadow-md",
            "bg-background dark:bg-card border-input dark:border-input/50",
            "hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white",
            "border-emerald-200 dark:border-emerald-800/30 hover:border-emerald-300 dark:hover:border-emerald-700",
            "transition-all duration-200 flex items-center justify-center"
          )}>
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-red-500/20 to-pink-500/20 dark:from-red-500/30 dark:to-pink-500/30 shrink-0">
            <Layers className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add to Group</span>
          </div>
        </Button>
      )}

      {/* Modern Modal */}
      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          {/* Header with gradient icon */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground dark:text-card-foreground flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20">
                <UserPlus className="h-5 w-5 text-primary dark:text-primary" />
              </div>
              Add Channel to Group
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-muted-foreground hover:text-foreground dark:hover:text-card-foreground transition-colors rounded-full p-1 hover:bg-muted dark:hover:bg-muted/50">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Channel Info Card */}
          {channelInfo.channelName && (
            <div className="flex items-center gap-4 p-4 mb-6 rounded-xl bg-muted/50 dark:bg-muted/10 border border-border dark:border-border/50">
              {channelInfo.thumbnail && (
                <img
                  src={channelInfo.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base text-foreground dark:text-card-foreground truncate leading-tight">
                  {channelInfo.channelName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground truncate">
                    {channelInfo.channelId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Group Selection */}
          <div className="space-y-2 mb-8">
            <label className="text-sm font-medium text-foreground dark:text-card-foreground block">
              Select Group
            </label>
            <SimpleSelect
              value={selectedGroup}
              onChange={(val) => {
                setSelectedGroup(val)
              }}
              options={groupOptions}
              placeholder="Choose a group..."
              disabled={isLoadingGroups || groupOptions.length === 0}
              searchable={true}
            />
            {groupOptions.length === 0 && !isLoadingGroups && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                No groups available. Create one in your dashboard.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="px-5 text-sm rounded-lg dark:bg-card dark:text-card-foreground dark:border-input dark:hover:bg-accent">
              Cancel
            </Button>
            <Button
              onClick={handleAddChannel}
              disabled={!selectedGroup || isLoading || groupOptions.length === 0}
              className={cn(
                "gap-2 px-5 text-sm rounded-lg shadow-md hover:shadow-lg",
                !selectedGroup && "opacity-60 cursor-not-allowed"
              )}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isLoading ? "Adding..." : "Add Channel"}
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}

// Wrap with QueryClientProvider
function QuickAddWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuickAddButton />
    </QueryClientProvider>
  )
}

export default QuickAddWithProvider
