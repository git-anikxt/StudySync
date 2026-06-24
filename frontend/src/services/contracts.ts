import { api } from '@/src/lib/api'

export interface Contract {
  id: string
  title?: string
  witnessId: string
  goalId: string
  deadline: string
  description?: string
  subject?: string
  status?: string
  completed?: boolean
  missed?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateContractPayload {
  witnessId: string
  goalId: string
  deadline: string
}

interface ContractsResponse {
  success?: boolean
  contract?: Contract
  contracts?: Contract[]
  data?: Contract[]
  result?: Contract[]
}

function normalizeContract(rawContract: Contract & { _id?: string }) {
  return {
    ...rawContract,
    id: rawContract.id ?? rawContract._id ?? '',
  }
}

function normalizeContracts(data: ContractsResponse | Contract[]) {
  const contracts = Array.isArray(data)
    ? data
    : data.contracts ?? data.data ?? data.result ?? []

  return contracts.map(normalizeContract)
}

export async function getContracts() {
  const { data } = await api.get<ContractsResponse | Contract[]>('/contracts')

  return normalizeContracts(data)
}

export async function createContract(payload: CreateContractPayload) {
  const { data } = await api.post<ContractsResponse | Contract>(
    '/contracts',
    payload,
  )

  return normalizeContract(
    'contract' in data && data.contract ? data.contract : (data as Contract),
  )
}

export async function completeContract(id: string) {
  const { data } = await api.patch<ContractsResponse | Contract>(
    `/contracts/${id}/complete`,
  )

  return normalizeContract(
    'contract' in data && data.contract ? data.contract : (data as Contract),
  )
}

export async function missContract(id: string) {
  const { data } = await api.patch<ContractsResponse | Contract>(
    `/contracts/${id}/miss`,
  )

  return normalizeContract(
    'contract' in data && data.contract ? data.contract : (data as Contract),
  )
}
