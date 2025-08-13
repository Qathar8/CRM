import * as XLSX from 'xlsx'
import { supabase } from './supabase'

export async function exportDealsToExcel() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Fetch deals with contact information
    const { data: deals, error } = await supabase
      .from('deals')
      .select(`
        *,
        contact:contacts(name, company, email, phone)
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data for Excel
    const excelData = deals.map(deal => ({
      'Deal Title': deal.title,
      'Value': deal.value || 0,
      'Stage': deal.stage,
      'Status': deal.status,
      'Priority': deal.priority,
      'Contact Name': deal.contact?.name || '',
      'Company': deal.contact?.company || '',
      'Contact Email': deal.contact?.email || '',
      'Contact Phone': deal.contact?.phone || '',
      'Expected Close Date': deal.expected_close_date || '',
      'Notes': deal.notes || '',
      'Created Date': new Date(deal.created_at).toLocaleDateString(),
      'Last Updated': new Date(deal.updated_at).toLocaleDateString()
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Deal Title
      { wch: 12 }, // Value
      { wch: 15 }, // Stage
      { wch: 10 }, // Status
      { wch: 10 }, // Priority
      { wch: 20 }, // Contact Name
      { wch: 20 }, // Company
      { wch: 25 }, // Contact Email
      { wch: 15 }, // Contact Phone
      { wch: 15 }, // Expected Close Date
      { wch: 30 }, // Notes
      { wch: 12 }, // Created Date
      { wch: 12 }  // Last Updated
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Deals')

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0]
    const filename = `sales-deals-${today}.xlsx`

    // Write and download file
    XLSX.writeFile(wb, filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Excel export error:', error)
    throw error
  }
}