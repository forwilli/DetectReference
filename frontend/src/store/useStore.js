import { create } from 'zustand'

const useStore = create((set, get) => ({
  references: [],
  verificationResults: [],
  isVerifying: false,
  progress: 0,
  error: null,
  useStreaming: true,

  setReferences: (references) => set({ references }),
  
  setVerificationResults: (results) => set({ verificationResults: results }),
  
  addVerificationResult: (result) => set(state => {
    console.log('🏪 Store: Adding verification result', result)
    console.log('🏪 Store: Current results count:', state.verificationResults.length)
    const newResults = [...state.verificationResults, result]
    console.log('🏪 Store: New results count:', newResults.length)
    return { verificationResults: newResults }
  }),
  
  updateVerificationResult: (index, result) => set(state => {
    const newResults = [...state.verificationResults]
    newResults[index] = result
    return { verificationResults: newResults }
  }),
  
  setIsVerifying: (isVerifying) => set({ isVerifying }),
  
  setProgress: (progress) => set({ progress }),
  
  updateProgress: (progressData) => set({ 
    progress: progressData.percentage 
  }),
  
  setError: (error) => set({ error }),
  
  setUseStreaming: (useStreaming) => set({ useStreaming }),
  
  resetState: () => set({
    references: [],
    verificationResults: [],
    isVerifying: false,
    progress: 0,
    error: null
  })
}))

export default useStore