import { gql } from '@apollo/client';

export const GET_FARM_SUMMARY = gql`
  query GetFarmSummary($period: String, $startDate: Date!, $endDate: Date!) {
    farmProductivityReport(period: $period, startDate: $startDate, endDate: $endDate) {
      totalCropYield
      totalLivestockProducts
      revenueByCategory
      expenseByCategory
      netProfit
      mostProductiveSection
      leastProductiveSection
    }
    profitLossStatement(startDate: $startDate, endDate: $endDate) {
      totalRevenue
      totalExpenses
      grossProfit
      netProfit
      revenueByCategory
      expenseByCategory
    }
    livestockProductivity(period: $period) {
      livestockType {
        name
      }
      totalProducts
      productTrend
      feedCostPerUnit
      mortalityRate
    }
    pendingTasks {
      highPriority {
        id
        title
        dueDate
        assignedTo {
          username
        }
      }
      mediumPriority {
        id
        title
        dueDate
      }
      overdueTasks {
        id
        title
        dueDate
      }
      totalCount
    }
  }
`;


export const GET_DETAILED_REPORTS = gql`
  query GetDetailedReports($reportType: String!, $startDate: Date, $endDate: Date) {
    detailedReport(reportType: $reportType, startDate: $startDate, endDate: $endDate) {
      data
      charts
      summary
    }
  }
`;