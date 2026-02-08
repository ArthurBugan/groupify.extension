import { zodResolver } from "@hookform/resolvers/zod"
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Loader2,
  Layers,
  FolderOpen,
  Plus,
  LogOut,
  User,
  ExternalLink,
  AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { useUser } from "@/hooks/useQuery/useUser"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  type LoginCredentials,
  useLoginMutation
} from "@/hooks/mutations/useAuthMutations"
import { IconViewer } from "@/components/icon-picker"
import { ExpandedGroup } from "@/components/expanded-group"

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

let url = process.env.PLASMO_PUBLIC_GROUPIFY_URL

const queryClient = new QueryClient()

import "@/style.css"

function getBrowserType() {
  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
    return "chrome"
  } else if (
    typeof (window as any).browser !== "undefined" &&
    typeof (window as any).browser.runtime !== "undefined"
  ) {
    return "firefox"
  } else if (
    typeof (window as any).safari !== "undefined" &&
    typeof (window as any).safari.extension !== "undefined"
  ) {
    return "safari"
  } else {
    return "unknown"
  }
}

// Loading Skeleton Component
const GroupsLoadingSkeleton = () => (
  <div className="space-y-3 animate-in fade-in duration-300">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <Separator />
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-8 ml-auto" />
        </div>
      ))}
    </div>
  </div>
)

// Empty State Component
const EmptyGroupsState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="rounded-full bg-muted p-4 mb-4">
      <FolderOpen className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
      Create your first group to start organizing your favorite channels
    </p>
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() =>
        window.open("https://groupify.dev/dashboard/groups", "_blank")
      }>
      <Plus className="h-4 w-4" />
      Create Group
    </Button>
  </div>
)

