import { gql } from '@apollo/client';

// Authentication
export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth {
      id
      username
      email
      phone
      role
    }
  }
`;

// User Queries
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      phone
      role
      firstName
      lastName
      dateHired
      salary
      isActive
    }
  }
`;

export const LIST_USERS = gql`
  query ListUsers {
    allUsers {
          id
          username
          email
          phone
          role
          isActive
    }
  }
`;

// Farm Queries
export const GET_FARM = gql`
  query GetFarm($id: ID!) {
    farm(id: $id) {
      id
      name
      location
      totalHectares
      establishedDate
      description
      manager {
        id
        username
      }
      isActive
    }
  }
`;

export const LIST_FARMS = gql`
  query ListFarms {
    allFarms {
          id
          name
          location
          totalHectares
          manager {
            id
            username
          }
          isActive
        }
  }
`;

export const FARM_PERFORMANCE = gql`
  query FarmPerformance($farmId: ID!, $startDate: Date, $endDate: Date) {
    farmPerformance(farmId: $farmId, startDate: $startDate, endDate: $endDate) {
      totalAssets
      totalLivestock
      totalCrops
      totalExpenses
      totalSales
      profitability
      productionYield
    }
  }
`;

export const FARMS_SUMMARY = gql`
  query FarmsSummary {
    farmsSummary {
      farm {
        id
        name
      }
      totalAssets
      totalLivestock
      totalCrops
      totalExpenses
      totalSales
    }
  }
`;

// Asset Queries
export const GET_LIVESTOCK = gql`
  query GetLivestock($id: ID!) {
    livestock(id: $id) {
      id
      name
      livestockType
      breed
      ageAtAcquisition
      gender
      isBreedingStock
      acquisitionDate
      initialCost
      notes
      farm {
        id
        name
      }
    }
  }
`;

export const LIST_LIVESTOCK = gql`
  query ListLivestock($farmId: ID) {
    allLivestock(farmId: $farmId) {
          id
          name
          livestockType
          gender
          acquisitionDate
          farm {
            id
            name
          }
        }
  }
`;

export const LIVESTOCK_INVENTORY = gql`
  query LivestockInventory($farmId: ID) {
    livestockInventory(farmId: $farmId) {
      livestockType
      gender
      count
      avgAge
    }
  }
`;

export const GET_CROP = gql`
  query GetCrop($id: ID!) {
    crop(id: $id) {
      id
      name
      cropType
      plantingDate
      harvestDate
      areaPlanted
      expectedYield
      yieldUnit
      acquisitionDate
      initialCost
      notes
      farm {
        id
        name
      }
    }
  }
`;

// export const LIST_CROPS = gql`
//   query ListCrops($farmId: ID) {
//     allCrops(farmId: $farmId) {
//           id
//           name
//           cropType
//           plantingDate
//           harvestDate
//           areaPlanted
//           farm {
//             id
//             name
//           }
//         }
//   }
// `;

export const CROP_YIELD_ANALYSIS = gql`
  query CropYieldAnalysis($farmId: ID) {
    cropYieldAnalysis(farmId: $farmId) {
      cropType
      totalArea
      avgYield
      totalProduction
    }
  }
`;

export const ASSET_PRODUCTIVITY = gql`
  query AssetProductivity($assetId: ID!, $period: String) {
    assetProductivity(assetId: $assetId, period: $period) {
      asset {
        id
        name
      }
      totalProduction
      totalSales
      productionEfficiency
    }
  }
`;

export const TOP_PERFORMING_ASSETS = gql`
  query TopPerformingAssets($limit: Int, $farmId: ID) {
    topPerformingAssets(limit: $limit, farmId: $farmId) {
      asset {
        id
        name
      }
      totalProduction
      totalSales
      totalExpenses
      profitability
    }
  }
`;

// Production Queries
export const LIST_PRODUCTS = gql`
  query ListProducts {
    allProducts {
          id
          name
          productType
          unit
    }
  }
`;

export const PRODUCTION_TRENDS = gql`
  query ProductionTrends($productId: ID, $period: String, $lastN: Int) {
    productionTrends(productId: $productId, period: $period, lastN: $lastN) {
      period
      productName
      totalQuantity
      avgQuantity
    }
  }
`;

