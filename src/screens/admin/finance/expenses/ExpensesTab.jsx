import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../../services/api.js';
import { FinanceSectionCard } from '../../../../components/admin/finance/index.js';
import { ExpenseDetailDrawer } from '../../../../components/admin/finance/drilldown/index.js';
import ExpenseStatsBar from './ExpenseStatsBar';
import ExpenseFilterBar from './ExpenseFilterBar';
import ExpenseViewSwitcher from './ExpenseViewSwitcher';
import ExpenseTable from './ExpenseTable';
import VendorSummaryPanel from './VendorSummaryPanel';
import RecurringSummaryPanel from './RecurringSummaryPanel';

export default function ExpensesTab() {
  const token = localStorage.getItem('sajilo_token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // all | recurring | vendors
  const [filters, setFilters] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch all data
  useEffect(() => {
    async function fetchAll() {
      try {
        const [expRes, catRes, venRes] = await Promise.all([
          fetch(`${API_URL}/admin/expenses/expenses?limit=500`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/expenses/categories`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/expenses/vendors`, { headers }).then(r => r.json()),
        ]);
        if (expRes?.success) setExpenses(expRes.data || []);
        if (catRes?.success) setCategories(catRes.data || []);
        if (venRes?.success) setVendors(venRes.data || []);
      } catch (err) {
        console.error('[ExpensesTab] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const total = expenses.length;
    const pending = expenses.filter(e => e.status === 'pending').length;
    const approved = expenses.filter(e => e.status === 'approved').length;
    const paid = expenses.filter(e => e.status === 'paid').length;
    const recurringTotal = expenses
      .filter(e => e.expense_type === 'RECURRING')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return { total, pending, approved, paid, recurringTotal };
  }, [expenses]);

  // Filtered expenses for the table (all view and recurring view)
  const filteredExpenses = useMemo(() => {
    let list = [...expenses];

    if (viewMode === 'recurring') {
      list = list.filter(e => e.expense_type === 'RECURRING');
    }

    // Apply filters
    if (filters.status) list = list.filter(e => e.status === filters.status);
    if (filters.vendor) list = list.filter(e => e.vendor_id === filters.vendor);
    if (filters.category) list = list.filter(e => e.category_id === filters.category);
    if (filters.costCenter) list = list.filter(e => e.cost_center_code === filters.costCenter);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e => e.title?.toLowerCase().includes(q) || e.vendor_name?.toLowerCase().includes(q));
    }
    if (filters.from) list = list.filter(e => new Date(e.expense_date) >= new Date(filters.from));
    if (filters.to) list = list.filter(e => new Date(e.expense_date) <= new Date(filters.to));
    if (filters.amountMin) list = list.filter(e => parseFloat(e.amount) >= parseFloat(filters.amountMin));
    if (filters.amountMax) list = list.filter(e => parseFloat(e.amount) <= parseFloat(filters.amountMax));
    if (filters.expenseType) list = list.filter(e => e.expense_type === filters.expenseType);

    return list;
  }, [expenses, viewMode, filters]);

  // Vendor summary computed
  const vendorSummary = useMemo(() => {
    if (viewMode !== 'vendors') return [];
    const map = new Map();
    expenses.forEach(e => {
      if (!e.vendor_id) return;
      const key = e.vendor_id;
      if (!map.has(key)) {
        map.set(key, { vendor_id: e.vendor_id, vendor_name: e.vendor_name || 'Unknown', total_spent: 0, count: 0, last_expense: e.expense_date });
      }
      const item = map.get(key);
      item.total_spent += parseFloat(e.amount || 0);
      item.count += 1;
      if (new Date(e.expense_date) > new Date(item.last_expense)) item.last_expense = e.expense_date;
    });
    return Array.from(map.values());
  }, [expenses, viewMode]);

  // Recurring view: show expenses with RECURRING type, plus derived rule-like info
  const recurringExpenses = useMemo(() => {
    return expenses
      .filter(e => e.expense_type === 'RECURRING')
      .map(e => ({
        ...e,
        rule_name: e.title?.replace(' (Recurring)', ''),
        frequency: 'MONTHLY', // default; ideally from rule
        next_date: e.due_date || null,
        amount_type: e.amount_type || 'FIXED',
      }));
  }, [expenses]);

  return (
    <div>
      <ExpenseStatsBar stats={stats} />
      <ExpenseFilterBar
        filters={filters}
        onChange={setFilters}
        categories={categories}
        vendors={vendors}
      />
      <ExpenseViewSwitcher active={viewMode} onChange={setViewMode} />

      {viewMode === 'all' && (
        <ExpenseTable
          expenses={filteredExpenses}
          loading={loading}
          onRowClick={(expense) => setSelectedExpense(expense)}
        />
      )}

      {viewMode === 'recurring' && (
        <RecurringSummaryPanel
          recurringExpenses={recurringExpenses}
          loading={loading}
          onRowClick={(expense) => setSelectedExpense(expense)}
        />
      )}

      {viewMode === 'vendors' && (
        <VendorSummaryPanel
          vendorSummary={vendorSummary}
          loading={loading}
          onVendorClick={(vendorId) => {
            setViewMode('all');
            setFilters(prev => ({ ...prev, vendor: vendorId }));
          }}
        />
      )}

      <ExpenseDetailDrawer
        open={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
      />
    </div>
  );
}