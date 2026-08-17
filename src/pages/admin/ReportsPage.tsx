import React from 'react';
import { FileText, Download, FileSpreadsheet, Filter } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ReportsPage: React.FC = () => {
  const reports = [
    { title: 'Participant Enrollment Report', type: 'Participant Data', count: '1,840 records', format: 'CSV / PDF' },
    { title: 'Volunteer Impact & Hours Log', type: 'Volunteer Data', count: '312 volunteers (3,450 hrs)', format: 'CSV / PDF' },
    { title: 'Program Execution & Attendance Summary', type: 'Program Data', count: '24 programs', format: 'CSV / PDF' },
    { title: 'Location-wise Impact Brief', type: 'Impact Aggregation', count: '4 Cities', format: 'PDF' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Reports & Export Manager"
        subtitle="Generate, preview, and download structured CSV and PDF impact reports."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <Card key={rep.title} variant="solid" className="p-6 flex flex-col justify-between h-48 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rep.type}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{rep.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Includes {rep.count} • Formats: {rep.format}</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                Preview Data
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Generate CSV Report
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ApplicationShell>
  );
};
