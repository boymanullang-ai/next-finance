import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Link2, MoreHorizontal } from 'lucide-react'

export default function AdminSpreadsheetsPage() {
  const sources = [
    { id: 1, name: 'Accounting Equation Basics', sheetId: '1AbCdEfGhIjKlMnOpQrStUvWxYz', lessonId: 'acct-eq-001', status: 'valid', lastSync: '2 hrs ago' },
    { id: 2, name: 'Income Statement Build', sheetId: '2AbCdEfGhIjKlMnOpQrStUvWxYz', lessonId: 'is-build-001', status: 'invalid', lastSync: '1 day ago' },
  ]

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spreadsheet Sources</h1>
          <p className="text-gray-500 mt-2">Manage the Google Sheets that power the lesson content.</p>
        </div>
        <Button>Register New Source</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Sheets</CardTitle>
          <CardDescription>
            These sheets are mapped to registered lesson IDs in the curriculum.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson Content</TableHead>
                <TableHead>Sheet ID</TableHead>
                <TableHead>Mapped Lesson ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Validation</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((src) => (
                <TableRow key={src.id}>
                  <TableCell className="font-medium">{src.name}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[150px] truncate text-gray-500 flex items-center gap-1">
                    {src.sheetId}
                    <Link2 className="h-3 w-3" />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{src.lessonId}</TableCell>
                  <TableCell>
                    <Badge variant={src.status === 'valid' ? 'default' : 'destructive'} className={src.status === 'valid' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-none' : ''}>
                      {src.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{src.lastSync}</TableCell>
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
