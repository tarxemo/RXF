import { gql } from '@apollo/client';

// Authentication
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
      user {
        id
        username
        email
        phone
        role
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

// User Management
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        id
        username
        email
        phone
        role
        isActive
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      user {
        id
        username
        email
        phone
        role
        isActive
      }
    }
  }
`;

// Farm Management
export const CREATE_FARM = gql`
  mutation CreateFarm($input: FarmInput!) {
    createFarm(input: $input) {
      farm {
        id
        name
        location
        totalHectares
        establishedDate
        manager {
          id
          username
        }
      }
    }
  }
`;

export const UPDATE_FARM = gql`
  mutation UpdateFarm($id: ID!, $input: FarmInput!) {
    updateFarm(id: $id, input: $input) {
      farm {
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
  }
`;

// Asset Management
export const CREATE_LIVESTOCK = gql`
  mutation CreateLivestock($input: LivestockInput!) {
    createLivestock(input: $input) {
      livestock {
        id
        name
        livestockType
        breed
        farm {
          id
          name
        }
      }
    }
  }
`;


// Livestock Management
export const UPDATE_LIVESTOCK = gql`
  mutation UpdateLivestock($id: ID!, $input: LivestockInput!) {
    updateLivestock(id: $id, input: $input) {
      livestock {
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
        isActive
      }
    }
  }
`;


// export const CREATE_CROP = gql`
//   mutation CreateCrop($input: CropInput!) {
//     createCrop(input: $input) {
//       crop {
//         id
//         name
//         cropType
//         plantingDate
//         areaPlanted
//         farm {
//           id
//           name
//         }
//       }
//     }
//   }
// `;

export const RECORD_LIVESTOCK_PRODUCTION = gql`
  mutation RecordLivestockProduction(
    $livestockId: ID!
    $productId: ID!
    $quantity: Float!
    $productionDate: Date!
    $notes: String
  ) {
    recordLivestockProduction(
      livestockId: $livestockId
      productId: $productId
      quantity: $quantity
      productionDate: $productionDate
      notes: $notes
    ) {
      production {
        id
        quantity
        productionDate
        product {
          id
          name
        }
      }
    }
  }
`;

export const RECORD_CROP_HARVEST = gql`
  mutation RecordCropHarvest(
    $cropId: ID!
    $productId: ID!
    $quantity: Float!
    $harvestDate: Date!
    $notes: String
  ) {
    recordCropHarvest(
      cropId: $cropId
      productId: $productId
      quantity: $quantity
      harvestDate: $harvestDate
      notes: $notes
    ) {
      production {
        id
        quantity
        productionDate
        product {
          id
          name
        }
      }
      crop {
        id
        harvestDate
      }
    }
  }
`;

// Financial Management
export const RECORD_EXPENSE = gql`
  mutation RecordExpense($input: ExpenseInput!) {
    recordExpense(input: $input) {
      expense {
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
      }
    }
  }
`;

export const RECORD_SALE = gql`
  mutation RecordSale($input: SaleInput!) {
    recordSale(input: $input) {
      sale {
        id
        saleType
        quantity
        unitPrice
        totalAmount
        saleDate
        buyer
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
  }
`;

// Business Operations
export const BREED_LIVESTOCK = gql`
  mutation BreedLivestock(
    $motherId: ID!
    $fatherId: ID!
    $birthDate: Date!
    $count: Int!
    $notes: String
  ) {
    breedLivestock(
      motherId: $motherId
      fatherId: $fatherId
      birthDate: $birthDate
      count: $count
      notes: $notes
    ) {
      offspring {
        id
        name
        livestockType
        gender
      }
    }
  }
`;

export const PROCESS_BATCH_SALE = gql`
  mutation ProcessBatchSale(
    $productionIds: [ID!]!
    $unitPrice: Decimal!
    $saleDate: Date!
    $buyer: String
    $notes: String
  ) {
    processBatchSale(
      productionIds: $productionIds
      unitPrice: $unitPrice
      saleDate: $saleDate
      buyer: $buyer
      notes: $notes
    ) {
      sales {
        id
        totalAmount
        product {
          id
          name
        }
      }
    }
  }
`;


export const CREATE_SALE = gql`
  mutation CreateSale($input: SaleInput!) {
    recordSale(input: $input) {
      sale {
        id
        saleType
        quantity
        unitPrice
        totalAmount
        saleDate
        buyer
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
  }
`

export const DELETE_SALE = gql`
  mutation DeleteSale($id: ID!) {
    deleteSale(id: $id) {
      success
    }
  }
`


export const CREATE_PRODUCTION = gql`
  mutation CreateProduction($input: ProductionRecordInput!) {
    createProductionRecord(input: $input) {
      production {
        id
        quantity
        productionDate
        notes
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
  }
`

export const DELETE_PRODUCTION = gql`
  mutation DeleteProduction($id: ID!) {
    deleteProductionRecord(id: $id) {
      success
    }
  }
`

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: ExpenseInput!) {
    recordExpense(input: $input) {
      expense {
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
      }
    }
  }
`

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      success
    }
  }
`


export const CREATE_ASSET = gql`
  mutation CreateAsset($input: AssetInput!) {
    createAsset(input: $input) {
      asset {
        id
        name
        assetType
        farm {
          id
          name
        }
        acquisitionDate
        initialCost
        notes
      }
    }
  }
`

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      asset {
        id
        name
        assetType
        ... on Livestock {
          breed
          isBreedingStock
        }
        ... on Crop {
          harvestDate
          expectedYield
        }
        notes
        isActive
      }
    }
  }
`

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id) {
      success
    }
  }
`

export const CREATE_ASSET_PRODUCT = gql`
  mutation CreateAssetProduct($input: AssetProductInput!) {
    createAssetProduct(input: $input) {
      assetProduct {
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
  }
`

export const DELETE_ASSET_PRODUCT = gql`
  mutation DeleteAssetProduct($id: ID!) {
    deleteAssetProduct(id: $id) {
      success
    }
  }
`


export const CREATE_UPDATE_PRODUCT = gql`
  mutation CreateUpdateProduct($input: ProductInput!) {
    createUpdateProduct(input: $input) {
      product {
        id
        name
        productType
        description
        unit
      }
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
    }
  }
`

export const MANAGE_PRODUCT_PRODUCTION = gql`
  mutation ManageProductProduction($input: ProductProductionInput!) {
    manageProductProduction(input: $input) {
      production {
        id
        productionRate
        notes
        product {
          id
          name
        }
        asset {
          id
          name
          assetType
        }
      }
    }
  }
`

export const DELETE_PRODUCT_PRODUCTION = gql`
  mutation DeleteProductProduction($id: ID!) {
    deleteProductProduction(id: $id) {
      success
    }
  }
`


export const CREATE_CROP = gql`
  mutation CreateCrop($input: CropInput!) {
    createCrop(input: $input) {
      crop {
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
      }
    }
  }
`

export const UPDATE_CROP = gql`
  mutation UpdateCrop($id: ID!, $input: CropInput!) {
    updateCrop(id: $id, input: $input) {
      crop {
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
      }
    }
  }
`

export const DELETE_CROP = gql`
  mutation DeleteCrop($id: ID!) {
    deleteCrop(id: $id) {
      success
    }
  }
`
