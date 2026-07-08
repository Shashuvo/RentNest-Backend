export interface CreatePropertyPayload {
    title: string,
    description: string,
    address: string,
    city: string,
    area?: number,
    price: number,
    bedrooms?: number,
    bathrooms?: number,
    images?: string[],
    categoryId: string
}

export interface UpdatePropertyPayload {
    title?: string,
    description?: string,
    address?: string,
    city?: string,
    area?: number,
    price?: number,
    bedrooms?: number,
    bathrooms?: number,
    images?: string[],
    isAvailable?: boolean,
    categoryId?: string
}