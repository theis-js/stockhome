import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/add-product')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/add-product"!</div>
}
