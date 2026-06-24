import { api } from '@/src/lib/api'

export interface StudyRoom {
  id: string
  name: string
  subject: string
  members?: number
  memberCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateStudyRoomPayload {
  name: string
  subject: string
}

interface StudyRoomsResponse {
  success?: boolean
  room?: StudyRoom
  studyRoom?: StudyRoom
  rooms?: StudyRoom[]
  studyRooms?: StudyRoom[]
  data?: StudyRoom[]
  result?: StudyRoom[]
}

function normalizeStudyRoom(rawRoom: StudyRoom & { _id?: string }) {
  return {
    ...rawRoom,
    id: rawRoom.id ?? rawRoom._id ?? '',
  }
}

function normalizeStudyRooms(data: StudyRoomsResponse | StudyRoom[]) {
  const rooms = Array.isArray(data)
    ? data
    : data.studyRooms ?? data.rooms ?? data.data ?? data.result ?? []

  return rooms.map(normalizeStudyRoom)
}

export async function getStudyRooms() {
  const { data } = await api.get<StudyRoomsResponse | StudyRoom[]>(
    '/study-rooms',
  )

  return normalizeStudyRooms(data)
}

export async function createStudyRoom(payload: CreateStudyRoomPayload) {
  const { data } = await api.post<StudyRoomsResponse | StudyRoom>(
    '/study-rooms',
    payload,
  )

  return normalizeStudyRoom(
    !Array.isArray(data) && data.room
      ? data.room
      : !Array.isArray(data) && data.studyRoom
        ? data.studyRoom
        : (data as StudyRoom),
  )
}
