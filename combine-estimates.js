const XLSX = require('xlsx');

// Read both workbooks
const devWb = XLSX.read(require('fs').readFileSync('/workspace/eds_migration_estimates.xlsx'));
const authWb = XLSX.read(require('fs').readFileSync('/workspace/eds_authoring_estimates.xlsx'));

// Create new combined workbook
const combined = XLSX.utils.book_new();

// Add the Combined Summary from authoring as the first tab (has both dev + authoring)
XLSX.utils.book_append_sheet(combined, authWb.Sheets['Combined Summary'], 'Combined Summary');

// Add the original Summary (dev estimates)
XLSX.utils.book_append_sheet(combined, devWb.Sheets['Summary'], 'Dev & QA Summary');

// Add original dev estimate tabs
XLSX.utils.book_append_sheet(combined, devWb.Sheets['Global (UAE Pilot)'], 'Global (UAE Pilot)');
XLSX.utils.book_append_sheet(combined, devWb.Sheets['Country (Russia)'], 'Country (Russia)');

// Add authoring summary
XLSX.utils.book_append_sheet(combined, authWb.Sheets['Authoring Summary'], 'Authoring Summary');

// Add authoring detail tabs
XLSX.utils.book_append_sheet(combined, authWb.Sheets['AE (English) Detail'], 'AE (English) Detail');
XLSX.utils.book_append_sheet(combined, authWb.Sheets['AE_AR (Arabic) Detail'], 'AE_AR (Arabic) Detail');
XLSX.utils.book_append_sheet(combined, authWb.Sheets['RU (Russian) Detail'], 'RU (Russian) Detail');

// Write combined file
XLSX.writeFile(combined, '/workspace/eds_migration_estimates.xlsx');

console.log('Combined estimates file generated: /workspace/eds_migration_estimates.xlsx');
console.log('Tabs:');
for (const name of combined.SheetNames) {
  console.log('  - ' + name);
}
