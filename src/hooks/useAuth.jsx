import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, query, where, getDocs,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      const data = snap.data()
      
      // Also fetch team name if teamId exists
      let teamName = ''
      if (data.teamId) {
        const teamSnap = await getDoc(doc(db, 'teams', data.teamId))
        if (teamSnap.exists()) {
          teamName = teamSnap.data().name
        }
      }

      const fullProfile = { ...data, teamName }
      setUserProfile(fullProfile)
      return fullProfile
    }
    return null
  }, [])

  const updateTeamName = async (newName) => {
    if (!userProfile?.teamId) return
    await updateDoc(doc(db, 'teams', userProfile.teamId), { name: newName })
    setUserProfile(prev => ({ ...prev, teamName: newName }))
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await refreshProfile(firebaseUser.uid)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [refreshProfile])

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await refreshProfile(cred.user.uid)
    return cred
  }

  const register = async (email, password, name, role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })

    let teamId = null
    let teamCode = null

    // If HR, create a team automatically
    if (role === 'hr') {
      teamCode = generateCode()
      const teamRef = await addDoc(collection(db, 'teams'), {
        name: `${name}'s Team`,
        code: teamCode,
        createdBy: cred.user.uid,
        createdAt: new Date().toISOString(),
      })
      teamId = teamRef.id
    }

    const profile = {
      name,
      email,
      role,
      teamId,
      teamCode,
      createdAt: new Date().toISOString(),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    }
    await setDoc(doc(db, 'users', cred.user.uid), profile)
    setUserProfile(profile)
    return cred
  }

  const joinTeam = async (code) => {
    // Find team by code
    const q = query(collection(db, 'teams'), where('code', '==', code.toUpperCase().trim()))
    const snap = await getDocs(q)
    if (snap.empty) throw new Error('Team not found. Check the code and try again.')

    const teamDoc = snap.docs[0]
    const teamId = teamDoc.id
    const teamData = teamDoc.data()

    // Update user profile with teamId
    await updateDoc(doc(db, 'users', user.uid), { teamId, teamCode: teamData.code })
    const updated = { ...userProfile, teamId, teamCode: teamData.code }
    setUserProfile(updated)
    return teamData
  }

  const updateAvatar = async (avatarConfig) => {
    await updateDoc(doc(db, 'users', user.uid), { avatarConfig })
    setUserProfile((prev) => ({ ...prev, avatarConfig }))
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout, joinTeam, refreshProfile, updateAvatar, updateTeamName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
