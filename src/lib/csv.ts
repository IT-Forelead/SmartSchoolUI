import { Table, Row } from '@tanstack/react-table';
import { stringify as csvStringify } from "csv-stringify/sync"
import { Visit } from '@/models/common.interface';

export const downloadCsv = (table: Table<Visit>) => {
  const visits = table.getFilteredRowModel().rows.map((row: Row<Visit>) => {
    return {
      'Full Name': row.getValue('fullName'),
      'Group': row.original.groupLevel ? `${row.original.groupLevel}-${row.original.groupName}` : 'Teacher',
      'Visit Time': row.getValue('createdAt'),
      'Visit Type': row.getValue('visitType'),
      'Picture Link': row.original.assetId ? 'https://25-school.uz/asset/view/' + row.original.assetId : '',
    }
  });
  const csvFile = new Blob([csvStringify(visits, {header: true})], {type: 'text/csv'});
  const csvURL = window.URL.createObjectURL(csvFile);
  const tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', 'visits.csv');
  tempLink.click();
}
