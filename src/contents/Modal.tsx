import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"

interface GroupOption {
  id: string
  name: string
  icon: string
  parentId: string | null
  nestingLevel: number
  displayOrder: number
  channelCount: number
}

const fetchGroups = async (): Promise<GroupOption[]> => {
  try {
    const response = await fetch(
      "https://api.groupify.dev/api/v3/groups?limit=100",
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    const data = await response.json()
    return data.data || []
  } catch {
    return []
  }
}

const addChannelToGroup = async (
  groupId: string,
  name: string,
  url: string
) => {
  try {
    const response = await fetch(
      `https://api.groupify.dev/api/v3/groups/${groupId}/channels`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          channelId: url,
          url,
          contentType: "website"
        })
      }
    )
    return response.ok
  } catch {
    return false
  }
}

const getIconUrl = (iconName: string) => {
  if (!iconName) return "https://api.iconify.design/lucide/folder-kanban.svg"
  if (iconName.startsWith("http")) return iconName
  return `https://api.iconify.design/${iconName.replace(":", "/")}.svg`
}

interface ModalProps {
  onClose: () => void
}

const Modal = ({ onClose }: ModalProps) => {
  const [groups, setGroups] = useState<GroupOption[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const currentUrl = window.location.href
  const currentTitle = document.title || "Untitled"

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDark(mediaQuery.matches)
    mediaQuery.addEventListener("change", (e) => setIsDark(e.matches))
  }, [])

  useEffect(() => {
    fetchGroups().then((g) => {
      setGroups(g)
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = async () => {
    if (!selectedGroupId) return
    setIsSubmitting(true)
    const ok = await addChannelToGroup(
      selectedGroupId,
      currentTitle,
      currentUrl
    )
    setIsSubmitting(false)
    if (ok) {
      setSuccess(true)
      setTimeout(onClose, 1200)
    }
  }

  const rootGroups = groups.filter(
    (g) => !g.parentId || !groups.some((p) => p.id === g.parentId)
  )

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const shortcut = isMac ? "⌘⇧1" : "Ctrl+Shift+1"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "rgba(0,0,0,0.5)"
      }}
      onClick={onClose}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "380px",
          margin: "16px",
          background: isDark ? "#18181b" : "#fff",
          borderRadius: "12px",
          border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "16px",
                color: isDark ? "#fff" : "#18181b"
              }}>
              Add to Group
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              color: isDark ? "#71717a" : "#a1a1aa"
            }}>
            <kbd
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                background: isDark ? "#27272a" : "#f1f5f9",
                border: `1px solid ${isDark ? "#3f3f46" : "#e2e8f0"}`
              }}>
              {shortcut}
            </kbd>
            <button
              onClick={onClose}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDark ? "#a1a1aa" : "#71717a"
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
          {success ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 0"
              }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px"
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "15px",
                  color: isDark ? "#fff" : "#18181b"
                }}>
                Website added!
              </span>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: isDark ? "#d4d4d8" : "#3f3f46"
                  }}>
                  Current Page
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    background: isDark ? "#09090b" : "#f8fafc"
                  }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? "#71717a" : "#94a3b8"}
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span
                    style={{
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: isDark ? "#d4d4d8" : "#3f3f46"
                    }}>
                    {currentTitle}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: isDark ? "#d4d4d8" : "#3f3f46"
                  }}>
                  Select Group
                </label>
                <div
                  style={{
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    maxHeight: "200px",
                    overflow: "auto"
                  }}>
                  {isLoading ? (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: isDark ? "#71717a" : "#6b7280"
                      }}>
                      Loading groups...
                    </div>
                  ) : rootGroups.length === 0 ? (
                    <div style={{ padding: "16px", textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "13px",
                          color: isDark ? "#71717a" : "#6b7280",
                          marginBottom: "8px"
                        }}>
                        No groups yet
                      </p>
                      <a
                        href="https://groupify.dev/dashboard/groups"
                        target="_blank"
                        style={{
                          fontSize: "13px",
                          color: "#ef4444",
                          textDecoration: "underline"
                        }}>
                        Create a group
                      </a>
                    </div>
                  ) : (
                    <div style={{ padding: "4px" }}>
                      {rootGroups
                        .sort((a, b) => {
                          const orderA =
                            a.displayOrder === 0 ? 999 : a.displayOrder
                          const orderB =
                            b.displayOrder === 0 ? 999 : b.displayOrder
                          return orderA - orderB
                        })
                        .map((group) => (
                          <div
                            key={group.id}
                            onClick={() => setSelectedGroupId(group.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              background: selectedGroupId
                                ? "rgba(239, 68, 68, 0.1)"
                                : "transparent"
                            }}>
                            <img
                              src={getIconUrl(group.icon)}
                              alt=""
                              width="18"
                              height="18"
                              style={{ opacity: 0.7 }}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  "https://api.iconify.design/lucide/folder-kanban.svg"
                              }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: "13px",
                                color: isDark ? "#e4e4e7" : "#27272a"
                              }}>
                              {group.name}
                            </span>
                            {selectedGroupId === group.id && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {!success && (
          <div style={{ padding: "0 16px 16px" }}>
            <button
              onClick={handleSubmit}
              disabled={!selectedGroupId || isSubmitting}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                border: "none",
                background: selectedGroupId ? "#ef4444" : "#3f3f46",
                color: "white",
                fontWeight: 500,
                fontSize: "14px",
                cursor:
                  selectedGroupId && !isSubmitting ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  Adding...
                </>
              ) : (
                "Add to Group"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

let modalRoot: ReturnType<typeof createRoot> | null = null

export const openModal = () => {
  if (modalRoot) return

  const container = document.createElement("div")
  container.id = "groupify-add-website-modal"
  container.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
  `
  document.body.appendChild(container)

  modalRoot = createRoot(container)
  modalRoot.render(
    <Modal
      onClose={() => {
        modalRoot?.unmount()
        modalRoot = null
        container.remove()
      }}
    />
  )
}

export const closeModal = () => {
  if (modalRoot) {
    modalRoot.unmount()
    modalRoot = null
    const container = document.getElementById("groupify-add-website-modal")
    container?.remove()
  }
}
