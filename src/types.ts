export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
};

export type AddLivestock = {
  __typename?: 'AddLivestock';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  livestock?: Maybe<LivestockOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type AnimalHealthStatsOutput = {
  __typename?: 'AnimalHealthStatsOutput';
  commonIssues?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  healthyCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  mortalityRate?: Maybe<Scalars['Float']['output']>;
  sickCount?: Maybe<Scalars['Int']['output']>;
  totalAnimals?: Maybe<Scalars['Int']['output']>;
  treatmentCost?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CompleteTask = {
  __typename?: 'CompleteTask';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  task?: Maybe<TaskOutput>;
};

export type CreateFarm = {
  __typename?: 'CreateFarm';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  farm?: Maybe<FarmOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateFarmSection = {
  __typename?: 'CreateFarmSection';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  section?: Maybe<FarmSectionOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateSale = {
  __typename?: 'CreateSale';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  sale?: Maybe<SaleOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateTask = {
  __typename?: 'CreateTask';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  task?: Maybe<TaskOutput>;
};

export type CreateUser = {
  __typename?: 'CreateUser';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserOutput>;
};

export type CropInput = {
  areaPlanted: Scalars['Float']['input'];
  cropTypeId: Scalars['ID']['input'];
  expectedYield?: InputMaybe<Scalars['Float']['input']>;
  harvestDate?: InputMaybe<Scalars['Date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  plantingDate: Scalars['Date']['input'];
  sectionId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type CropOutput = {
  __typename?: 'CropOutput';
  actualYield?: Maybe<Scalars['Float']['output']>;
  areaPlanted?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  cropType?: Maybe<CropTypeOutput>;
  expectedYield?: Maybe<Scalars['Float']['output']>;
  expenses?: Maybe<Array<Maybe<ExpenseOutput>>>;
  harvestDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  inventory?: Maybe<Array<Maybe<InventoryOutput>>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  plantingDate?: Maybe<Scalars['Date']['output']>;
  section?: Maybe<FarmSectionOutput>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CropProductionCostOutput = {
  __typename?: 'CropProductionCostOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  crop?: Maybe<CropOutput>;
  expectedRevenue?: Maybe<Scalars['Float']['output']>;
  expenseBreakdown?: Maybe<Scalars['GenericScalar']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  projectedProfit?: Maybe<Scalars['Float']['output']>;
  totalExpenses?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CropTypeOutput = {
  __typename?: 'CropTypeOutput';
  averageGrowthDuration?: Maybe<Scalars['Int']['output']>;
  averageYieldPerHectare?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  crops?: Maybe<Array<Maybe<CropOutput>>>;
  description?: Maybe<Scalars['String']['output']>;
  growingSeason?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CropYieldAnalysisOutput = {
  __typename?: 'CropYieldAnalysisOutput';
  averageYield?: Maybe<Scalars['Float']['output']>;
  bestPerformingSection?: Maybe<FarmSectionOutput>;
  costPerKg?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  cropType?: Maybe<CropTypeOutput>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  yieldTrend?: Maybe<Scalars['GenericScalar']['output']>;
};

export type DeleteUser = {
  __typename?: 'DeleteUser';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type EmployeePerformanceOutput = {
  __typename?: 'EmployeePerformanceOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  efficiencyScore?: Maybe<Scalars['Float']['output']>;
  employee?: Maybe<UserOutput>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  recentActivities?: Maybe<Scalars['GenericScalar']['output']>;
  sectionsManaged?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tasksCompleted?: Maybe<Scalars['Int']['output']>;
  tasksOverdue?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExpenseCategoryOutput = {
  __typename?: 'ExpenseCategoryOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  expenses?: Maybe<Array<Maybe<ExpenseOutput>>>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentCategory?: Maybe<ExpenseCategoryOutput>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExpenseInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['ID']['input'];
  dateIncurred: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  receiptReference?: InputMaybe<Scalars['String']['input']>;
  recordedById: Scalars['ID']['input'];
  relatedCropId?: InputMaybe<Scalars['ID']['input']>;
  relatedLivestockId?: InputMaybe<Scalars['ID']['input']>;
  relatedSectionId?: InputMaybe<Scalars['ID']['input']>;
};

export type ExpenseOutput = {
  __typename?: 'ExpenseOutput';
  amount?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<ExpenseCategoryOutput>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateIncurred?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  receiptReference?: Maybe<Scalars['String']['output']>;
  recordedBy?: Maybe<UserOutput>;
  relatedCrop?: Maybe<CropOutput>;
  relatedLivestock?: Maybe<LivestockOutput>;
  relatedSection?: Maybe<FarmSectionOutput>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FarmInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  establishedDate: Scalars['Date']['input'];
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
  totalHectares: Scalars['Float']['input'];
};

export type FarmOutput = {
  __typename?: 'FarmOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  establishedDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sections?: Maybe<Array<Maybe<FarmSectionOutput>>>;
  totalHectares?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FarmSectionInput = {
  farmId: Scalars['ID']['input'];
  managerId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  sectionType: Scalars['String']['input'];
  sizeHectares: Scalars['Float']['input'];
};

export type FarmSectionOutput = {
  __typename?: 'FarmSectionOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  crops?: Maybe<Array<Maybe<CropOutput>>>;
  farm?: Maybe<FarmOutput>;
  id?: Maybe<Scalars['ID']['output']>;
  inventory?: Maybe<Array<Maybe<InventoryOutput>>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  livestock?: Maybe<Array<Maybe<LivestockOutput>>>;
  manager?: Maybe<UserOutput>;
  name?: Maybe<Scalars['String']['output']>;
  sectionType?: Maybe<Scalars['String']['output']>;
  sizeHectares?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FarmSummaryType = {
  __typename?: 'FarmSummaryType';
  expenseByCategory?: Maybe<Scalars['GenericScalar']['output']>;
  leastProductiveSection?: Maybe<Scalars['String']['output']>;
  mostProductiveSection?: Maybe<Scalars['String']['output']>;
  netProfit?: Maybe<Scalars['Float']['output']>;
  revenueByCategory?: Maybe<Scalars['GenericScalar']['output']>;
  totalCropYield?: Maybe<Scalars['Float']['output']>;
  totalLivestockProducts?: Maybe<Scalars['Float']['output']>;
};

export type HarvestCrop = {
  __typename?: 'HarvestCrop';
  crop?: Maybe<CropOutput>;
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type InventoryInput = {
  expiryDate?: InputMaybe<Scalars['Date']['input']>;
  locationId: Scalars['ID']['input'];
  productTypeId: Scalars['ID']['input'];
  productionDate: Scalars['Date']['input'];
  qualityGrade?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  sourceCropId?: InputMaybe<Scalars['ID']['input']>;
  sourceLivestockId?: InputMaybe<Scalars['ID']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type InventoryOutput = {
  __typename?: 'InventoryOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiryDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<FarmSectionOutput>;
  productType?: Maybe<ProductTypeOutput>;
  productionDate?: Maybe<Scalars['Date']['output']>;
  qualityGrade?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  saleItems?: Maybe<Array<Maybe<SaleItemOutput>>>;
  sourceCrop?: Maybe<CropOutput>;
  sourceLivestock?: Maybe<LivestockOutput>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type InventoryValuationType = {
  __typename?: 'InventoryValuationType';
  nearExpiryItems?: Maybe<Array<Maybe<InventoryOutput>>>;
  slowMovingItems?: Maybe<Array<Maybe<InventoryOutput>>>;
  totalValue?: Maybe<Scalars['Float']['output']>;
  valuationByCategory?: Maybe<Scalars['JSONString']['output']>;
};

export type LivestockInput = {
  acquisitionDate: Scalars['Date']['input'];
  acquisitionMethod: Scalars['String']['input'];
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  identifier: Scalars['String']['input'];
  livestockTypeId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  sectionId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type LivestockOutput = {
  __typename?: 'LivestockOutput';
  acquisitionDate?: Maybe<Scalars['Date']['output']>;
  acquisitionMethod?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expenses?: Maybe<Array<Maybe<ExpenseOutput>>>;
  id?: Maybe<Scalars['ID']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  inventory?: Maybe<Array<Maybe<InventoryOutput>>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  livestockType?: Maybe<LivestockTypeOutput>;
  notes?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  section?: Maybe<FarmSectionOutput>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LivestockProductivityOutput = {
  __typename?: 'LivestockProductivityOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  feedCostPerUnit?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  livestockType?: Maybe<LivestockTypeOutput>;
  mortalityRate?: Maybe<Scalars['Float']['output']>;
  productTrend?: Maybe<Scalars['GenericScalar']['output']>;
  totalProducts?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LivestockTypeOutput = {
  __typename?: 'LivestockTypeOutput';
  averageLifespan?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  livestock?: Maybe<Array<Maybe<LivestockOutput>>>;
  maturityAge?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginUser = {
  __typename?: 'LoginUser';
  refreshToken?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserOutput>;
};

export type PayrollInput = {
  basicSalary: Scalars['Float']['input'];
  bonuses?: InputMaybe<Scalars['Float']['input']>;
  deductions?: InputMaybe<Scalars['Float']['input']>;
  employeeId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  payPeriodEnd: Scalars['Date']['input'];
  payPeriodStart: Scalars['Date']['input'];
  paymentDate: Scalars['Date']['input'];
  paymentMethod: Scalars['String']['input'];
  tax?: InputMaybe<Scalars['Float']['input']>;
};

export type PayrollOutput = {
  __typename?: 'PayrollOutput';
  basicSalary?: Maybe<Scalars['Float']['output']>;
  bonuses?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deductions?: Maybe<Scalars['Float']['output']>;
  employee?: Maybe<UserOutput>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  netPay?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  payPeriodEnd?: Maybe<Scalars['Date']['output']>;
  payPeriodStart?: Maybe<Scalars['Date']['output']>;
  paymentDate?: Maybe<Scalars['Date']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  tax?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PendingTasksOutput = {
  __typename?: 'PendingTasksOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  highPriority?: Maybe<Array<Maybe<TaskOutput>>>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lowPriority?: Maybe<Array<Maybe<TaskOutput>>>;
  mediumPriority?: Maybe<Array<Maybe<TaskOutput>>>;
  overdueTasks?: Maybe<Array<Maybe<TaskOutput>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PlantCrop = {
  __typename?: 'PlantCrop';
  crop?: Maybe<CropOutput>;
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ProcessPayroll = {
  __typename?: 'ProcessPayroll';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  payroll?: Maybe<PayrollOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ProductTypeOutput = {
  __typename?: 'ProductTypeOutput';
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  inventory?: Maybe<Array<Maybe<InventoryOutput>>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shelfLife?: Maybe<Scalars['Int']['output']>;
  unitOfMeasure?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProfitLossStatementOutput = {
  __typename?: 'ProfitLossStatementOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expenseByCategory?: Maybe<Scalars['GenericScalar']['output']>;
  grossProfit?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  leastProfitableProduct?: Maybe<Scalars['String']['output']>;
  mostProfitableProduct?: Maybe<Scalars['String']['output']>;
  netProfit?: Maybe<Scalars['Float']['output']>;
  revenueByCategory?: Maybe<Scalars['GenericScalar']['output']>;
  totalExpenses?: Maybe<Scalars['Float']['output']>;
  totalRevenue?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RecordCropProduct = {
  __typename?: 'RecordCropProduct';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  inventory?: Maybe<InventoryOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RecordExpense = {
  __typename?: 'RecordExpense';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  expense?: Maybe<ExpenseOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RecordLivestockProduct = {
  __typename?: 'RecordLivestockProduct';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  inventory?: Maybe<InventoryOutput>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RefreshToken = {
  __typename?: 'RefreshToken';
  user?: Maybe<UserOutput>;
};

export type ResourceUtilizationOutput = {
  __typename?: 'ResourceUtilizationOutput';
  costPerHectare?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  equipmentUtilization?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  laborUtilization?: Maybe<Scalars['Float']['output']>;
  section?: Maybe<FarmSectionOutput>;
  spaceUtilization?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RootMutation = {
  __typename?: 'RootMutation';
  addLivestock?: Maybe<AddLivestock>;
  completeTask?: Maybe<CompleteTask>;
  createFarm?: Maybe<CreateFarm>;
  createFarmSection?: Maybe<CreateFarmSection>;
  createSale?: Maybe<CreateSale>;
  createTask?: Maybe<CreateTask>;
  createUser?: Maybe<CreateUser>;
  deleteUser?: Maybe<DeleteUser>;
  harvestCrop?: Maybe<HarvestCrop>;
  loginUser?: Maybe<LoginUser>;
  plantCrop?: Maybe<PlantCrop>;
  processPayroll?: Maybe<ProcessPayroll>;
  recordCropProduct?: Maybe<RecordCropProduct>;
  recordExpense?: Maybe<RecordExpense>;
  recordLivestockProduct?: Maybe<RecordLivestockProduct>;
  refreshToken?: Maybe<RefreshToken>;
  updateUser?: Maybe<UpdateUser>;
};


export type RootMutationAddLivestockArgs = {
  input: LivestockInput;
};


export type RootMutationCompleteTaskArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationCreateFarmArgs = {
  input: FarmInput;
};


export type RootMutationCreateFarmSectionArgs = {
  input: FarmSectionInput;
};


export type RootMutationCreateSaleArgs = {
  input: SaleInput;
  items: Array<InputMaybe<SaleItemInput>>;
};


export type RootMutationCreateTaskArgs = {
  input: TaskInput;
};


export type RootMutationCreateUserArgs = {
  input: UserInput;
};


export type RootMutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationHarvestCropArgs = {
  actualYield: Scalars['Float']['input'];
  harvestDate: Scalars['Date']['input'];
  id: Scalars['ID']['input'];
};


export type RootMutationLoginUserArgs = {
  input: LoginInput;
};


export type RootMutationPlantCropArgs = {
  input: CropInput;
};


export type RootMutationProcessPayrollArgs = {
  input: PayrollInput;
};


export type RootMutationRecordCropProductArgs = {
  input: InventoryInput;
};


export type RootMutationRecordExpenseArgs = {
  input: ExpenseInput;
};


export type RootMutationRecordLivestockProductArgs = {
  input: InventoryInput;
};


export type RootMutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UserInput;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  allUsers?: Maybe<Array<Maybe<UserOutput>>>;
  animalHealthStats?: Maybe<AnimalHealthStatsOutput>;
  cropProductionCost?: Maybe<CropProductionCostOutput>;
  cropYieldAnalysis?: Maybe<CropYieldAnalysisOutput>;
  employeePerformanceMetrics?: Maybe<EmployeePerformanceOutput>;
  farmProductivityReport?: Maybe<FarmSummaryType>;
  inventoryValuation?: Maybe<InventoryValuationType>;
  livestockProductivity?: Maybe<LivestockProductivityOutput>;
  pendingTasks?: Maybe<PendingTasksOutput>;
  profitLossStatement?: Maybe<ProfitLossStatementOutput>;
  resourceUtilization?: Maybe<ResourceUtilizationOutput>;
};


export type RootQueryAnimalHealthStatsArgs = {
  livestockTypeId?: InputMaybe<Scalars['ID']['input']>;
  sectionId?: InputMaybe<Scalars['ID']['input']>;
};


export type RootQueryCropProductionCostArgs = {
  cropId: Scalars['ID']['input'];
};


export type RootQueryCropYieldAnalysisArgs = {
  cropTypeId?: InputMaybe<Scalars['ID']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryEmployeePerformanceMetricsArgs = {
  employeeId?: InputMaybe<Scalars['ID']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryFarmProductivityReportArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};


export type RootQueryInventoryValuationArgs = {
  asOfDate?: InputMaybe<Scalars['Date']['input']>;
};


export type RootQueryLivestockProductivityArgs = {
  livestockTypeId?: InputMaybe<Scalars['ID']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryPendingTasksArgs = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryProfitLossStatementArgs = {
  byCategory?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};


export type RootQueryResourceUtilizationArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  sectionId?: InputMaybe<Scalars['ID']['input']>;
};

export type SaleInput = {
  customerContact?: InputMaybe<Scalars['String']['input']>;
  customerName: Scalars['String']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod: Scalars['String']['input'];
  paymentStatus: Scalars['String']['input'];
  recordedById: Scalars['ID']['input'];
  totalAmount: Scalars['Float']['input'];
};

export type SaleItemInput = {
  inventoryId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
  saleId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type SaleItemOutput = {
  __typename?: 'SaleItemOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  inventory?: Maybe<InventoryOutput>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  sale?: Maybe<SaleOutput>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SaleOutput = {
  __typename?: 'SaleOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customerContact?: Maybe<Scalars['String']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  items?: Maybe<Array<Maybe<SaleItemOutput>>>;
  notes?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus?: Maybe<Scalars['String']['output']>;
  recordedBy?: Maybe<UserOutput>;
  saleDate?: Maybe<Scalars['DateTime']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TaskInput = {
  assignedById: Scalars['ID']['input'];
  assignedToId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  dueDate: Scalars['Date']['input'];
  priority: Scalars['String']['input'];
  relatedCropId?: InputMaybe<Scalars['ID']['input']>;
  relatedLivestockId?: InputMaybe<Scalars['ID']['input']>;
  relatedSectionId?: InputMaybe<Scalars['ID']['input']>;
  status: Scalars['String']['input'];
  taskType: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type TaskOutput = {
  __typename?: 'TaskOutput';
  assignedBy?: Maybe<UserOutput>;
  assignedTo?: Maybe<UserOutput>;
  completedDate?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  relatedCrop?: Maybe<CropOutput>;
  relatedLivestock?: Maybe<LivestockOutput>;
  relatedSection?: Maybe<FarmSectionOutput>;
  status?: Maybe<Scalars['String']['output']>;
  taskType?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  errors?: Maybe<Scalars['GenericScalar']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserOutput>;
};

export type UserInput = {
  dateHired?: InputMaybe<Scalars['Date']['input']>;
  email: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
  salary?: InputMaybe<Scalars['Float']['input']>;
  username: Scalars['String']['input'];
};

export type UserOutput = {
  __typename?: 'UserOutput';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateHired?: Maybe<Scalars['Date']['output']>;
  dateJoined?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  managedSections?: Maybe<Array<Maybe<FarmSectionOutput>>>;
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};
