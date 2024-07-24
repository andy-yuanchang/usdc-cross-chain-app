import { IRIS_API_URL } from '@/constants/env'
import axios from 'axios'

const baseURL = `${IRIS_API_URL}/v1/attestations`
const axiosInstance = axios.create({ baseURL })

class AttestationClient {
  constructor() {}

  async getAttestation(messageHash: string) {
    try {
      const response = await axiosInstance.get(`/${messageHash}`)
      console.log(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}

export const attestationClient = new AttestationClient()
