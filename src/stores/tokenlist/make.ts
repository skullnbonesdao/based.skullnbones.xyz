import { StarAtlasNFTAPI } from 'stores/tokenlist/StarAtlasNFT_Response'
import { Token } from 'stores/tokenlist/Token'

const staratlas_api = 'https://galaxy.staratlas.com/nfts'

const run = async () => {
  const tokenList: Token[] = []

  await fetch(staratlas_api)
    .then((res) => res.json())
    .then((data: StarAtlasNFTAPI[]) => {
      data.forEach((item) => {
        tokenList.push({
          name: item.name,
          mint: item.mint,
          symbol: item.symbol,
          decimals: 0,
          itemType: item.attributes.itemType,
          thumbnailUrl: getThumbnailUrl(item.symbol, item.attributes.itemType),
        })
      })
    })
  console.log(JSON.stringify(tokenList, null, 2))
  /* writeFileSync('tokenlist.json', JSON.stringify(tokenList))
   console.log('=== DONE ===')*/
}

function getThumbnailUrl(symbol: string, itemType: string) {
  if (itemType === 'ship') {
    return `https://storage.googleapis.com/nft-assets/items/ship-thumbs/${symbol}.png`
  }
  if (itemType === 'resource') {
    return `https://storage.googleapis.com/nft-assets/items/thumb-325/${symbol}.png`
  }
  return 'unknown.png'
}

run().then(() => {})
