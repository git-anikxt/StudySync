import { api } from '@/src/lib/api'

export interface ChatMessage {
  _id: string
  roomId: string
  senderId: string
  senderName: string
  message: string
  createdAt?: string
  updatedAt?: string
}

interface ChatMessagesResponse {
  success?: boolean
  messages?: ChatMessage[]
}

export async function getRoomMessages(roomId: string) {
  const { data } = await api.get<ChatMessagesResponse>(`/chat/${roomId}`)

  return data.messages ?? []
}