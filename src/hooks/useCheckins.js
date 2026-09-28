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

  const generateDemoData = useCallback(async (teamId) => {
    if (!userId) throw new Error('No userId')
    const moods = ['great', 'good', 'okay', 'low', 'bad']
    const today = new Date()
    const batch = []

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Skip some weekends randomly
      if (date.getDay() === 0 || (date.getDay() === 6 && Math.random() > 0.3)) continue

      // Weighted towards positive: 35% great, 30% good, 20% okay, 10% low, 5% bad
      const roll = Math.random()
      const mood = roll < 0.35 ? 'great' : roll < 0.65 ? 'good' : roll < 0.85 ? 'okay' : roll < 0.95 ? 'low' : 'bad'
      const energy = Math.floor(Math.random() * 4) + 6 // 6-9
      const stress = Math.floor(Math.random() * 5) + 1 // 1-5
      const mentalLoad = Math.floor(Math.random() * 5) + 1 // 1-5
      const dateStr = date.toISOString().split('T')[0]

      batch.push(
        addDoc(collection(db, 'checkins'), {
          userId,
          teamId,
          mood,
          energy,
          stress,
          mentalLoad,
          sleep: Math.random() > 0.4 ? 'yes' : 'no',
          date: dateStr,
          createdAt: Timestamp.fromDate(date),
        })
      )
    }

    await Promise.all(batch)
  }, [userId])

  const todayCheckin = checkins.find(
    (c) => c.date === new Date().toISOString().split('T')[0]
  )

  return { checkins, loading, error, addCheckin, generateDemoData, todayCheckin }
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
