'use client'

import { useEffect, useState } from 'react'

import {
  getContracts,
  createContract,
  completeContract,
  missContract,
  type Contract,
} from '@/src/services/contracts'

import {
  getGoals,
  type Goal,
} from '@/src/services/goals'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [goals, setGoals] = useState<Goal[]>([])

  const [title, setTitle] = useState('')
  const [goalId, setGoalId] = useState('')
  const [deadline, setDeadline] = useState('')

  const [rewardXp, setRewardXp] = useState(100)
  const [penaltyReputation, setPenaltyReputation] =
    useState(20)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] =
    useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [contractsData, goalsData] =
        await Promise.all([
          getContracts(),
          getGoals(),
        ])

      setContracts(contractsData)
      setGoals(
        goalsData.filter(
          (goal) =>
            goal.status !==
            'completed',
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load data.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreateContract(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    if (
      !title.trim() ||
      !goalId ||
      !deadline
    ) {
      alert('Please fill all fields.')
      return
    }

    setSubmitting(true)

    try {
      await createContract({
        title,
        goalId,
        deadline,
        rewardXp,
        penaltyReputation,
      })

      setTitle('')
      setGoalId('')
      setDeadline('')
      setRewardXp(100)
      setPenaltyReputation(20)

      await loadData()
    } catch (err: any) {
      alert(
        err?.response?.data?.message ??
          'Failed to create commitment.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComplete(
    id: string,
  ) {
    try {
      await completeContract(id)
      await loadData()
    } catch (err: any) {
      alert(
        err?.response?.data?.message ??
          'Failed',
      )
    }
  }

  async function handleMiss(id: string) {
    try {
      await missContract(id)
      await loadData()
    } catch (err: any) {
      alert(
        err?.response?.data?.message ??
          'Failed',
      )
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Commitments
      </h1>

      <form
        onSubmit={handleCreateContract}
        className="mb-8 rounded-2xl border p-6"
      >
        <h2 className="mb-4 text-xl font-semibold">
          Create Commitment
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Commitment title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

          <select
            value={goalId}
            onChange={(e) =>
              setGoalId(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Goal
            </option>

            {goals.map((goal) => (
              <option
                key={goal.id}
                value={goal.id}
              >
                {goal.title}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(
                e.target.value,
              )
            }
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            value={rewardXp}
            onChange={(e) =>
              setRewardXp(
                Number(
                  e.target.value,
                ),
              )
            }
            placeholder="Reward XP"
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            value={penaltyReputation}
            onChange={(e) =>
              setPenaltyReputation(
                Number(
                  e.target.value,
                ),
              )
            }
            placeholder="Penalty Reputation"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg border px-4 py-2"
          >
            Create Commitment
          </button>
        </div>
      </form>

      {loading && (
        <p>Loading commitments...</p>
      )}

      {error && (
        <p className="mb-4 text-red-500">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {contracts.map(
          (contract) => (
            <div
              key={contract.id}
              className="rounded-2xl border p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {contract.title}
                  </h3>

                  <p className="text-sm opacity-70">
                    Reward:{' '}
                    {
                      contract.rewardXp
                    }{' '}
                    XP
                  </p>

                  <p className="text-sm opacity-70">
                    Penalty:{' '}
                    {
                      contract.penaltyReputation
                    }{' '}
                    Reputation
                  </p>

                  <p className="text-xs opacity-60">
                    Deadline:{' '}
                    {new Date(
                      contract.deadline,
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-2 text-sm">
                    Status:{' '}
                    {
                      contract.status
                    }
                  </p>
                </div>

                <div className="flex gap-2">
                  {contract.status !==
                  'completed' ? (
                    <button
                      onClick={() =>
                        handleComplete(
                          contract.id,
                        )
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      Complete
                    </button>
                  ) : (
                    <span className="rounded-lg border px-3 py-2 text-green-600">
                      Completed ✓
                    </span>
                  )}

                  {contract.status !==
                    'completed' &&
                    contract.status !==
                      'missed' && (
                      <button
                        onClick={() =>
                          handleMiss(
                            contract.id,
                          )
                        }
                        className="rounded-lg border px-3 py-2"
                      >
                        Miss
                      </button>
                    )}
                </div>
              </div>
            </div>
          ),
        )}

        {!loading &&
          contracts.length ===
            0 && (
            <div className="rounded-xl border p-6">
              No commitments found.
            </div>
          )}
      </div>
    </main>
  )
}