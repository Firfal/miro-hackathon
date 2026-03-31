import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useCheckins(userId) {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCheckins(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Checkins listener error:', err)
        setError(err.message)
        setLoading(false)
      },
    )
    return unsub
  }, [userId])

  const addCheckin = useCallback(async (data) => {
    if (!userId) throw new Error('No userId')
    const docRef = await addDoc(collection(db, 'checkins'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      date: new Date().toISOString().split('T')[0],
    })
    return docRef.id
  }, [userId])

  const todayCheckin = checkins.find(
    (c) => c.date === new Date().toISOString().split('T')[0]
  )

  return { checkins, loading, error, addCheckin, todayCheckin }
}

// For HR: get all checkins from team members
export function useTeamCheckins(teamId) {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) { setLoading(false); return }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const q = query(
      collection(db, 'checkins'),
      where('teamId', '==', teamId),
      orderBy('createdAt', 'desc'),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCheckins(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Team checkins listener error:', err)
        setLoading(false)
      },
    )
    return unsub
  }, [teamId])

  return { checkins, loading }
}

// Get all team members
export function useTeamMembers(teamId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) { setLoading(false); return }

    const q = query(
      collection(db, 'users'),
      where('teamId', '==', teamId),
      where('role', '==', 'employee'),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Team members listener error:', err)
        setLoading(false)
      },
    )
    return unsub
  }, [teamId])

  return { members, loading }
}