// Financial Queries
export const FARM_FINANCIALS = gql`
  query FarmFinancials($farmId: ID!, $year: Int) {
    farmFinancials(farmId: $farmId, year: $year) {
      farm {
        id
        name
      }
      year
      monthlyFinancials {
        month
        monthName
        totalSales
        totalExpenses
        profit
      }
      annualSummary {
        totalSales
        totalExpenses
        profit
      }
    }
  }
`;

export const PROFITABILITY_ANALYSIS = gql`
  query ProfitabilityAnalysis($period: String, $farmId: ID) {
    profitabilityAnalysis(period: $period, farmId: $farmId) {
      period
      totalSales
      totalExpenses
      profit
    }
  }
`;

export const EXPENSE_BREAKDOWN = gql`
  query ExpenseBreakdown($farmId: ID, $period: String) {
    expenseBreakdown(farmId: $farmId, period: $period) {
      expenseType
      totalAmount
      percentage
    }
  }
`;

// Sales Queries
export const SALES_ANALYSIS = gql`
  query SalesAnalysis($startDate: Date!, $endDate: Date!, $farmId: ID) {
    salesAnalysis(startDate: $startDate, endDate: $endDate, farmId: $farmId) {
      totalSales
      totalTransactions
      salesByProduct {
        productName
        totalAmount
        count
      }
      salesByType {
        saleType
        totalAmount
        count
      }
    }
  }
`;

export const CUSTOMER_SALES = gql`
  query CustomerSales($minAmount: Decimal, $period: String) {
    customerSales(minAmount: $minAmount, period: $period) {
      buyer
      totalAmount
      transactionCount
      lastPurchaseDate
    }
  }
`;

export const LIST_SALES = gql`
  query ListSales {
    allSales {
          id
          saleType
          quantity
          unitPrice
          totalAmount
          saleDate
          buyer
          notes
          product {
            id
            name
          }
          asset {
            id
            name
          }
          recordedBy {
            id
            username
          }
    }
  }
`


export const ALL_PRODUCTION_RECORDS = gql`
    query ListProductionForSale {
      allProductionRecords {
            id
            quantity
            product {
              id
              name
            }
            asset {
              id
              name
            }
      }
    }
  `

export const ALL_PRODUCTS = gql`
    query ListProductsForSale {
      allProducts {
            id
            name
            productType
            unit
      }
    }
  `

export const LIST_ASSETS = gql`
    query ListAssetsForSale {
      allLivestock {
            id
            name
            livestockType
      }
      allCrops {
            id
            name
            cropType
      }
    }
  `

export const LIST_PRODUCTION = gql`
  query ListProduction {
    allProductionRecords {
          id
          quantity
          productionDate
          notes
          product {
            id
            name
            unit
          }
          asset {
            id
            name
            assetType
          }
          recordedBy {
            id
            username
          }
    }
  }
`


export const LIST_EXPENSES = gql`
  query ListExpenses {
    allExpenses {
          id
          expenseType
          amount
          dateIncurred
          description
          asset {
            id
            name
          }
          farm {
            id
            name
          }
          recordedBy {
            id
            username
          }
    }
  }`

export const LIST_ASSET_PRODUCTS = gql`
  query ListAssetProducts {
    allAssetProducts {
          id
          productionRate
          notes
          asset {
            id
            name
            assetType
          }
          product {
            id
            name
            productType
            unit
          }
    }
  }
`

export const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalFarms
      totalAssets
      totalLivestock
      totalCrops
      totalEmployees
      recentSales {
        id
        saleDate
        totalAmount
        product {
          id
          name
        }
      }
      upcomingTasks {
        id
        title
        dueDate
        priority
      }
    }
  }
`

export const FINANCIAL_OVERVIEW = gql`
  query FinancialOverview {
    financialOverview {
      totalSales
      totalExpenses
      netProfit
      salesByCategory {
        category
        total
      }
      monthlyTrends {
        month
        totalSales
        totalExpenses
      }
    }
  }
`


export const LIST_CROPS = gql`
  query ListCrops($farmId: ID) {
    allCrops(farmId: $farmId) {
          id
          name
          cropType
          plantingDate
          harvestDate
          areaPlanted
          expectedYield
          yieldUnit
          farm {
            id
            name
          }
          isActive
    }
  }
`
