import type { ZipEntryInput } from './support-bundle-types'

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c >>> 0
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff
  for (const b of buf) {
    const idx = (c ^ b) & 0xff
    c = crcTable[idx]! ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function dosDateTime(date: Date): { time: number; date: number } {
  const year = Math.max(1980, date.getFullYear())
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, date: dosDate }
}

function normalizeZipName(name: string): string {
  return name
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part.length > 0 && part !== '.' && part !== '..')
    .join('/')
}

export function buildStoredZipBuffer(rawEntries: ZipEntryInput[]): Buffer {
  const chunks: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0

  for (const entry of rawEntries) {
    const name = normalizeZipName(entry.name)
    if (name.length === 0) {
      continue
    }
    const nameBuf = Buffer.from(name, 'utf8')
    const data = entry.data
    const crc = crc32(data)
    const dt = dosDateTime(entry.mtime ?? new Date())

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x0800, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(dt.time, 10)
    local.writeUInt16LE(dt.date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)
    chunks.push(local, nameBuf, data)

    const cd = Buffer.alloc(46)
    cd.writeUInt32LE(0x02014b50, 0)
    cd.writeUInt16LE(20, 4)
    cd.writeUInt16LE(20, 6)
    cd.writeUInt16LE(0x0800, 8)
    cd.writeUInt16LE(0, 10)
    cd.writeUInt16LE(dt.time, 12)
    cd.writeUInt16LE(dt.date, 14)
    cd.writeUInt32LE(crc, 16)
    cd.writeUInt32LE(data.length, 20)
    cd.writeUInt32LE(data.length, 24)
    cd.writeUInt16LE(nameBuf.length, 28)
    cd.writeUInt16LE(0, 30)
    cd.writeUInt16LE(0, 32)
    cd.writeUInt16LE(0, 34)
    cd.writeUInt16LE(0, 36)
    cd.writeUInt32LE(0, 38)
    cd.writeUInt32LE(offset, 42)
    central.push(cd, nameBuf)

    offset += local.length + nameBuf.length + data.length
  }

  const centralStart = offset
  const centralSize = central.reduce((sum, b) => sum + b.length, 0)
  const entryCount = central.length / 2
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(entryCount, 8)
  end.writeUInt16LE(entryCount, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(centralStart, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...chunks, ...central, end])
}
