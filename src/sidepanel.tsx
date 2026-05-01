import { zodResolver } from "@hookform/resolvers/zod"
import {
  Eye,
  EyeOff,
  ChevronRight,
  Loader2,
  Layers,
  Plus,
  AlertCircle,
  Globe
} from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { useUser } from "@/hooks/useQuery/useUser"
import { cn, getChannelUrl } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroup } from "@/hooks/useQuery/useGroups"
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations"
import { useCreateChannel } from "@/hooks/useQuery/useChannels"
import { apiClient } from "@/hooks/api/api-client"

let url = process.env.PLASMO_PUBLIC_GROUPIFY_URL
const queryClient = new QueryClient()

import "./style.css"

function getBrowserType() {
  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined")
    return "chrome"
  if (typeof (window as any).browser !== "undefined") return "firefox"
  if (typeof (window as any).safari !== "undefined") return "safari"
  return "unknown"
}

interface ApiGroup {
  id: string
  name: string
  channelCount: number
  category: string
  createdAt: string
  icon: string
  parentId: string | null
  nestingLevel: number
  displayOrder: number
}

interface TableGroup extends ApiGroup {
  expanded: boolean
}

const getIconUrl = (iconName: string) => {
  if (!iconName) return "https://api.iconify.design/lucide/folder-kanban.svg"
  if (iconName.startsWith("http")) return iconName
  return `https://api.iconify.design/${iconName.replace(":", "/")}.svg`
}

const GroupSkeleton = () => (
  <div className="flex items-center gap-2 px-2 py-1.5">
    <Skeleton className="h-3.5 w-3.5 rounded-sm" />
    <Skeleton className="h-3.5 w-3.5 rounded-sm" />
    <Skeleton className="h-3.5 w-20 rounded-sm" />
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-4">
      <Layers className="h-6 w-6 text-primary dark:text-white/60" />
    </div>
    <p className="text-base font-medium dark:text-white/90 mb-1">
      No groups yet
    </p>
    <p className="text-sm text-muted-foreground dark:text-white/50 mb-4 text-center">
      Create groups to organize your channels
    </p>
    <Button
      size="sm"
      className="h-9 text-sm gap-2"
      onClick={() =>
        window.open("https://groupify.dev/dashboard/groups", "_blank")
      }>
      <Plus className="h-4 w-4" />
      Create Group
    </Button>
  </div>
)

const ChannelItem = ({ channel }: { channel: any }) => (
  <a
    href={getChannelUrl(channel.contentType, channel.url)}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent/50 dark:hover:bg-white/5 transition-colors group">
    <Avatar className="h-6 w-6 shrink-0">
      <AvatarImage
        src={channel.thumbnail}
        alt={channel.name}
        className="object-cover"
      />
      <AvatarFallback className="dark:bg-white/10">
        <div className="w-2 h-2 rounded-full bg-primary/50 dark:bg-white/30" />
      </AvatarFallback>
    </Avatar>
    <span className="text-base truncate dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white">
      {channel.name}
    </span>
  </a>
)

const ChannelsLoader = () => (
  <div className="flex items-center justify-center py-2">
    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/50 dark:text-white/30" />
  </div>
)

const ExpandedChannels = ({ groupId }: { groupId: string }) => {
  const { data: groupData, isLoading } = useGroup(groupId)

  if (isLoading) return <ChannelsLoader />

  const channels = groupData?.channels || []

  if (channels.length === 0) {
    return (
      <div className="text-xs text-muted-foreground/50 dark:text-white/30 px-2 py-1">
        No channels
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
    </div>
  )
}

const GroupItem = ({
  group,
  onToggle
}: {
  group: TableGroup
  onToggle: (id: string) => void
}) => (
  <Collapsible open={group.expanded} onOpenChange={() => onToggle(group.id)}>
    <CollapsibleTrigger asChild>
      <div
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2.5 rounded-md cursor-pointer transition-all",
          "hover:bg-accent/50 dark:hover:bg-white/5",
          group.expanded && "bg-accent/30 dark:bg-white/5"
        )}
        style={{ paddingLeft: `${12 + group.nestingLevel * 12}px` }}>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground/60 dark:text-white/40 shrink-0 transition-transform",
            group.expanded && "rotate-90"
          )}
        />
        <img
          src={getIconUrl(group.icon)}
          alt=""
          className="h-5 w-5 shrink-0 opacity-70"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = getIconUrl(
              "lucide:folder-kanban"
            )
          }}
        />
        <span className="text-base truncate flex-1 dark:text-white/90">
          {group.name}
        </span>
        {group.channelCount > 0 && (
          <Badge
            variant="secondary"
            className="text-xs h-5 px-2 font-medium dark:bg-white/10 dark:text-white/70">
            {group.channelCount}
          </Badge>
        )}
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div
        style={{ paddingLeft: `${24 + group.nestingLevel * 12}px` }}
        className="py-1">
        <ExpandedChannels groupId={group.id} />
      </div>
    </CollapsibleContent>
  </Collapsible>
)

