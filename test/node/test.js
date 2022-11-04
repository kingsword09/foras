import { deflate, Foras, gunzip, GzDecoder, GzEncoder, gzip, inflate, unzlib, zlib } from "@hazae41/foras";
import { readFileSync } from "fs";

Foras.initSyncBundledOnce()

const bytes = new TextEncoder().encode("Hello world")
console.log("Bytes", bytes)

{
  console.log("--- Deflate ---")

  const compressed = deflate(bytes)
  console.log("Compressed", compressed)

  const decompressed = inflate(compressed)
  console.log("Decompressed", decompressed)
}

{
  console.log("--- Gzip ---")

  const compressed = gzip(bytes)
  console.log("Compressed", compressed)

  const decompressed = gunzip(compressed)
  console.log("Decompressed", decompressed)
}

{
  console.log("--- Zlib ---")

  const compressed = zlib(bytes)
  console.log("Compressed", compressed)

  const decompressed = unzlib(compressed)
  console.log("Decompressed", decompressed)
}

function compress(compresser, encoder) {
  const input = readFileSync("./lorem.txt")
  const output = Buffer.allocUnsafe(input.length)

  let roffset = 0
  let woffset = 0

  while (roffset < input.length) {
    const end = Math.min(roffset + 1000, input.length)
    encoder.write(input.subarray(roffset, end))
    encoder.flush()
    roffset = end

    const compressed = encoder.read()
    output.set(compressed, woffset)
    woffset += compressed.length
    console.log(compressed.length)
  }

  const finish = encoder.finish()
  output.set(finish, woffset)
  woffset += finish.length
  console.log(finish)

  const compressed = compresser(output)

  console.log(output.equals(compressed))
}

function decompress(compresser, decoder) {
  const input = readFileSync("./lorem.txt")
  const output = Buffer.allocUnsafe(input.length)

  const compressed = compresser(input)

  let roffset = 0
  let woffset = 0

  while (roffset < compressed.length) {
    const end = Math.min(roffset + 1000, compressed.length)
    decoder.write(compressed.subarray(roffset, end))
    // decoder.flush()
    roffset = end

    const decompressed = decoder.read()
    output.set(decompressed, woffset)
    woffset += decompressed.length
  }

  const finish = decoder.finish()
  output.set(finish, woffset)
  woffset += finish.length

  console.log(output.equals(input))
}

{
  console.log("--- Gzip Encoder Stream ---")

  compress(gzip, new GzEncoder())
}

{
  console.log("--- Gzip Decoder Stream ---")

  decompress(gzip, new GzDecoder())
}