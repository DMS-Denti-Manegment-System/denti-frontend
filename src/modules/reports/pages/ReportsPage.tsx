// src/modules/reports/pages/ReportsPage.tsx

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ReportsDashboard } from '../components/ReportsDashboard'
import { ErrorFallback } from '../../../shared/components/common/ErrorFallback'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ReportsPage: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload()
      }}
    >
      <ReportsDashboard 
        showFilters={true}
        compactMode={false}
      />
    </ErrorBoundary>
  )
}

export default ReportsPage