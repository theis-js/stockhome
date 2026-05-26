import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/view-product')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/view-product"!</div>
}
