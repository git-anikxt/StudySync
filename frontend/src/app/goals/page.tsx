'use client'

import { useEffect, useState } from 'react'

import {
    getGoals,
    createGoal,
    completeGoal,
    deleteGoal,
    type Goal,
} from '@/src/services/goals'

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function loadGoals() {
        setLoading(true)

        try {
            const data = await getGoals()
            setGoals(data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load goals'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadGoals()
    }, [])

    async function handleCreateGoal(
        e: React.FormEvent
    ) {
        e.preventDefault()

        if (
            !title.trim() ||
            !description.trim() ||
            !deadline
        ) {
            return
        }

        setSubmitting(true)

        try {
            await createGoal({
                title,
                description,
                deadline,
            })

            setTitle('')
            setDescription('')
            setDeadline('')

            await loadGoals()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create goal'
            )
        } finally {
            setSubmitting(false)
        }
    }

    async function handleCompleteGoal(
        id: string
    ) {
        try {
            await completeGoal(id)
            await loadGoals()
        } catch (err: any) {
            alert(
                err?.response?.data?.message ??
                "Failed to complete goal"
            )
        }
    }

    async function handleDeleteGoal(
        id: string
    ) {
        try {
            await deleteGoal(id)
            await loadGoals()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="mx-auto max-w-5xl p-8">
            <h1 className="mb-6 text-3xl font-bold">
                Goals
            </h1>

            <form
                onSubmit={handleCreateGoal}
                className="mb-8 rounded-2xl border p-6"
            >
                <h2 className="mb-4 text-xl font-semibold">
                    Create Goal
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Goal title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) =>
                            setDeadline(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border p-3"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg border px-4 py-2"
                    >
                        Create Goal
                    </button>
                </div>
            </form>

            {loading && (
                <p>Loading goals...</p>
            )}

            {error && (
                <p className="mb-4 text-red-500">
                    {error}
                </p>
            )}

            <div className="space-y-4">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className="rounded-2xl border p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    {goal.title}
                                </h3>

                                <p className="text-sm opacity-70">
                                    {goal.description}
                                </p>

                                <p className="mt-2 text-xs opacity-60">
                                    Deadline:{' '}
                                    {goal.deadline
                                        ? new Date(
                                            goal.deadline
                                        ).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {goal.status !== "completed" ? (
                                    <button
                                        onClick={() =>
                                            handleCompleteGoal(goal.id)
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

                                <button
                                    onClick={() =>
                                        handleDeleteGoal(
                                            goal.id
                                        )
                                    }
                                    className="rounded-lg border px-3 py-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!loading &&
                    goals.length === 0 && (
                        <div className="rounded-xl border p-6">
                            No goals found.
                        </div>
                    )}
            </div>
        </main>
    )
}