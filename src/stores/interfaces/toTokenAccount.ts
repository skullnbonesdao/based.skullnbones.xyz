import { type AccountInfo, type ParsedAccountData, PublicKey } from '@solana/web3.js'
import tokenList from 'stores/tokenlist/TokenList.json'

export function toTokenAccount<T>(
  data: { pubkey: PublicKey; account: AccountInfo<Buffer | ParsedAccountData> }[],
): T[] {
  return data.flatMap((account) => {
    const parsedData = account.account.data as ParsedAccountData

    const mint = parsedData.parsed.info.mint.toString()

    return {
      name: tokenList.find((tl) => tl.mint == mint)?.name,
      symbol: tokenList.find((tl) => tl.mint == mint)?.symbol,
      itemType: tokenList.find((tl) => tl.mint == mint)?.itemType,
      thumbnailUrl: tokenList.find((tl) => tl.mint == mint)?.thumbnailUrl,

      key: new PublicKey(account.pubkey.toString()),
      mint: new PublicKey(mint),

      decimals: parsedData.parsed.info.tokenAmount.decimals,
      uiAmount: parsedData.parsed.info.tokenAmount.uiAmount,
      uiAmountSelected: parsedData.parsed.info.tokenAmount.uiAmount,
      uiAmountChange: 0,
    } as T
  })
}
