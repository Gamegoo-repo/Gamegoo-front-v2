import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page-404')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/page-404"!</div>
}
