import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminUsersPage() {
  const users = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', plan: 'Free', status: 'Active', joined: 'Oct 24, 2026' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', plan: 'Pro', status: 'Active', joined: 'Oct 23, 2026' },
  ]

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-500 mt-2">Manage learners and access rights.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View all registered users on the platform.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.plan === 'Pro' ? 'default' : 'secondary'} className={user.plan === 'Pro' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-none' : ''}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell className="text-gray-500">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
