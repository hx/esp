export interface AppCallbacks {
  undo?: () => void
  redo?: () => void
  reset?: () => void
}
