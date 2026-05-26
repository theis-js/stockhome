import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_hiddenLayout/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_hiddenLayout/profile"!</div>
}
