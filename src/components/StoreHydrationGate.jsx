import { useEffect, useState } from 'react'
import { useFileStore } from '../store'
import LoadingSpinner from './ui/LoadingSpinner'
import { IDE } from '../styles/ideTokens'

function StoreHydrationGate({ children }) {
  const [hasHydrated, setHasHydrated] = useState(() =>
    useFileStore.persist.hasHydrated(),
  )

  useEffect(() => {
    const unsubscribe = useFileStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })

    useFileStore.persist.rehydrate()

    return unsubscribe
  }, [])

  if (!hasHydrated) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-4 ${IDE.bg}`}
      >
        <LoadingSpinner label="Restoring your project…" />
        <p className={`text-xs ${IDE.muted}`}>
          Loading from local storage
        </p>
      </div>
    )
  }

  return children
}

export default StoreHydrationGate
