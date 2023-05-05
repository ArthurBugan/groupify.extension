export { }

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.querySelector("html").classList.add("dark")
}