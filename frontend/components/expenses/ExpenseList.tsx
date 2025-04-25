'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, PlusCircle, Trash2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoryLabel, formatCurrency } from '@/lib/utils';
import axiosInstance from '@/lib/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return format(date, 'PP');
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => getCategoryLabel(row.original.category),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return formatCurrency(row.original.amount);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedExpense(row.original);
                setIsEditDialogOpen(true);
              }}
              className="hover:text-primary transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setDeletingId(row.original._id as string);
                setSelectedExpense(row.original);
                setIsDeleteDialogOpen(true);
              }}
              className="hover:text-destructive transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async () => {
    if (!deletingId) return;

    try {
      await axiosInstance.delete(`/expenses/${deletingId}`);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      setSelectedExpense(null);
    }
  };

  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    try {
      const headers = ['Date', 'Category', 'Description', 'Amount'];
      const csvData = expenses.map(expense => [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        getCategoryLabel(expense.category),
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.amount.toString()
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Expenses exported to CSV');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export expenses to CSV');
    }
  };

  const exportToPDF = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      
      doc.setFontSize(18);
      doc.setTextColor(33, 33, 33);
      doc.text('Expense Report', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 30);
      
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      doc.setTextColor(33, 33, 33);
      doc.text(`Total Expenses: ${formatCurrency(total)}`, 20, 38);
      
      const columns = ['Date', 'Category', 'Description', 'Amount'];
      
      if (typeof doc.autoTable !== 'function') {
        doc.setFillColor(66, 139, 202);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        
        const colWidths = [30, 35, 80, 35];
        let startY = 50;
        
        doc.rect(20, startY, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], 10, 'F');
        
        let startX = 20;
        for (let i = 0; i < columns.length; i++) {
          doc.text(columns[i], startX + 3, startY + 6);
          startX += colWidths[i];
        }
        
        startY += 10;
        let isEven = false;
        
        for (const expense of expenses) {
          if (isEven) {
            doc.setFillColor(240, 240, 240);
            doc.rect(20, startY, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], 10, 'F');
          }
          
          doc.setTextColor(33, 33, 33);
          
          doc.text(format(new Date(expense.date), 'PP'), 23, startY + 6);
          
          doc.text(getCategoryLabel(expense.category), 53, startY + 6);
          
          const desc = expense.description.length > 35 
            ? `${expense.description.substring(0, 32)}...` 
            : expense.description;
          doc.text(desc, 88, startY + 6);
          
          doc.text(formatCurrency(expense.amount), 168, startY + 6);
          
          startY += 10;
          isEven = !isEven;
          
          if (startY > 270) {
            doc.addPage();
            startY = 20;
            isEven = false;
          }
        }
      } else {
        const tableData = expenses.map(expense => [
          format(new Date(expense.date), 'PP'),
          getCategoryLabel(expense.category),
          expense.description,
          formatCurrency(expense.amount)
        ]);
        
        doc.autoTable({
          head: [columns],
          body: tableData,
          startY: 45,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          margin: { left: 20, right: 20 }
        });
      }
      
      doc.save(`expenses_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast.success('Expenses exported to PDF');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to export expenses to PDF');
    }
  };

  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Manage and track your expenses</CardDescription>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm
                onSuccess={() => {
                  setIsAddDialogOpen(false);
                  fetchExpenses();
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={expenses}
            searchKey="description"
          />
        )}

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            {selectedExpense && (
              <ExpenseForm
                expense={selectedExpense}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchExpenses();
                }}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this expense. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteExpense}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}