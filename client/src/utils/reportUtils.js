/**
 * Utilities for Date presets and CSV export in Reports
 */

export function exportToCSV(rows, filename = 'report') {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      headers.map(field => {
        const val = row[field] === null || row[field] === undefined ? '' : row[field];
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
  return { fromDate: firstDay, toDate: lastDay };
}

export function getLast30DaysRange() {
  const now = new Date();
  const past = new Date(now.getTime() - 30 * 86400000);
  return {
    fromDate: past.toISOString().split('T')[0],
    toDate: now.toISOString().split('T')[0]
  };
}

export function getNext30DaysRange() {
  const now = new Date();
  const future = new Date(now.getTime() + 30 * 86400000);
  return {
    fromDate: now.toISOString().split('T')[0],
    toDate: future.toISOString().split('T')[0]
  };
}

export function getCurrentSemesterRange() {
  const now = new Date();
  const year = now.getFullYear();
  // Odd semester July-Dec, Even semester Jan-June
  if (now.getMonth() >= 6) {
    return { fromDate: `${year}-07-01`, toDate: `${year}-12-31` };
  } else {
    return { fromDate: `${year}-01-01`, toDate: `${year}-06-30` };
  }
}

export function getYearToDateRange() {
  const now = new Date();
  return {
    fromDate: `${now.getFullYear()}-01-01`,
    toDate: now.toISOString().split('T')[0]
  };
}
