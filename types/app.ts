export type DirectMessage = {
    content: string | null
    created_at: string
    file_url: string | null
    id: string
    is_deleted: boolean
    updated_at: string
    user: string
    user_one: string
    user_two: string
}

export type User = {
    email: string | null
    full_name: string | null
    id: string
    latitude: number | null
    longitude: number | null
    updated_at: string
    username: string | null
}