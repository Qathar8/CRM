import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { ContactForm } from '@/components/contacts/contact-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useContacts } from '@/lib/queries'
import { Plus, Mail, Phone, Building } from 'lucide-react'

export default function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts()
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading contacts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <Button onClick={() => setIsContactFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Contacts ({contacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No contacts yet.</p>
                <Button onClick={() => setIsContactFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>
                        {contact.company ? (
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            {contact.company}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.email ? (
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.phone ? (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />
      </div>
    </div>
  )
}