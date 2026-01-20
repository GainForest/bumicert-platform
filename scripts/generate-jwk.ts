import { generateKeyPair, exportJWK } from 'jose'

async function generateJWK() {
  console.log('Generating ES256 key pair for ATProto OAuth...\n')
  
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  const jwk = await exportJWK(privateKey)
  
  // Add required fields for ATProto
  jwk.use = 'sig'
  jwk.alg = 'ES256'
  
  const jwkString = JSON.stringify(jwk)
  
  console.log('✅ JWK Generated Successfully!\n')
  console.log('Copy the following line to your .env.local file:\n')
  console.log(`ATPROTO_JWK_PRIVATE='${jwkString}'\n`)
  console.log('⚠️  Keep this private key secret and never commit it to version control!')
}

generateJWK().catch(console.error)
