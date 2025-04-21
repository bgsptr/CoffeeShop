export const ItemCategory: {
    COFFEE: 'COFFEE'
    TEA: 'TEA'
    FOOD: 'FOOD'
    DESSERT: 'DESSERT'
} = {
    COFFEE: 'COFFEE',
    TEA: 'TEA',
    FOOD: 'FOOD',
    DESSERT: 'DESSERT'
}

export type ItemCategory = typeof ItemCategory[keyof typeof ItemCategory]

export enum Category {
    COFFEE = 'COFFEE',
    TEA = 'TEA',
    FOOD = 'FOOD',
    DESSERT = 'DESSERT'
}

export const ItemStatus: {
    AVAILABLE: 'AVAILABLE'
    OUT_OF_STOCK: 'OUT_OF_STOCK'
} = {
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK'
}

export type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus]

export interface FetchItemQuery {
    keyword: string;
    type: string;
}

export const QueueStatus: {
    WAITING: 'WAITING'
    PROCESSED: 'PROCESSED'
    FINISHED: 'FINISHED'
} = {
    WAITING: 'WAITING',
    PROCESSED: 'PROCESSED',
    FINISHED: 'FINISHED'
}

export type QueueStatus = typeof QueueStatus[keyof typeof QueueStatus]


export const SortSQL : {
    ASC: 'asc'
    DESC: 'desc'
} = {
    ASC: 'asc',
    DESC: 'desc'
}

export type SortSQL = typeof SortSQL[keyof typeof SortSQL]

export const ChargeMidtransPaymentType : {
    BNI: 'bni'
    BCA: 'bca'
    MANDIRI: 'mandiri'
    BRI: 'bri'
    QRIS: 'qris'
} = {
    BNI: 'bni',
    BCA: 'bca',
    MANDIRI: 'mandiri',
    BRI: 'bri',
    QRIS: 'qris'
}

export type ChargeMidtransPaymentType = typeof ChargeMidtransPaymentType[keyof typeof ChargeMidtransPaymentType]

export const QrisAcquirerType : {
    GOPAY: 'gopay'
    SHOPEEPAY: 'shopeepay'
} = {
    GOPAY: 'gopay',
    SHOPEEPAY: 'shopeepay'
}

export type QrisAcquirerType = typeof QrisAcquirerType[keyof typeof QrisAcquirerType]