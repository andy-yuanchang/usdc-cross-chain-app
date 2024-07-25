import { IRIS_API_URL } from '@/constants/env'
import axios, { type AxiosInstance } from 'axios'

interface AttestationResponse {
  attestation: string
  status: 'complete' | 'pending_confirmations'
}

const baseURL = `${IRIS_API_URL}/v1/attestations`

class AttestationClient {
  private instance: AxiosInstance
  constructor() {
    this.instance = axios.create({ baseURL })
  }

  async getAttestation(messageHash: string): Promise<string> {
    let attestationResponse: AttestationResponse = {
      attestation: '',
      status: 'pending_confirmations'
    }
    while (attestationResponse.status != 'complete') {
      const response = await this.instance.get<AttestationResponse>(
        `/${messageHash}`
      )
      console.log(response.data)
      attestationResponse = response.data
      await new Promise((r) => setTimeout(r, 2000))
    }
    console.log({ signature: attestationResponse.attestation })
    return attestationResponse.attestation
  }
}

export const attestationClient = new AttestationClient()