// Group Item Component
const GroupListItem = ({
  group,
  onToggle
}: {
  group: TableGroup
  onToggle: (id: string) => void
}) => {
  return (
    <Collapsible
      open={group.expanded}
      onOpenChange={() => onToggle(group.id)}
      className="group/item">
      <div
        className={cn(
          "flex items-center rounded-lg transition-colors",
          "hover:bg-accent/50"
        )}
        style={{ paddingLeft: `${group.nestingLevel * 16}px` }}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start h-11 px-3 gap-2 font-normal hover:bg-transparent">
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                group.expanded && "rotate-90"
              )}
            />
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 shrink-0">
                <IconViewer
                  icon={group.icon || "lucide:folder-kanban"}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-sm font-medium truncate">{group.name}</span>
            </div>
            {group.channelCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 shrink-0">
                {group.channelCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div
          className="py-1"
          style={{ paddingLeft: `${(group.nestingLevel + 1) * 16 + 24}px` }}>
          <ExpandedGroup group={group} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// User Header Component
const UserHeader = ({ email }: { email: string }) => (
  <div className="flex items-center justify-between p-4 bg-card border-b border-border">
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">{email}</span>
        <span className="text-xs text-muted-foreground">Signed in</span>
      </div>
    </div>
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() =>
              window.open("https://groupify.dev/dashboard/groups", "_blank")
            }>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Open Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)

function IndexSidePanel() {
  const [showPassword, setShowPassword] = useState(false)
  const [groups, setGroups] = useState<TableGroup[]>([])
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    limit: 100
  })

  const transformApiGroups = (apiGroups?: ApiGroup[]): TableGroup[] => {
    if (!apiGroups) return []

    return apiGroups?.map((group, index) => ({
      ...group,
      channelCount: group.channelCount || 0,
      category: group.category || "General",
      createdAt: new Date(group.createdAt).toLocaleDateString(),
      icon: group.icon || "lucide:folder-kanban",
      parentId: group.parentId || null,
      expanded: false,
      nestingLevel: group.nestingLevel || 0,
      displayOrder: group.displayOrder ?? index
    }))
  }

  useEffect(() => {
    if (groupsData?.data) {
      setGroups(transformApiGroups(groupsData.data as ApiGroup[]))
    }
  }, [groupsData?.data])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const { userData, loading: isLoadingUser } = useUser()

  const toggleExpand = (id: string) => {
    setGroups(
      groups.map((group) =>
        group.id === id ? { ...group, expanded: !group.expanded } : group
      )
    )
  }

  const getSortedGroups = () => {
    const result: TableGroup[] = []
    const processedGroups = new Set<string>()

    const groupsWithoutParentsInDataset = groups.filter((group) => {
      if (group.parentId === null) return true
      const parentExists = groups.some((g) => g.id === group.parentId)
      return !parentExists
    })

    const sortedRootGroups = groupsWithoutParentsInDataset.sort((a, b) => {
      // If displayOrder is 0, treat it as Infinity (put at end)
      const orderA = a.displayOrder === 0 ? Infinity : a.displayOrder
      const orderB = b.displayOrder === 0 ? Infinity : b.displayOrder
      return orderA - orderB
    })

    const addGroupAndChildren = (group: TableGroup) => {
      if (processedGroups.has(group.id)) return

      result.push(group)
      processedGroups.add(group.id)

      if (group.expanded) {
        const children = groups
          .filter((g) => g.parentId === group.id)
          .sort((a, b) => {
            const orderA = a.displayOrder === 0 ? Infinity : a.displayOrder
            const orderB = b.displayOrder === 0 ? Infinity : b.displayOrder
            return orderA - orderB
          })
        children.forEach(addGroupAndChildren)
      }
    }

    sortedRootGroups.forEach(addGroupAndChildren)
    return result
  }

  const sortedGroups = getSortedGroups()

  const loginSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(1, chrome.i18n.getMessage("login_validation.password.required"))
      .min(6, chrome.i18n.getMessage("login_validation.password.min"))
  })

  type LoginFormData = z.infer<typeof loginSchema>

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const loginMutation = useLoginMutation()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data as LoginCredentials)
    } catch (error: any) {
      form.setError("root", {
        type: "manual",
        message: error?.message || "Login failed. Please try again."
      })
    }
  }

  const handleDiscordAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    const browserType = getBrowserType()
    window.open(`${url}/auth/discord?origin=${browserType}`)
  }

  const handleGoogleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    const browserType = getBrowserType()
    window.open(`${url}/auth/google?origin=${browserType}`)
  }

  if (userData?.email) {
    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-col h-screen bg-background">
          <UserHeader email={userData.email} />

          <div className="flex-1 overflow-hidden">
            {isLoadingGroups || isLoadingUser ? (
              <div className="p-4">
                <GroupsLoadingSkeleton />
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold">Your Groups</h1>
                        <p className="text-xs text-muted-foreground">
                          {sortedGroups.length} group
                          {sortedGroups.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        window.open(
                          "https://groupify.dev/dashboard/groups",
                          "_blank"
                        )
                      }>
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </Button>
                  </div>

                  <Separator className="mb-3" />

                  {sortedGroups.length === 0 ? (
                    <EmptyGroupsState />
                  ) : (
                    <div className="space-y-0.5">
                      {sortedGroups.map((group) => (
                        <GroupListItem
                          key={group.id}
                          group={group}
                          onToggle={toggleExpand}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1 justify-center items-center px-4 py-12 w-full">
        <div className="space-y-8 w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {chrome.i18n.getMessage("login_title")}
              </CardTitle>
              <CardDescription className="text-center">
                {chrome.i18n.getMessage("login_subtitle")}
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {form.formState.errors.root && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {form.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {chrome.i18n.getMessage("login_email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={chrome.i18n.getMessage(
                              "login_email.placeholder"
                            )}
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {chrome.i18n.getMessage("login_password")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={chrome.i18n.getMessage(
                                "login_password.placeholder"
                              )}
                              {...field}
                              className="h-11 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-0 right-0 px-3 py-2 h-full hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {chrome.i18n.getMessage("login_signing")}
                      </>
                    ) : (
                      chrome.i18n.getMessage("login_signin")
                    )}
                  </Button>

                  <div className="relative w-full py-2">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleDiscordAuth}
                      variant="outline"
                      className="h-11 gap-2"
                      type="button">
                      <Icons.discord className="w-4 h-4" />
                      <span>Discord</span>
                    </Button>
                    <Button
                      onClick={handleGoogleAuth}
                      variant="outline"
                      className="h-11 gap-2"
                      type="button">
                      <Icons.google className="w-4 h-4" />
                      <span>Google</span>
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
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
