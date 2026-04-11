'use client';

import { WorkloadForm } from '@/components/workload';

export default function WorkloadFormPage() {
  return (
    <WorkloadForm
      onConfirm={() => {
        console.log('Confirming data...');
        // TODO: Implement confirm logic
      }}
    />
  );
}
