export interface CommissionBreakdown {
  vecino: number;
  certificador: number;
  admin: number;
  total: number;
}

export interface CommissionRates {
  vecinoRate: number;
  certificadorRate: number;
  adminRate: number;
}

/**
 * Default commission rates based on the business model
 */
export const DEFAULT_COMMISSION_RATES: CommissionRates = {
  vecinoRate: 0.40,      // 40% for Vecino (store owner)
  certificadorRate: 0.35, // 35% for Certificador 
  adminRate: 0.25,       // 25% for Administration
};

/**
 * Calculate commission breakdown for a document
 */
export function calculateCommissions(
  documentPrice: number,
  customRates?: Partial<CommissionRates>
): CommissionBreakdown {
  const rates = { ...DEFAULT_COMMISSION_RATES, ...customRates };
  
  // Ensure rates add up to 100%
  const totalRate = rates.vecinoRate + rates.certificadorRate + rates.adminRate;
  if (Math.abs(totalRate - 1.0) > 0.01) {
    throw new Error("Commission rates must add up to 100%");
  }

  const vecino = Math.round(documentPrice * rates.vecinoRate);
  const certificador = Math.round(documentPrice * rates.certificadorRate);
  const admin = Math.round(documentPrice * rates.adminRate);

  // Adjust for rounding differences
  const calculatedTotal = vecino + certificador + admin;
  let adjustedAdmin = admin;
  
  if (calculatedTotal !== documentPrice) {
    adjustedAdmin = admin + (documentPrice - calculatedTotal);
  }

  return {
    vecino,
    certificador,
    admin: adjustedAdmin,
    total: documentPrice,
  };
}

/**
 * Calculate total commissions for multiple documents
 */
export function calculateTotalCommissions(
  documents: Array<{ price: number; customRates?: Partial<CommissionRates> }>
): CommissionBreakdown {
  const totals = documents.reduce(
    (acc, doc) => {
      const commissions = calculateCommissions(doc.price, doc.customRates);
      return {
        vecino: acc.vecino + commissions.vecino,
        certificador: acc.certificador + commissions.certificador,
        admin: acc.admin + commissions.admin,
        total: acc.total + commissions.total,
      };
    },
    { vecino: 0, certificador: 0, admin: 0, total: 0 }
  );

  return totals;
}

/**
 * Calculate monthly commission summary for a user
 */
export function calculateMonthlyCommissions(
  commissions: Array<{
    createdAt: string;
    vecinoAmount?: string;
    certificadorAmount?: string;
    adminAmount?: string;
    totalAmount: string;
    isPaid: boolean;
  }>,
  userRole: "vecino" | "certificador" | "admin",
  month?: Date
): {
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
  documentCount: number;
  averagePerDocument: number;
} {
  const targetMonth = month || new Date();
  
  const monthlyCommissions = commissions.filter(commission => {
    const commissionDate = new Date(commission.createdAt);
    return (
      commissionDate.getMonth() === targetMonth.getMonth() &&
      commissionDate.getFullYear() === targetMonth.getFullYear()
    );
  });

  const amounts = monthlyCommissions.map(commission => {
    let amount = 0;
    switch (userRole) {
      case "vecino":
        amount = parseFloat(commission.vecinoAmount || "0");
        break;
      case "certificador":
        amount = parseFloat(commission.certificadorAmount || "0");
        break;
      case "admin":
        amount = parseFloat(commission.adminAmount || "0");
        break;
    }
    return { amount, isPaid: commission.isPaid };
  });

  const totalEarned = amounts.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = amounts
    .filter(item => item.isPaid)
    .reduce((sum, item) => sum + item.amount, 0);
  const totalPending = totalEarned - totalPaid;
  const documentCount = monthlyCommissions.length;
  const averagePerDocument = documentCount > 0 ? totalEarned / documentCount : 0;

  return {
    totalEarned,
    totalPaid,
    totalPending,
    documentCount,
    averagePerDocument,
  };
}