function IndexSidePanel() {
  const [showPassword, setShowPassword] = useState(false)
  const [groups, setGroups] = useState<TableGroup[]>([])
  const [showAddPageModal, setShowAddPageModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [pageInfo, setPageInfo] = useState({
    url: "",
    title: "",
    thumbnail: ""
  })
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    limit: 100
  })
  const { userData, loading: isLoadingUser } = useUser()
  const createChannel = useCreateChannel()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const transformApiGroups = (apiGroups?: ApiGroup[]): TableGroup[] => {
    if (!apiGroups) return []

    return apiGroups.map((group, index) => ({
      ...group,
      channelCount: group.channelCount || 0,
      icon: group.icon || "lucide:folder-kanban",
      parentId: group.parentId || null,
      expanded: false,
      nestingLevel: group.nestingLevel || 0,
      displayOrder: group.displayOrder ?? index
    }))
  }

  useEffect(() => {
    if (groupsData?.data)
      setGroups(transformApiGroups(groupsData.data as ApiGroup[]))
  }, [groupsData?.data])

  const toggleExpand = (id: string) => {
    setGroups(
      groups.map((g) => (g.id === id ? { ...g, expanded: !g.expanded } : g))
    )
  }

  const getSortedGroups = () => {
    const result: TableGroup[] = []
    const processed = new Set<string>()

    const roots = groups.filter(
      (g) => g.parentId === null || !groups.some((p) => p.id === g.parentId)
    )

    const addGroup = (group: TableGroup) => {
      if (processed.has(group.id)) return
      result.push(group)
      processed.add(group.id)
      if (group.expanded) {
        groups.filter((g) => g.parentId === group.id).forEach(addGroup)
      }
    }

    roots.forEach(addGroup)
    return result
  }

  const sortedGroups = getSortedGroups()

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password required").min(6, "Min 6 characters")
  })

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })

  const loginMutation = useLoginMutation()

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await loginMutation.mutateAsync(data as any)
    } catch (error: any) {
      form.setError("root", {
        type: "manual",
        message: error?.message || "Login failed"
      })
    }
  }

  const handleSocialAuth = (provider: string) => {
    const browserType = getBrowserType()
    window.open(`${url}/auth/${provider}?origin=${browserType}`)
  }

  if (userData?.email) {
    return (
      <div
        className={cn(
          "flex flex-col h-screen",
          isDarkMode && "dark bg-background text-white"
        )}>
        <ScrollArea className="h-full">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/80 to-primary dark:from-white/20 dark:to-white/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary-foreground dark:text-white" />
                </div>
                <span className="text-lg font-bold">Groups</span>
                {sortedGroups.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs h-5 px-2 font-medium dark:bg-white/10">
                    {sortedGroups.length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-sm gap-1.5 dark:text-white/50 dark:hover:text-white"
                  onClick={() => setShowAddPageModal(true)}>
                  <Globe className="h-4 w-4" />
                  Add Page
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-sm gap-1 dark:text-white/50 dark:hover:text-white"
                  onClick={() =>
                    window.open(
                      "https://groupify.dev/dashboard/groups",
                      "_blank"
                    )
                  }>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="mb-3" />

            {isLoadingGroups || isLoadingUser ? (
              <div className="space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <GroupSkeleton key={i} />
                ))}
              </div>
            ) : sortedGroups.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-0.5">
                {sortedGroups.map((group) => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    onToggle={toggleExpand}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {showAddPageModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAddPageModal(false)}>
            <div
              className="w-full max-w-[320px] rounded-xl border border-white/10 bg-gray-900 overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-semibold">Add Page</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50"
                  onClick={() => setShowAddPageModal(false)}>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {addSuccess ? (
                  <div className="flex flex-col items-center py-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-base font-medium">Page added!</span>
                    <span className="text-sm text-white/50">
                      {pageInfo.url}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Page URL
                      </label>
                      <Input
                        value={pageInfo.url}
                        onChange={(e) =>
                          setPageInfo({ ...pageInfo, url: e.target.value })
                        }
                        placeholder="https://example.com"
                        className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-white/70">
                        Select Group
                      </span>
                      <div className="max-h-[160px] overflow-auto rounded-md border border-white/10">
                        {sortedGroups.length === 0 ? (
                          <div className="p-4 text-center text-sm text-white/50">
                            No groups yet
                          </div>
                        ) : (
                          sortedGroups.map((group) => (
                            <div
                              key={group.id}
                              className={cn(
                                "flex items-center gap-2 px-2 py-2 cursor-pointer",
                                selectedGroupId === group.id
                                  ? "bg-primary/10 bg-white/10"
                                  : "hover:bg-accent/50 hover:bg-white/5"
                              )}
                              onClick={() => setSelectedGroupId(group.id)}>
                              <img
                                src={getIconUrl(group.icon)}
                                alt=""
                                className="w-4 h-4 opacity-70"
                              />
                              <span className="flex-1 text-sm truncate text-white/90">
                                {group.name}
                              </span>
                              {selectedGroupId === group.id && (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full h-10 text-sm font-medium bg-primary hover:bg-primary/90"
                      disabled={!selectedGroupId || isAdding}
                      onClick={async () => {
                        if (!selectedGroupId || !pageInfo.url) return
                        setIsAdding(true)
                        try {
                          let name = pageInfo.url
                          let thumbnail = ""
                          let contentType = "website"

                          try {
                            const proxyResponse = await apiClient.post<any>(
                              "/api/v3/proxy/fetch-url",
                              { url: pageInfo.url }
                            )
                            if (proxyResponse.data) {
                              name = proxyResponse.data.title || name
                              thumbnail = proxyResponse.data.thumbnail || ""
                            }
                          } catch (proxyErr) {
                            console.warn(
                              "Proxy fetch failed, using URL as name:",
                              proxyErr
                            )
                          }

                          await createChannel.mutateAsync({
                            groupId: selectedGroupId,
                            name,
                            channelId: pageInfo.url,
                            url: pageInfo.url,
                            thumbnail: thumbnail || undefined,
                            contentType: contentType || "website"
                          })
                          setAddSuccess(true)
                          setTimeout(() => {
                            setShowAddPageModal(false)
                            setAddSuccess(false)
                            setSelectedGroupId(null)
                            setPageInfo({ url: "", title: "", thumbnail: "" })
                          }, 1200)
                        } catch (err) {
                          console.error("Error adding page:", err)
                        } finally {
                          setIsAdding(false)
                        }
                      }}>
                      {isAdding ? "Adding..." : "Add to Group"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center p-6",
        isDarkMode && "dark bg-background text-white"
      )}>
      <Card className="w-full max-w-[360px] border-border/50 dark:border-white/5 dark:bg-white/[0.02]">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 dark:from-white/20 dark:to-white/10 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 dark:shadow-none">
            <Layers className="h-7 w-7 text-primary-foreground dark:text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground dark:text-white/50 mt-1">
            Sign in to access your groups
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 pb-5">
              {form.formState.errors.root && (
                <Alert
                  variant="destructive"
                  className="text-sm py-2.5 dark:bg-red-500/10 dark:border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="dark:text-red-300/80">
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium dark:text-white/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 text-base dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/30"
                      />
                    </FormControl>
                    <FormMessage className="text-xs dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium dark:text-white/70">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 pr-11 text-base dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/30"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent dark:text-white/40"
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff className="h-4.5 w-4.5" />
                          ) : (
                            <Eye className="h-4.5 w-4.5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs dark:text-red-400" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex-col gap-4 pt-0 pb-8">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative w-full">
                <Separator className="dark:bg-white/5" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground dark:bg-transparent dark:text-white/30">
                  or
                </span>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 text-sm gap-2.5 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                  onClick={() => handleSocialAuth("discord")}>
                  <Icons.discord className="h-4.5 w-4.5" />
                  Discord
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 text-sm gap-2.5 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                  onClick={() => handleSocialAuth("google")}>
                  <Icons.google className="h-4.5 w-4.5" />
                  Google
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

function SidePanelWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <IndexSidePanel />
    </QueryClientProvider>
  )
}

export default SidePanelWithQueryClient
