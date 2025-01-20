import type { cNFT, cNFTProof } from 'stores/interfaces/cNFT'
import { PublicKey } from '@solana/web3.js'

export async function getCrewProof(crew: PublicKey) {
  //const url = 'https://rpc.shyft.to?api_key=OmPgW85HNcfF-a-9'
  const url = 'https://mainnet.helius-rpc.com/?api-key=63494a33-7e60-487d-97d5-b1cc16f899a7'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetProof',
      params: {
        id: crew.toBase58(),
      },
    }),
  })
  const result = (await response.json()).result

  const proofs: cNFTProof = {
    nodeIndex: result.node_index,
    leafId: new PublicKey(result.leaf),
    proof: result.proof.map((p: never) => new PublicKey(p)),
    root: new PublicKey(result.root),
    merkleTree: new PublicKey(result.tree_id),
  }

  return proofs
}

export async function searchCrewByOwner(owner: PublicKey) {
  let crew: cNFT[] = []
  //const url = 'https://rpc.shyft.to?api_key=OmPgW85HNcfF-a-9'
  const url = 'https://mainnet.helius-rpc.com/?api-key=63494a33-7e60-487d-97d5-b1cc16f899a7'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'searchAssets',
      params: {
        // Returning only compressed items.
        compressed: true,
        // Example wallet
        ownerAddress: owner,
        // Drip Haus collection ID.
        grouping: ['collection', 'CREWSAACJTKHKhZi96pLRJXsxiGbdZaQHdFW9r7qGJkB'],
        page: 1,
      },
    }),
  })
  const data = await response.json()
  if (data.result?.items) crew = data.result.items
  return crew
}