/**
 * Calculate commission rate for a specific POS location
 */
export function calculatePosCommissionRate(
  baseRate: number,
  performanceMultiplier: number = 1.0,
  volumeBonus: number = 0
): number {
  const adjustedRate = baseRate * performanceMultiplier + volumeBonus;
  
  // Ensure rate doesn't exceed 50% (business rule)
  return Math.min(adjustedRate, 0.50);
}

/**
 * Estimate potential earnings for a POS location
 */
export function estimateMonthlyEarnings(
  averageDocumentsPerDay: number,
  averageDocumentPrice: number,
  commissionRate: number = DEFAULT_COMMISSION_RATES.vecinoRate,
  workingDaysPerMonth: number = 22
): {
  dailyEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  documentsPerMonth: number;
} {
  const dailyEarnings = averageDocumentsPerDay * averageDocumentPrice * commissionRate;
  const monthlyEarnings = dailyEarnings * workingDaysPerMonth;
  const yearlyEarnings = monthlyEarnings * 12;
  const documentsPerMonth = averageDocumentsPerDay * workingDaysPerMonth;

  return {
    dailyEarnings,
    monthlyEarnings,
    yearlyEarnings,
    documentsPerMonth,
  };
}

/**
 * Calculate payment distribution for batch payments
 */
export function calculateBatchPayments(
  commissions: Array<{
    id: number;
    vecinoId?: string;
    certificadorId?: string;
    vecinoAmount?: string;
    certificadorAmount?: string;
    adminAmount?: string;
    isPaid: boolean;
  }>
): {
  vecinoPayments: Map<string, { amount: number; commissionIds: number[] }>;
  certificadorPayments: Map<string, { amount: number; commissionIds: number[] }>;
  adminTotal: number;
  adminCommissionIds: number[];
} {
  const vecinoPayments = new Map<string, { amount: number; commissionIds: number[] }>();
  const certificadorPayments = new Map<string, { amount: number; commissionIds: number[] }>();
  let adminTotal = 0;
  const adminCommissionIds: number[] = [];

  commissions
    .filter(commission => !commission.isPaid)
    .forEach(commission => {
      // Process vecino payments
      if (commission.vecinoId && commission.vecinoAmount) {
        const amount = parseFloat(commission.vecinoAmount);
        const existing = vecinoPayments.get(commission.vecinoId) || { amount: 0, commissionIds: [] };
        vecinoPayments.set(commission.vecinoId, {
          amount: existing.amount + amount,
          commissionIds: [...existing.commissionIds, commission.id],
        });
      }

      // Process certificador payments
      if (commission.certificadorId && commission.certificadorAmount) {
        const amount = parseFloat(commission.certificadorAmount);
        const existing = certificadorPayments.get(commission.certificadorId) || { amount: 0, commissionIds: [] };
        certificadorPayments.set(commission.certificadorId, {
          amount: existing.amount + amount,
          commissionIds: [...existing.commissionIds, commission.id],
        });
      }

      // Process admin amounts
      if (commission.adminAmount) {
        adminTotal += parseFloat(commission.adminAmount);
        adminCommissionIds.push(commission.id);
      }
    });

  return {
    vecinoPayments,
    certificadorPayments,
    adminTotal,
    adminCommissionIds,
  };
}

/**
 * Validate commission calculation
 */
export function validateCommissionCalculation(
  documentPrice: number,
  commissions: CommissionBreakdown
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (commissions.total !== documentPrice) {
    errors.push(`Total commission (${commissions.total}) doesn't match document price (${documentPrice})`);
  }

  if (commissions.vecino + commissions.certificador + commissions.admin !== commissions.total) {
    errors.push("Individual commission amounts don't add up to total");
  }

  if (commissions.vecino < 0 || commissions.certificador < 0 || commissions.admin < 0) {
    errors.push("Commission amounts cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
