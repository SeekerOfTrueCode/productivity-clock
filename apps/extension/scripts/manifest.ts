import { getManifest } from '../src/manifest'
import { log, r } from './utils'
import { writeJSON } from 'fs-extra'

export async function writeManifest () {
  await writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
