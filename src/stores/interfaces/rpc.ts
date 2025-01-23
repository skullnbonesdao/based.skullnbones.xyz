import type { PublicKey } from '@solana/web3.js'
import { type AccountInfo, type ParsedAccountData } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { TOKEN_PROGRAM_ID } from '@staratlas/anchor/dist/cjs/utils/token'

export async function getAccounts(addresses: PublicKey[]): Promise<
  {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
> {
  const allResults = await Promise.all(
    addresses.map((address) =>
      useRPCStore().connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 32,
              bytes: address.toBase58(),
            },
          },
        ],
        commitment: 'confirmed',
      }),
    ),
  )

  // Flatten array-of-arrays into a single array
  return allResults.flat()
}
