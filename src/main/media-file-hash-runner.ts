import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'

async function digestFileHex(filePath: string, algorithm: 'md5' | 'sha256'): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash(algorithm)
    createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk: string | Buffer) => {
        hash.update(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
      })
      .on('end', () => resolve(hash.digest('hex')))
  })
}

export async function computeMediaFileHashes(
  filePath: string
): Promise<{ md5: string; sha256: string }> {
  const [md5, sha256] = await Promise.all([
    digestFileHex(filePath, 'md5'),
    digestFileHex(filePath, 'sha256')
  ])
  return { md5, sha256 }
}
